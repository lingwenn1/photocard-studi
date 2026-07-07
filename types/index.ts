export type CornerId = "tl" | "tr" | "bl" | "br";

export interface CornerState {
  cut: boolean;
  radius: number; // px
}

export type Corners = Record<CornerId, CornerState>;

export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export type CardholderTextureKind =
  | "clear"
  | "glossy"
  | "matte"
  | "glitter"
  | "iridescent"
  | "rainbow"
  | "holographic"
  | "hearts"
  | "stars"
  | "kpop"
  | "kawaii"
  | "black-minimal"
  | "white-minimal"
  | "colored-plastic"
  | "framed-clear";

export interface CardholderDef {
  id: CardholderTextureKind;
  label: string;
  description: string;
  /** base tint behind the photo */
  baseTint: string;
  /** overlay film opacity 0..1 */
  filmOpacity: number;
  /** does this holder use the animated iridescent canvas layer */
  animated: boolean;
  swatch: string; // css background for the picker thumbnail
}

export type FilmPrintKind =
  | "none"
  | "hearts"
  | "stars"
  | "butterflies"
  | "clouds"
  | "flowers"
  | "cats"
  | "anime"
  | "glitter"
  | "holographic"
  | "rainbow"
  | "sparkles";

export interface StickerDef {
  id: string;
  category:
    | "hearts"
    | "bows"
    | "stars"
    | "faces"
    | "flowers"
    | "cats"
    | "dogs"
    | "anime"
    | "crowns"
    | "ribbons"
    | "sparkle"
    | "butterflies"
    | "text-tags"
    | "kawaii";
  glyph: string; // emoji or unicode glyph used to render the sticker on canvas
  label: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  glyph: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  fontFamily: string;
  color: string;
  fontSize: number;
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
}

export type FilterPreset =
  | "none"
  | "vintage"
  | "vhs"
  | "film"
  | "polaroid"
  | "soft"
  | "bright"
  | "dreamy"
  | "warm"
  | "cold";

export interface AdjustState {
  brightness: number; // 100 = neutral
  contrast: number;
  saturation: number;
  sharpness: number; // approximated via contrast+ svg convolve
}

export type BackgroundKind =
  | "white"
  | "black"
  | "gradient-1"
  | "gradient-2"
  | "checker"
  | "hearts"
  | "stars"
  | "clouds";

export interface ExportOptions {
  format: "png" | "jpg" | "webp" | "pdf";
  quality: number; // 0..1
  pixelRatio: number;
}

export interface EditorSnapshot {
  transform: Transform;
  corners: Corners;
  cornerRadius: number;
  cardholder: CardholderTextureKind | null;
  filmPrint: FilmPrintKind;
  stickers: PlacedSticker[];
  texts: TextLayer[];
  background: BackgroundKind;
  filter: FilterPreset;
  adjust: AdjustState;
}
