"use client";

import {
  Move,
  Scissors,
  Layers,
  Sticker,
  Type,
  Image as ImageIcon,
  Wand2,
  Download,
  Undo2,
  Redo2,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { clsx } from "clsx";

const TOOLS = [
  { id: "transform", label: "Фото", icon: Move },
  { id: "stapler", label: "Степлер", icon: Scissors },
  { id: "cardholder", label: "Холдер", icon: Layers },
  { id: "stickers", label: "Стикеры", icon: Sticker },
  { id: "text", label: "Текст", icon: Type },
  { id: "background", label: "Фон", icon: ImageIcon },
  { id: "filters", label: "Эффекты", icon: Wand2 },
  { id: "export", label: "Экспорт", icon: Download },
] as const;

export function Toolbar() {
  const { activeTool, setActiveTool, undo, redo, canUndo, canRedo } = useEditorStore();

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 rounded-2xl glass-panel p-1.5 overflow-x-auto max-w-full">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const active = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={clsx("tool-tab min-w-[64px]", active && "tool-tab-active")}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-1 rounded-2xl glass-panel p-1.5">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-light/70 dark:text-ink-dark/70 hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30"
          aria-label="Отменить"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-light/70 dark:text-ink-dark/70 hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30"
          aria-label="Повторить"
        >
          <Redo2 size={18} />
        </button>
      </div>
    </div>
  );
}
