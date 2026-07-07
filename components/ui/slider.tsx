"use client";

import { clsx } from "clsx";

interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  onCommit?: () => void;
  className?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  onCommit,
  className,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <div className="flex items-center justify-between mb-1.5 text-sm">
          <span className="font-medium text-ink-light/80 dark:text-ink-dark/80">
            {label}
          </span>
          <span className="font-mono text-xs text-plum-600 dark:text-plum-300">
            {Math.round(value)}
            {unit}
          </span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-2 rounded-full bg-plum-100 dark:bg-white/10" />
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-plum-400 to-bloom-500"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseUp={onCommit}
          onTouchEnd={onCommit}
          className="relative w-full h-6 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-float [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-plum-500
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-plum-500"
        />
      </div>
    </div>
  );
}
