export const STAGE_WIDTH = 420;
export const STAGE_HEIGHT = 600; // соотношение сторон фотокарточки ~ 7:10

export const CORNER_POSITIONS = {
  tl: { x: 0, y: 0 },
  tr: { x: STAGE_WIDTH, y: 0 },
  bl: { x: 0, y: STAGE_HEIGHT },
  br: { x: STAGE_WIDTH, y: STAGE_HEIGHT },
} as const;
