"use client";

import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/store";
import { CARDHOLDERS } from "@/lib/cardholders";
import { FILM_PRINTS } from "@/lib/libraries";
import { GlassPanel } from "@/components/ui/glass-panel";
import { playSlideWhoosh } from "@/lib/audio-engine";

export function CardholderPanel() {
  const { cardholder, setCardholder, filmPrint, setFilmPrint, commit } = useEditorStore();

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-base font-semibold mb-1">Картхолдеры</h3>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Фото аккуратно заезжает внутрь прозрачного кармана.
      </p>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {CARDHOLDERS.map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              setCardholder(cardholder === c.id ? null : c.id);
              playSlideWhoosh();
              commit();
            }}
            className={`group relative flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-all ${
              cardholder === c.id
                ? "ring-2 ring-plum-500 bg-white/70 dark:bg-white/10"
                : "hover:bg-white/50 dark:hover:bg-white/5"
            }`}
            title={c.description}
          >
            <span
              className="h-12 w-12 rounded-xl shadow-glass dark:shadow-glass-dark border border-white/60 dark:border-white/10"
              style={{ background: c.swatch }}
            />
            <span className="text-[10px] font-medium leading-tight text-center">
              {c.label}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="font-display text-sm font-semibold mb-2">Принт плёнки</h4>
        <div className="flex flex-wrap gap-2">
          {FILM_PRINTS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setFilmPrint(p.id);
                commit();
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                filmPrint === p.id
                  ? "bg-plum-500 text-white shadow-float"
                  : "bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20"
              }`}
            >
              {p.glyphs[0] ?? "✦"} {p.label}
            </button>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
