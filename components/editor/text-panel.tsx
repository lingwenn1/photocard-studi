"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store";
import { TEXT_FONTS } from "@/lib/libraries";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Slider } from "@/components/ui/slider";
import { STAGE_WIDTH, STAGE_HEIGHT } from "@/lib/constants";
import { Trash2, Plus } from "lucide-react";

export function TextPanel() {
  const { texts, addText, updateText, removeText, commit } = useEditorStore();
  const [draft, setDraft] = useState("Твой текст");
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = texts.find((t) => t.id === activeId) ?? null;

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-base font-semibold mb-1">Текст</h3>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Добавляй надписи и настраивай шрифт, цвет, обводку и тень.
      </p>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 rounded-xl bg-white/60 dark:bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-plum-400"
          placeholder="Введи текст..."
        />
        <button
          onClick={() => {
            const id = `text-${Date.now()}`;
            addText({
              id,
              text: draft || "Текст",
              x: STAGE_WIDTH / 2,
              y: STAGE_HEIGHT / 2,
              rotation: 0,
              scale: 1,
              fontFamily: TEXT_FONTS[0].family,
              color: "#8B5CF6",
              fontSize: 28,
              strokeColor: "#ffffff",
              strokeWidth: 0,
              shadowColor: "#000000",
              shadowBlur: 0,
            });
            setActiveId(id);
            commit();
          }}
          className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-plum-500 to-bloom-500 text-white shadow-float"
          aria-label="Добавить текст"
        >
          <Plus size={18} />
        </button>
      </div>

      {texts.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {texts.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                activeId === t.id
                  ? "bg-plum-500 text-white"
                  : "bg-white/60 dark:bg-white/10"
              }`}
            >
              {t.text.slice(0, 12) || "Текст"}
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="mt-5 space-y-4 border-t border-white/40 dark:border-white/10 pt-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block">Шрифт</label>
            <div className="flex flex-wrap gap-1.5">
              {TEXT_FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    updateText(active.id, { fontFamily: f.family });
                    commit();
                  }}
                  style={{ fontFamily: f.family }}
                  className={`rounded-xl px-3 py-1.5 text-sm ${
                    active.fontFamily === f.family
                      ? "bg-plum-500 text-white"
                      : "bg-white/60 dark:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <Slider
            label="Размер"
            value={active.fontSize}
            min={12}
            max={72}
            onChange={(v) => updateText(active.id, { fontSize: v })}
            onCommit={commit}
          />

          <div className="flex items-center gap-3">
            <label className="text-xs font-medium">Цвет</label>
            <input
              type="color"
              value={active.color}
              onChange={(e) => updateText(active.id, { color: e.target.value })}
              onBlur={commit}
              className="h-8 w-14 rounded-lg border border-white/50 dark:border-white/10"
            />
            <label className="text-xs font-medium">Обводка</label>
            <input
              type="color"
              value={active.strokeColor}
              onChange={(e) => updateText(active.id, { strokeColor: e.target.value })}
              onBlur={commit}
              className="h-8 w-14 rounded-lg border border-white/50 dark:border-white/10"
            />
          </div>

          <Slider
            label="Толщина обводки"
            value={active.strokeWidth}
            min={0}
            max={6}
            onChange={(v) => updateText(active.id, { strokeWidth: v })}
            onCommit={commit}
          />

          <Slider
            label="Тень"
            value={active.shadowBlur}
            min={0}
            max={20}
            onChange={(v) => updateText(active.id, { shadowBlur: v })}
            onCommit={commit}
          />

          <button
            onClick={() => {
              removeText(active.id);
              setActiveId(null);
              commit();
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-bloom-600"
          >
            <Trash2 size={13} /> Удалить текст
          </button>
        </div>
      )}
    </GlassPanel>
  );
}
