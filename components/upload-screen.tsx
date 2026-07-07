"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, Scissors, Layers } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { ThemeToggle } from "@/components/theme-toggle";

const ACCEPTED = [".jpg", ".jpeg", ".png", ".webp", ".heic"];

export function UploadScreen() {
  const setImage = useEditorStore((s) => s.setImage);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const isHeic =
        /\.heic$/i.test(file.name) || file.type === "image/heic" || file.type === "image/heif";

      setLoading(true);
      try {
        let blob: Blob = file;
        if (isHeic) {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
          blob = Array.isArray(converted) ? converted[0] : (converted as Blob);
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string, file.name);
          setLoading(false);
        };
        reader.onerror = () => {
          setError("Не удалось прочитать файл. Попробуйте другое изображение.");
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        setError("Не получилось обработать HEIC-файл. Попробуйте JPG или PNG.");
        setLoading(false);
      }
    },
    [setImage]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-aurora-light dark:bg-aurora-dark bg-paper-light dark:bg-paper-dark">
      {/* фоновые декоративные плавающие карточки */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingCard className="left-[6%] top-[18%] rotate-[-8deg]" delay={0} />
        <FloatingCard className="right-[8%] top-[12%] rotate-[10deg]" delay={0.6} />
        <FloatingCard className="left-[12%] bottom-[10%] rotate-[6deg]" delay={1.1} />
        <FloatingCard className="right-[10%] bottom-[16%] rotate-[-12deg]" delay={1.6} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-plum-500 to-bloom-500 text-white shadow-float">
            <Sparkles size={18} />
          </span>
          Photocard Studio
        </div>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-col items-center px-6 pt-8 pb-20 text-center sm:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-semibold leading-tight sm:text-6xl"
        >
          Твоя фотка →<br />
          <span className="bg-gradient-to-r from-plum-500 via-bloom-500 to-mint-500 bg-clip-text text-transparent">
            идеальная фотокарточка
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-xl text-base text-ink-light/70 dark:text-ink-dark/70 sm:text-lg"
        >
          Скругляй уголки настоящим степлером, вставляй в картхолдеры,
          добавляй стикеры и голографические эффекты — прямо в браузере.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 w-full max-w-xl"
        >
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`group relative flex cursor-pointer flex-col items-center gap-4 rounded-4xl border-2 border-dashed p-10 transition-all sm:p-14
              ${dragging ? "border-plum-500 bg-plum-50/60 dark:bg-plum-500/10 scale-[1.01]" : "border-plum-300/60 dark:border-plum-400/25 glass-panel"}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(",")}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-plum-500 to-bloom-500 text-white shadow-float"
            >
              {loading ? (
                <motion.span
                  className="h-6 w-6 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Upload size={26} />
              )}
            </motion.div>
            <div>
              <span className="btn-primary inline-block">
                {loading ? "Обрабатываем..." : "Загрузить фотографию"}
              </span>
              <p className="mt-3 text-xs text-ink-light/50 dark:text-ink-dark/50">
                Перетащи файл сюда или нажми, чтобы выбрать · JPG · PNG · WEBP · HEIC
              </p>
            </div>
          </label>
          {error && (
            <p className="mt-3 text-sm font-medium text-bloom-600">{error}</p>
          )}
        </motion.div>

        <div className="mt-14 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<Scissors size={18} />}
            title="Степлер-скруглитель"
            text="Срезай уголки анимацией настоящего степлера со звуком"
          />
          <FeatureCard
            icon={<Layers size={18} />}
            title="15 картхолдеров"
            text="Голографика, глиттер, kawaii, k-pop и другие текстуры"
          />
          <FeatureCard
            icon={<Sparkles size={18} />}
            title="Стикеры и текст"
            text="Готовые наклейки, шрифты, фильтры и фоны"
          />
        </div>
      </main>
    </div>
  );
}

function FloatingCard({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.div
      className={`absolute h-24 w-16 rounded-2xl bg-gradient-to-br from-white/70 to-plum-100/60 dark:from-white/10 dark:to-plum-500/10 border border-white/60 dark:border-white/10 shadow-glass dark:shadow-glass-dark backdrop-blur-md ${className}`}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="glass-panel rounded-3xl p-5 text-left">
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-plum-500/10 text-plum-600 dark:text-plum-300">
        {icon}
      </div>
      <h3 className="font-display text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-ink-light/60 dark:text-ink-dark/60">{text}</p>
    </div>
  );
}
