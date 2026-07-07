"use client";

import { useEditorStore } from "@/lib/store";
import { BACKGROUNDS } from "@/lib/libraries";
import { GlassPanel } from "@/components/ui/glass-panel";

const PATTERN_PREVIEW: Record<string, string> = {
  checker: "bg-pattern-checker",
  hearts: "bg-pattern-hearts",
  stars: "bg-pattern-stars",
  clouds: "bg-pattern-clouds",
};

export function BackgroundPanel() {
  const { background, setBackground, commit } = useEditorStore();

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-base font-semibold mb-1">Фон</h3>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Фон отображается позади холста при экспорте с прозрачными углами.
      </p>
      <div className="grid grid-cols-4 gap-3">
        {BACKGROUNDS.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setBackground(b.id);
              commit();
            }}
            className={`h-14 rounded-2xl border-2 transition-all ${
              PATTERN_PREVIEW[b.id] ?? ""
            } ${
              background === b.id
                ? "border-plum-500 scale-105"
                : "border-white/50 dark:border-white/10 hover:scale-105"
            }`}
            style={PATTERN_PREVIEW[b.id] ? undefined : { background: b.css }}
            title={b.label}
          />
        ))}
      </div>
    </GlassPanel>
  );
}
