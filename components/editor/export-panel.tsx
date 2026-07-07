"use client";

import { useState } from "react";
import type Konva from "konva";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Slider } from "@/components/ui/slider";
import { Download } from "lucide-react";
import { STAGE_WIDTH, STAGE_HEIGHT } from "@/lib/constants";
import { useEditorStore } from "@/lib/store";

const FORMATS = [
  { id: "png", label: "PNG" },
  { id: "jpg", label: "JPG" },
  { id: "webp", label: "WEBP" },
  { id: "pdf", label: "PDF" },
] as const;

export function ExportPanel({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage>;
}) {
  const { imageName } = useEditorStore();
  const [format, setFormat] = useState<(typeof FORMATS)[number]["id"]>("png");
  const [quality, setQuality] = useState(92);
  const [pixelRatio, setPixelRatio] = useState(2);
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    if (!stageRef.current) return;
    setBusy(true);
    try {
      const stage = stageRef.current;
      const mime = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";

      if (format === "pdf") {
        const dataUrl = stage.toDataURL({ mimeType: "image/png", pixelRatio, quality: quality / 100 });
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [STAGE_WIDTH, STAGE_HEIGHT],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        pdf.save(`${baseName()}.pdf`);
      } else {
        const dataUrl = stage.toDataURL({ mimeType: mime, pixelRatio, quality: quality / 100 });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${baseName()}.${format}`;
        link.click();
      }
    } finally {
      setBusy(false);
    }
  };

  const baseName = () => (imageName ? imageName.replace(/\.[^.]+$/, "") : "photocard") + "-studio";

  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-base font-semibold mb-1">Экспорт</h3>
      <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-4">
        Скачай готовую фотокарточку в нужном формате и качестве.
      </p>

      <div className="flex gap-2 mb-5">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFormat(f.id)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
              format === f.id
                ? "bg-plum-500 text-white shadow-float"
                : "bg-white/60 dark:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {format !== "png" && (
        <Slider
          label="Качество"
          value={quality}
          min={40}
          max={100}
          unit="%"
          onChange={setQuality}
          className="mb-4"
        />
      )}

      <Slider
        label="Разрешение (масштаб)"
        value={pixelRatio}
        min={1}
        max={4}
        step={0.5}
        unit="×"
        onChange={setPixelRatio}
        className="mb-5"
      />

      <button
        onClick={handleExport}
        disabled={busy}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Download size={18} />
        {busy ? "Готовим файл..." : `Скачать ${format.toUpperCase()}`}
      </button>
    </GlassPanel>
  );
}
