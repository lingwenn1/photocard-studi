"use client";

import { useEditorStore } from "@/lib/store";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

export function TransformPanel() {
  const { transform, setTransform, commit } = useEditorStore();

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-base font-semibold">Фото</h3>
        <button
          onClick={() => {
            setTransform({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 });
            commit();
          }}
          className="flex items-center gap-1 text-xs font-medium text-plum-600 dark:text-plum-300"
        >
          <RotateCcw size={13} /> Сбросить
        </button>
      </div>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Двигай фото прямо на холсте или используй точные ползунки.
      </p>

      <div className="space-y-4">
        <Slider
          label="Масштаб"
          value={transform.scaleX * 100}
          min={20}
          max={300}
          unit="%"
          onChange={(v) => setTransform({ scaleX: v / 100, scaleY: v / 100 })}
          onCommit={commit}
        />
        <Slider
          label="Поворот"
          value={transform.rotation}
          min={-180}
          max={180}
          unit="°"
          onChange={(v) => setTransform({ rotation: v })}
          onCommit={commit}
        />
        <Slider
          label="Смещение по X"
          value={transform.x}
          min={-150}
          max={150}
          unit="px"
          onChange={(v) => setTransform({ x: v })}
          onCommit={commit}
        />
        <Slider
          label="Смещение по Y"
          value={transform.y}
          min={-150}
          max={150}
          unit="px"
          onChange={(v) => setTransform({ y: v })}
          onCommit={commit}
        />
      </div>
    </GlassPanel>
  );
}
