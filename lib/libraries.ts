import { StickerDef, FilmPrintKind, FilterPreset, BackgroundKind } from "@/types";

/** Библиотека стикеров — glyph рендерится прямо на Konva-канвасе как Text-нода. */
export const STICKERS: StickerDef[] = [
  { id: "heart-1", category: "hearts", glyph: "💗", label: "Сердечко" },
  { id: "heart-2", category: "hearts", glyph: "💕", label: "Два сердца" },
  { id: "heart-3", category: "hearts", glyph: "🩷", label: "Розовое сердце" },
  { id: "bow-1", category: "bows", glyph: "🎀", label: "Бантик" },
  { id: "star-1", category: "stars", glyph: "⭐", label: "Звёздочка" },
  { id: "star-2", category: "stars", glyph: "🌟", label: "Сияющая звезда" },
  { id: "star-3", category: "stars", glyph: "✨", label: "Sparkle" },
  { id: "face-1", category: "faces", glyph: "🥰", label: "Смайлик" },
  { id: "face-2", category: "faces", glyph: "😽", label: "Кошечка" },
  { id: "face-3", category: "faces", glyph: "🥺", label: "Милота" },
  { id: "flower-1", category: "flowers", glyph: "🌸", label: "Цветочек" },
  { id: "flower-2", category: "flowers", glyph: "🌷", label: "Тюльпан" },
  { id: "flower-3", category: "flowers", glyph: "🌼", label: "Ромашка" },
  { id: "cat-1", category: "cats", glyph: "🐱", label: "Котик" },
  { id: "cat-2", category: "cats", glyph: "🐾", label: "Лапка" },
  { id: "dog-1", category: "dogs", glyph: "🐶", label: "Собачка" },
  { id: "anime-1", category: "anime", glyph: "🎏", label: "Аниме-флаг" },
  { id: "anime-2", category: "anime", glyph: "👘", label: "Кимоно" },
  { id: "crown-1", category: "crowns", glyph: "👑", label: "Корона" },
  { id: "ribbon-1", category: "ribbons", glyph: "🎗️", label: "Ленточка" },
  { id: "sparkle-1", category: "sparkle", glyph: "💫", label: "Sparkle-вихрь" },
  { id: "butterfly-1", category: "butterflies", glyph: "🦋", label: "Бабочка" },
  { id: "kawaii-1", category: "kawaii", glyph: "🍡", label: "Данго" },
  { id: "kawaii-2", category: "kawaii", glyph: "🧋", label: "Бабл-ти" },
  { id: "kawaii-3", category: "kawaii", glyph: "🍓", label: "Клубничка" },
  { id: "tag-1", category: "text-tags", glyph: "🔖", label: "Тег" },
];

export const STICKER_CATEGORIES: { id: StickerDef["category"]; label: string }[] = [
  { id: "hearts", label: "Сердечки" },
  { id: "bows", label: "Бантики" },
  { id: "stars", label: "Звёздочки" },
  { id: "faces", label: "Смайлики" },
  { id: "flowers", label: "Цветочки" },
  { id: "cats", label: "Котики" },
  { id: "dogs", label: "Собачки" },
  { id: "anime", label: "Аниме" },
  { id: "crowns", label: "Короны" },
  { id: "ribbons", label: "Ленточки" },
  { id: "sparkle", label: "Sparkle" },
  { id: "butterflies", label: "Бабочки" },
  { id: "kawaii", label: "Kawaii" },
  { id: "text-tags", label: "Надписи" },
];

export const FILM_PRINTS: { id: FilmPrintKind; label: string; glyphs: string[] }[] = [
  { id: "none", label: "Без принта", glyphs: [] },
  { id: "hearts", label: "Сердечки", glyphs: ["♥"] },
  { id: "stars", label: "Звёзды", glyphs: ["★"] },
  { id: "butterflies", label: "Бабочки", glyphs: ["✦"] },
  { id: "clouds", label: "Облака", glyphs: ["☁"] },
  { id: "flowers", label: "Цветочки", glyphs: ["✿"] },
  { id: "cats", label: "Котики", glyphs: ["ᓚᘏᗢ"] },
  { id: "anime", label: "Аниме", glyphs: ["✩"] },
  { id: "glitter", label: "Glitter", glyphs: ["·", "✦"] },
  { id: "holographic", label: "Holographic", glyphs: [] },
  { id: "rainbow", label: "Rainbow", glyphs: [] },
  { id: "sparkles", label: "Sparkles", glyphs: ["✧"] },
];

export const FILTER_PRESETS: {
  id: FilterPreset;
  label: string;
  css: string; // CSS filter() string applied to the Konva stage export layer
}[] = [
  { id: "none", label: "Без фильтра", css: "" },
  { id: "vintage", label: "Vintage", css: "sepia(0.35) saturate(1.15) contrast(1.05) brightness(1.02)" },
  { id: "vhs", label: "VHS", css: "saturate(1.4) contrast(1.15) hue-rotate(-4deg) brightness(0.98)" },
  { id: "film", label: "Film", css: "contrast(1.08) saturate(1.1) sepia(0.12)" },
  { id: "polaroid", label: "Polaroid", css: "sepia(0.2) contrast(0.95) brightness(1.08) saturate(1.05)" },
  { id: "soft", label: "Soft", css: "brightness(1.06) contrast(0.94) saturate(0.96) blur(0.3px)" },
  { id: "bright", label: "Bright", css: "brightness(1.18) contrast(1.02) saturate(1.05)" },
  { id: "dreamy", label: "Dreamy", css: "brightness(1.1) contrast(0.9) saturate(1.15) blur(0.4px)" },
  { id: "warm", label: "Warm", css: "sepia(0.15) saturate(1.2) hue-rotate(-6deg) brightness(1.03)" },
  { id: "cold", label: "Cold", css: "saturate(1.1) hue-rotate(8deg) brightness(1.02) contrast(1.04)" },
];

export const BACKGROUNDS: { id: BackgroundKind; label: string; css: string }[] = [
  { id: "white", label: "Белый", css: "#ffffff" },
  { id: "black", label: "Чёрный", css: "#0b0b10" },
  { id: "gradient-1", label: "Градиент 1", css: "linear-gradient(135deg,#ffd9ec,#e3d9ff)" },
  { id: "gradient-2", label: "Градиент 2", css: "linear-gradient(135deg,#c7fff0,#d9e6ff)" },
  { id: "checker", label: "Клетка", css: "checker" },
  { id: "hearts", label: "Сердечки", css: "hearts" },
  { id: "stars", label: "Звёзды", css: "stars" },
  { id: "clouds", label: "Облака", css: "clouds" },
];

export const TEXT_FONTS: { id: string; label: string; family: string }[] = [
  { id: "cute", label: "Cute", family: "'Fredoka', sans-serif" },
  { id: "kawaii", label: "Kawaii", family: "'Mochiy Pop One', sans-serif" },
  { id: "handwritten", label: "Handwritten", family: "'Caveat', cursive" },
  { id: "serif", label: "Serif", family: "'Playfair Display', serif" },
  { id: "sans", label: "Sans", family: "'Plus Jakarta Sans', sans-serif" },
  { id: "bubble", label: "Bubble", family: "'Baloo 2', sans-serif" },
];
