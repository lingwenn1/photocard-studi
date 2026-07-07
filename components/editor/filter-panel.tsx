"use client";

import { useEditorStore } from "@/lib/store";
import { FILTER_PRESETS } from "@/lib/libraries";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Slider } from "@/components/ui/slider";

export function FilterPanel() {
  const { filter, setFilter, adjust, setAdjust, commit } = useEditorStore();

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-base font-semibold mb-1">Эффекты фото</h3>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Готовые фильтры и ручная цветокоррекция.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTER_PRESETS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id);
              commit();
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === f.id
                ? "bg-plum-500 text-white shadow-float"
                : "bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Slider
          label="Яркость"
          value={adjust.brightness}
          min={40}
          max={160}
          unit="%"
          onChange={(v) => setAdjust({ brightness: v })}
          onCommit={commit}
        />
        <Slider
          label="Контраст"
          value={adjust.contrast}
          min={40}
          max={160}
          unit="%"
          onChange={(v) => setAdjust({ contrast: v })}
          onCommit={commit}
        />
        <Slider
          label="Насыщенность"
          value={adjust.saturation}
          min={0}
          max={200}
          unit="%"
          onChange={(v) => setAdjust({ saturation: v })}
          onCommit={commit}
        />
        <Slider
          label="Резкость"
          value={adjust.sharpness}
          min={0}
          max={100}
          unit="%"
          onChange={(v) => setAdjust({ sharpness: v })}
          onCommit={commit}
        />
      </div>
    </GlassPanel>
  );
}
