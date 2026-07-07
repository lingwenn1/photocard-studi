"use client";

import { useRef } from "react";
import type Konva from "konva";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store";
import { CanvasStage } from "./canvas-stage";
import { StaplerTool } from "./stapler-tool";
import { CardholderPanel } from "./cardholder-panel";
import { StickerPanel } from "./sticker-panel";
import { TextPanel } from "./text-panel";
import { BackgroundPanel } from "./background-panel";
import { FilterPanel } from "./filter-panel";
import { ExportPanel } from "./export-panel";
import { TransformPanel } from "./transform-panel";
import { Toolbar } from "./toolbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, ArrowLeft } from "lucide-react";

export function EditorShell() {
  const { resetImage, activeTool } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <div className="min-h-[100dvh] bg-aurora-light dark:bg-aurora-dark bg-paper-light dark:bg-paper-dark">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={resetImage}
            className="grid h-10 w-10 place-items-center rounded-xl glass-panel"
            aria-label="Назад"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="hidden sm:flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-plum-500 to-bloom-500 text-white">
              <Sparkles size={15} />
            </span>
            Photocard Studio
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="px-4 pb-28 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          {/* Канвас */}
          <div className="flex flex-col items-center gap-4 lg:sticky lg:top-6">
            <CanvasStage stageRef={stageRef} />
            <p className="text-center text-xs text-ink-light/50 dark:text-ink-dark/50 max-w-xs">
              Перетаскивай фото на холсте, используй маркеры для поворота и
              масштаба.
            </p>
          </div>

          {/* Панель активного инструмента */}
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {activeTool === "transform" && <TransformPanel />}
                {activeTool === "stapler" && <StaplerTool />}
                {activeTool === "cardholder" && <CardholderPanel />}
                {activeTool === "stickers" && <StickerPanel />}
                {activeTool === "text" && <TextPanel />}
                {activeTool === "background" && <BackgroundPanel />}
                {activeTool === "filters" && <FilterPanel />}
                {activeTool === "export" && <ExportPanel stageRef={stageRef} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Нижний тулбар — фиксированный, адаптивный под мобильные */}
      <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
        <Toolbar />
      </div>
    </div>
  );
}
