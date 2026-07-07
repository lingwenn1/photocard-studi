"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/store";
import { STICKERS, STICKER_CATEGORIES } from "@/lib/libraries";
import { GlassPanel } from "@/components/ui/glass-panel";
import { STAGE_WIDTH, STAGE_HEIGHT } from "@/lib/constants";
import { Copy, Trash2 } from "lucide-react";

export function StickerPanel() {
  const { stickers, addSticker, removeSticker, duplicateSticker, commit } = useEditorStore();
  const [category, setCategory] = useState(STICKER_CATEGORIES[0].id);

  const filtered = STICKERS.filter((s) => s.category === category);

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-base font-semibold mb-1">Стикеры</h3>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Нажми, чтобы добавить. Двигай, вращай и масштабируй прямо на фото.
      </p>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {STICKER_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              category === c.id
                ? "bg-plum-500 text-white shadow-float"
                : "bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {filtered.map((s) => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              addSticker({
                id: `${s.id}-${Date.now()}`,
                stickerId: s.id,
                glyph: s.glyph,
                x: STAGE_WIDTH / 2 + (Math.random() * 40 - 20),
                y: STAGE_HEIGHT / 2 + (Math.random() * 40 - 20),
                rotation: 0,
                scale: 1,
              });
              commit();
            }}
            className="grid h-11 w-11 place-items-center rounded-xl bg-white/60 dark:bg-white/10 text-2xl hover:bg-white/90 dark:hover:bg-white/20 hover:scale-110 transition-all"
            title={s.label}
          >
            {s.glyph}
          </motion.button>
        ))}
      </div>

      {stickers.length > 0 && (
        <div className="mt-5 border-t border-white/40 dark:border-white/10 pt-4">
          <h4 className="font-display text-sm font-semibold mb-2">
            На карточке ({stickers.length})
          </h4>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            {stickers.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between rounded-xl bg-white/50 dark:bg-white/5 px-3 py-1.5"
              >
                <span className="text-lg">{st.glyph}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      duplicateSticker(st.id);
                      commit();
                    }}
                    className="grid h-7 w-7 place-items-center rounded-lg bg-white/70 dark:bg-white/10 hover:bg-plum-100 dark:hover:bg-plum-500/20"
                    aria-label="Копировать"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={() => {
                      removeSticker(st.id);
                      commit();
                    }}
                    className="grid h-7 w-7 place-items-center rounded-lg bg-white/70 dark:bg-white/10 hover:bg-bloom-100 dark:hover:bg-bloom-500/20 text-bloom-600"
                    aria-label="Удалить"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
