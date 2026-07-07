"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useEditorStore } from "@/lib/store";
import { CornerId } from "@/types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "@/lib/constants";
import { playStaplerClack } from "@/lib/audio-engine";
import { Slider } from "@/components/ui/slider";
import { GlassPanel } from "@/components/ui/glass-panel";

const CORNER_LABEL: Record<CornerId, string> = {
  tl: "Верхний левый",
  tr: "Верхний правый",
  bl: "Нижний левый",
  br: "Нижний правый",
};

const CORNER_CSS: Record<CornerId, React.CSSProperties> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

export function StaplerTool() {
  const { corners, toggleCorner, cornerRadius, setCornerRadius, commit } = useEditorStore();
  const [staplerAt, setStaplerAt] = useState<CornerId | null>(null);
  const [snipping, setSnipping] = useState<CornerId | null>(null);
  const staplerRef = useRef<HTMLDivElement>(null);
  const jawRef = useRef<HTMLDivElement>(null);

  const fireStapler = (corner: CornerId) => {
    if (staplerAt) return; // анимация уже идёт
    setStaplerAt(corner);

    const tl = gsap.timeline({
      onComplete: () => {
        setStaplerAt(null);
      },
    });

    // 1. Степлер "подъезжает" к углу — управляется через framer-motion (position),
    // здесь GSAP анимирует "клюв" степлера — сжатие челюсти.
    tl.to(jawRef.current, {
      delay: 0.42, // ждём, пока framer-motion довезёт корпус степлера
      rotateX: -35,
      duration: 0.09,
      ease: "power2.in",
      onStart: () => {
        playStaplerClack();
        setSnipping(corner);
      },
    }).to(jawRef.current, {
      rotateX: 0,
      duration: 0.22,
      delay: 0.05,
      ease: "back.out(2)",
      onComplete: () => {
        toggleCorner(corner);
        commit();
      },
    });
  };

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-base font-semibold mb-1">Степлер-скруглитель</h3>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Нажми на уголок фотографии — степлер срежет его с настоящим звуком.
      </p>

      <div className="relative mx-auto" style={{ width: STAGE_WIDTH * 0.55, height: STAGE_HEIGHT * 0.55 }}>
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-plum-300/60 dark:border-plum-400/30" />
        {(Object.keys(CORNER_LABEL) as CornerId[]).map((c) => (
          <button
            key={c}
            onClick={() => fireStapler(c)}
            disabled={!!staplerAt}
            className={`absolute h-8 w-8 rounded-lg grid place-items-center text-[10px] font-mono transition-all
              ${corners[c].cut ? "bg-mint-500 text-white" : "bg-white/80 dark:bg-white/10 text-plum-600 dark:text-plum-300"}
              hover:scale-110 shadow-glass dark:shadow-glass-dark border border-white/70 dark:border-white/10`}
            style={CORNER_CSS[c]}
            aria-label={`Скруглить угол: ${CORNER_LABEL[c]}`}
          >
            {corners[c].cut ? "✓" : ""}
          </button>
        ))}

        {/* Анимированный степлер */}
        <AnimatePresence>
          {staplerAt && (
            <motion.div
              ref={staplerRef}
              initial={{ opacity: 0, ...restPosition() }}
              animate={{ opacity: 1, ...cornerToPosition(staplerAt) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              <StaplerGraphic jawRef={jawRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Анимация "вылетающего" срезанного уголка */}
        <AnimatePresence>
          {snipping && (
            <motion.div
              key={snipping + "-snip"}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 0, scale: 0.4, x: cornerFlyX(snipping), y: -30, rotate: 40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={() => setSnipping(null)}
              className="absolute h-4 w-4 bg-gradient-to-br from-plum-300 to-bloom-300 rounded-sm"
              style={CORNER_CSS[snipping]}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <Slider
          label="Радиус скругления"
          value={cornerRadius}
          min={4}
          max={64}
          unit="px"
          onChange={setCornerRadius}
          onCommit={commit}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {(Object.keys(CORNER_LABEL) as CornerId[]).map((c) => (
          <span
            key={c}
            className={`rounded-full px-3 py-1 font-mono ${
              corners[c].cut
                ? "bg-mint-500/15 text-mint-600 dark:text-mint-400"
                : "bg-plum-500/10 text-plum-600/70 dark:text-plum-300/60"
            }`}
          >
            {CORNER_LABEL[c]}: {corners[c].cut ? "срезан" : "острый"}
          </span>
        ))}
      </div>
    </GlassPanel>
  );
}

function restPosition() {
  return { left: "50%", top: "120%" };
}

function cornerToPosition(c: CornerId) {
  const pos: Record<CornerId, { left: string; top: string }> = {
    tl: { left: "0%", top: "0%" },
    tr: { left: "100%", top: "0%" },
    bl: { left: "0%", top: "100%" },
    br: { left: "100%", top: "100%" },
  };
  return pos[c];
}

function cornerFlyX(c: CornerId) {
  return c === "tl" || c === "bl" ? -30 : 30;
}

function StaplerGraphic({ jawRef }: { jawRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="relative h-14 w-9 drop-shadow-stapler">
      {/* Корпус */}
      <div className="absolute bottom-0 h-8 w-9 rounded-md bg-gradient-to-b from-ink-light to-[#2b2440] shadow-stapler" />
      {/* Верхняя челюсть (двигается) */}
      <div
        ref={jawRef}
        className="absolute top-0 h-8 w-9 rounded-md bg-gradient-to-b from-plum-500 to-plum-700 origin-bottom shadow-stapler"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/70" />
      </div>
    </div>
  );
}
