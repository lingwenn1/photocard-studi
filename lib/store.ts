"use client";

import { create } from "zustand";
import {
  Corners,
  CornerId,
  Transform,
  CardholderTextureKind,
  FilmPrintKind,
  PlacedSticker,
  TextLayer,
  BackgroundKind,
  FilterPreset,
  AdjustState,
  EditorSnapshot,
} from "@/types";

const defaultCorners: Corners = {
  tl: { cut: false, radius: 28 },
  tr: { cut: false, radius: 28 },
  bl: { cut: false, radius: 28 },
  br: { cut: false, radius: 28 },
};

const defaultTransform: Transform = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
};

const defaultAdjust: AdjustState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
};

function snapshotOf(s: EditorState): EditorSnapshot {
  return {
    transform: { ...s.transform },
    corners: JSON.parse(JSON.stringify(s.corners)),
    cornerRadius: s.cornerRadius,
    cardholder: s.cardholder,
    filmPrint: s.filmPrint,
    stickers: JSON.parse(JSON.stringify(s.stickers)),
    texts: JSON.parse(JSON.stringify(s.texts)),
    background: s.background,
    filter: s.filter,
    adjust: { ...s.adjust },
  };
}

interface EditorState {
  imageSrc: string | null;
  imageName: string | null;
  transform: Transform;
  corners: Corners;
  cornerRadius: number;
  cardholder: CardholderTextureKind | null;
  cardholderAnimIn: boolean; // трогается ли анимация "заезда" фото
  filmPrint: FilmPrintKind;
  stickers: PlacedSticker[];
  texts: TextLayer[];
  background: BackgroundKind;
  filter: FilterPreset;
  adjust: AdjustState;
  activeTool:
    | "transform"
    | "stapler"
    | "cardholder"
    | "stickers"
    | "text"
    | "background"
    | "filters"
    | "export";

  history: EditorSnapshot[];
  future: EditorSnapshot[];

  setImage: (src: string, name: string) => void;
  resetImage: () => void;
  setTransform: (t: Partial<Transform>) => void;
  toggleCorner: (id: CornerId) => void;
  setCornerRadius: (r: number) => void;
  setActiveTool: (tool: EditorState["activeTool"]) => void;
  setCardholder: (id: CardholderTextureKind | null) => void;
  setFilmPrint: (p: FilmPrintKind) => void;
  addSticker: (s: PlacedSticker) => void;
  updateSticker: (id: string, patch: Partial<PlacedSticker>) => void;
  removeSticker: (id: string) => void;
  duplicateSticker: (id: string) => void;
  addText: (t: TextLayer) => void;
  updateText: (id: string, patch: Partial<TextLayer>) => void;
  removeText: (id: string) => void;
  setBackground: (b: BackgroundKind) => void;
  setFilter: (f: FilterPreset) => void;
  setAdjust: (a: Partial<AdjustState>) => void;

  commit: () => void; // push current state to history
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  imageSrc: null,
  imageName: null,
  transform: { ...defaultTransform },
  corners: JSON.parse(JSON.stringify(defaultCorners)),
  cornerRadius: 28,
  cardholder: null,
  cardholderAnimIn: false,
  filmPrint: "none",
  stickers: [],
  texts: [],
  background: "white",
  filter: "none",
  adjust: { ...defaultAdjust },
  activeTool: "transform",

  history: [],
  future: [],

  setImage: (src, name) =>
    set({
      imageSrc: src,
      imageName: name,
      transform: { ...defaultTransform },
      corners: JSON.parse(JSON.stringify(defaultCorners)),
      stickers: [],
      texts: [],
      cardholder: null,
      filmPrint: "none",
      filter: "none",
      adjust: { ...defaultAdjust },
      background: "white",
      history: [],
      future: [],
    }),

  resetImage: () => set({ imageSrc: null, imageName: null }),

  setTransform: (t) => set((s) => ({ transform: { ...s.transform, ...t } })),

  toggleCorner: (id) =>
    set((s) => ({
      corners: {
        ...s.corners,
        [id]: { ...s.corners[id], cut: !s.corners[id].cut },
      },
    })),

  setCornerRadius: (r) =>
    set((s) => {
      const corners = { ...s.corners };
      (Object.keys(corners) as CornerId[]).forEach((k) => {
        corners[k] = { ...corners[k], radius: r };
      });
      return { cornerRadius: r, corners };
    }),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setCardholder: (id) => set({ cardholder: id, cardholderAnimIn: true }),

  setFilmPrint: (p) => set({ filmPrint: p }),

  addSticker: (st) => set((s) => ({ stickers: [...s.stickers, st] })),
  updateSticker: (id, patch) =>
    set((s) => ({
      stickers: s.stickers.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
  removeSticker: (id) =>
    set((s) => ({ stickers: s.stickers.filter((x) => x.id !== id) })),
  duplicateSticker: (id) =>
    set((s) => {
      const orig = s.stickers.find((x) => x.id === id);
      if (!orig) return {};
      const copy: PlacedSticker = {
        ...orig,
        id: `${orig.stickerId}-${Date.now()}`,
        x: orig.x + 24,
        y: orig.y + 24,
      };
      return { stickers: [...s.stickers, copy] };
    }),

  addText: (t) => set((s) => ({ texts: [...s.texts, t] })),
  updateText: (id, patch) =>
    set((s) => ({
      texts: s.texts.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
  removeText: (id) => set((s) => ({ texts: s.texts.filter((x) => x.id !== id) })),

  setBackground: (b) => set({ background: b }),
  setFilter: (f) => set({ filter: f }),
  setAdjust: (a) => set((s) => ({ adjust: { ...s.adjust, ...a } })),

  commit: () =>
    set((s) => ({
      history: [...s.history, snapshotOf(s)].slice(-40),
      future: [],
    })),

  undo: () =>
    set((s) => {
      if (s.history.length === 0) return {};
      const prev = s.history[s.history.length - 1];
      const rest = s.history.slice(0, -1);
      const currentSnap = snapshotOf(s);
      return {
        ...prev,
        history: rest,
        future: [currentSnap, ...s.future].slice(0, 40),
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return {};
      const next = s.future[0];
      const rest = s.future.slice(1);
      const currentSnap = snapshotOf(s);
      return {
        ...next,
        future: rest,
        history: [...s.history, currentSnap].slice(-40),
      };
    }),

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,
}));
