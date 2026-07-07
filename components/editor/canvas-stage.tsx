"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import useImage from "use-image";
import type Konva from "konva";
import { useEditorStore } from "@/lib/store";
import { STAGE_WIDTH, STAGE_HEIGHT } from "@/lib/constants";
import { getCardholder } from "@/lib/cardholders";
import { FILTER_PRESETS, BACKGROUNDS } from "@/lib/libraries";
import { HolographicOverlay } from "./holographic-overlay";

const Stage = dynamic(() => import("react-konva").then((m) => m.Stage), { ssr: false });
const Layer = dynamic(() => import("react-konva").then((m) => m.Layer), { ssr: false });
const KGroup = dynamic(() => import("react-konva").then((m) => m.Group), { ssr: false });
const KImage = dynamic(() => import("react-konva").then((m) => m.Image), { ssr: false });
const KRect = dynamic(() => import("react-konva").then((m) => m.Rect), { ssr: false });
const KText = dynamic(() => import("react-konva").then((m) => m.Text), { ssr: false });
const KTransformer = dynamic(() => import("react-konva").then((m) => m.Transformer), {
  ssr: false,
});

/** Строит путь скруглённого прямоугольника с независимым радиусом по углам (0 = острый срез) */
function roundedRectPath(
  ctx: Konva.Context,
  w: number,
  h: number,
  r: { tl: number; tr: number; bl: number; br: number }
) {
  ctx.beginPath();
  ctx.moveTo(r.tl, 0);
  ctx.lineTo(w - r.tr, 0);
  if (r.tr > 0) ctx.arc(w - r.tr, r.tr, r.tr, -Math.PI / 2, 0);
  ctx.lineTo(w, h - r.br);
  if (r.br > 0) ctx.arc(w - r.br, h - r.br, r.br, 0, Math.PI / 2);
  ctx.lineTo(r.bl, h);
  if (r.bl > 0) ctx.arc(r.bl, h - r.bl, r.bl, Math.PI / 2, Math.PI);
  ctx.lineTo(0, r.tl);
  if (r.tl > 0) ctx.arc(r.tl, r.tl, r.tl, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}

export const CanvasStage = ({ stageRef }: { stageRef: React.RefObject<Konva.Stage> }) => {
  const {
    imageSrc,
    transform,
    setTransform,
    corners,
    cardholder,
    cardholderAnimIn,
    filmPrint,
    stickers,
    updateSticker,
    texts,
    updateText,
    background,
    filter,
    adjust,
    commit,
  } = useEditorStore();

  const [image] = useImage(imageSrc ?? "", "anonymous");
  const imgNodeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [selectedId, setSelectedId] = useState<string | null>("photo");
  const [slideY, setSlideY] = useState(0);
  const [filmVisible, setFilmVisible] = useState(false);

  // Анимация "заезда" фото в картхолдер
  useEffect(() => {
    if (!cardholderAnimIn) return;
    setFilmVisible(false);
    setSlideY(-STAGE_HEIGHT * 0.35);
    const t1 = setTimeout(() => setSlideY(0), 40);
    const t2 = setTimeout(() => setFilmVisible(true), 620);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [cardholderAnimIn, cardholder]);

  useEffect(() => {
    const node = imgNodeRef.current;
    const tr = trRef.current;
    if (!node || !tr) return;
    if (selectedId === "photo") {
      tr.nodes([node]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedId, image]);

  const holder = getCardholder(cardholder);
  const filterCss = FILTER_PRESETS.find((f) => f.id === filter)?.css ?? "";
  const bg = BACKGROUNDS.find((b) => b.id === background);

  const corn = {
    tl: corners.tl.cut ? corners.tl.radius : 0,
    tr: corners.tr.cut ? corners.tr.radius : 0,
    bl: corners.bl.cut ? corners.bl.radius : 0,
    br: corners.br.cut ? corners.br.radius : 0,
  };

  const bgStyle: React.CSSProperties = {};
  let bgPatternClass = "";
  if (bg) {
    if (["checker", "hearts", "stars", "clouds"].includes(bg.id)) {
      bgPatternClass = `bg-pattern-${bg.id}`;
    } else {
      bgStyle.background = bg.css;
    }
  }

  const combinedAdjustFilter = `brightness(${adjust.brightness}%) contrast(${adjust.contrast}%) saturate(${adjust.saturation}%)`;

  return (
    <div
      className={`relative rounded-[28px] overflow-hidden shadow-float ${bgPatternClass}`}
      style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, ...bgStyle }}
    >
      <div
        style={{
          filter: [combinedAdjustFilter, filterCss].filter(Boolean).join(" "),
          width: "100%",
          height: "100%",
        }}
      >
        <Stage
          ref={stageRef as any}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          onMouseDown={(e: any) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
        >
          <Layer>
            <KGroup
              clipFunc={(ctx: Konva.Context) =>
                roundedRectPath(ctx, STAGE_WIDTH, STAGE_HEIGHT, corn)
              }
            >
              {/* Тинт картхолдера позади фото */}
              {holder && (
                <KRect
                  x={0}
                  y={0}
                  width={STAGE_WIDTH}
                  height={STAGE_HEIGHT}
                  fill={holder.baseTint}
                />
              )}

              {image && (
                <KImage
                  ref={imgNodeRef}
                  image={image}
                  x={STAGE_WIDTH / 2 + transform.x}
                  y={STAGE_HEIGHT / 2 + transform.y + slideY}
                  offsetX={image.width / 2}
                  offsetY={image.height / 2}
                  scaleX={
                    (Math.min(STAGE_WIDTH / image.width, STAGE_HEIGHT / image.height) *
                      transform.scaleX) || 1
                  }
                  scaleY={
                    (Math.min(STAGE_WIDTH / image.width, STAGE_HEIGHT / image.height) *
                      transform.scaleY) || 1
                  }
                  rotation={transform.rotation}
                  draggable
                  onClick={() => setSelectedId("photo")}
                  onTap={() => setSelectedId("photo")}
                  onDragEnd={(e: any) => {
                    setTransform({
                      x: e.target.x() - STAGE_WIDTH / 2,
                      y: e.target.y() - STAGE_HEIGHT / 2,
                    });
                    commit();
                  }}
                  onTransformEnd={(e: any) => {
                    const node = e.target;
                    const base = Math.min(
                      STAGE_WIDTH / image.width,
                      STAGE_HEIGHT / image.height
                    );
                    setTransform({
                      x: node.x() - STAGE_WIDTH / 2,
                      y: node.y() - STAGE_HEIGHT / 2,
                      scaleX: node.scaleX() / base,
                      scaleY: node.scaleY() / base,
                      rotation: node.rotation(),
                    });
                    commit();
                  }}
                />
              )}

              {selectedId === "photo" && (
                <KTransformer
                  ref={trRef}
                  rotateEnabled
                  enabledAnchors={[
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                  ]}
                  borderStroke="#8B5CF6"
                  anchorStroke="#8B5CF6"
                  anchorFill="#fff"
                  anchorSize={10}
                  anchorCornerRadius={6}
                />
              )}

              {/* Стикеры */}
              {stickers.map((st) => (
                <KText
                  key={st.id}
                  text={st.glyph}
                  x={st.x}
                  y={st.y}
                  fontSize={40 * st.scale}
                  rotation={st.rotation}
                  draggable
                  onClick={() => setSelectedId(st.id)}
                  onTap={() => setSelectedId(st.id)}
                  onDragEnd={(e: any) => {
                    updateSticker(st.id, { x: e.target.x(), y: e.target.y() });
                    commit();
                  }}
                />
              ))}

              {/* Текстовые слои */}
              {texts.map((t) => (
                <KText
                  key={t.id}
                  text={t.text}
                  x={t.x}
                  y={t.y}
                  fontSize={t.fontSize * t.scale}
                  fontFamily={t.fontFamily}
                  fill={t.color}
                  rotation={t.rotation}
                  stroke={t.strokeWidth > 0 ? t.strokeColor : undefined}
                  strokeWidth={t.strokeWidth}
                  shadowColor={t.shadowColor}
                  shadowBlur={t.shadowBlur}
                  draggable
                  onClick={() => setSelectedId(t.id)}
                  onTap={() => setSelectedId(t.id)}
                  onDragEnd={(e: any) => {
                    updateText(t.id, { x: e.target.x(), y: e.target.y() });
                    commit();
                  }}
                />
              ))}

              {/* Плёнка картхолдера сверху */}
              {holder && (
                <KRect
                  x={0}
                  y={0}
                  width={STAGE_WIDTH}
                  height={STAGE_HEIGHT}
                  fill="white"
                  opacity={filmVisible ? holder.filmOpacity : 0}
                />
              )}
            </KGroup>
          </Layer>
        </Stage>
      </div>

      {/* HTML-оверлей: анимированный голографик/глиттер поверх плёнки, реагирует на курсор */}
      {holder?.animated && filmVisible && (
        <div className="absolute inset-0 pointer-events-none">
          <HolographicOverlay kind={holder.id} />
        </div>
      )}

      {/* Принт плёнки (эмодзи-паттерн) */}
      {filmPrint !== "none" && filmVisible && (
        <FilmPrintPattern kind={filmPrint} />
      )}
    </div>
  );
};

function FilmPrintPattern({ kind }: { kind: string }) {
  const glyphMap: Record<string, string> = {
    hearts: "♥",
    stars: "★",
    butterflies: "✦",
    clouds: "☁",
    flowers: "✿",
    cats: "ᓚᘏᗢ",
    anime: "✩",
    glitter: "✦",
    sparkles: "✧",
  };
  const glyph = glyphMap[kind];
  if (kind === "holographic" || kind === "rainbow") {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen holo-static animate-shimmer bg-[length:200%_200%]" />
    );
  }
  if (!glyph) return null;
  const items = Array.from({ length: 24 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
      {items.map((_, i) => (
        <span
          key={i}
          className="absolute text-plum-400/70 select-none"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            fontSize: 10 + (i % 3) * 4,
            transform: `rotate(${(i * 29) % 360}deg)`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}
