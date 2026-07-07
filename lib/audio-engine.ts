/**
 * Синтезированный звук степлера/дырокола через Web Audio API.
 * Без внешних mp3 — "клац" собирается из шумового импульса
 * + низкочастотного "стука" механизма + металлического щелчка.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(context: AudioContext, duration: number): AudioBuffer {
  const bufferSize = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/** Механический "клац" степлера — вызывается в момент закрытия */
export function playStaplerClack() {
  try {
    const context = getCtx();
    const now = context.currentTime;

    // 1. Низкий "удар" механизма (тело степлера)
    const thud = context.createOscillator();
    const thudGain = context.createGain();
    thud.type = "triangle";
    thud.frequency.setValueAtTime(180, now);
    thud.frequency.exponentialRampToValueAtTime(60, now + 0.09);
    thudGain.gain.setValueAtTime(0.55, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    thud.connect(thudGain);
    thudGain.connect(context.destination);
    thud.start(now);
    thud.stop(now + 0.16);

    // 2. Металлический высокочастотный щелчок
    const click = context.createOscillator();
    const clickGain = context.createGain();
    click.type = "square";
    click.frequency.setValueAtTime(2400, now + 0.01);
    click.frequency.exponentialRampToValueAtTime(900, now + 0.05);
    clickGain.gain.setValueAtTime(0.18, now + 0.01);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    click.connect(clickGain);
    clickGain.connect(context.destination);
    click.start(now + 0.01);
    click.stop(now + 0.08);

    // 3. Шумовой импульс (срез бумаги/пластика)
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer(context, 0.12);
    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 3200;
    noiseFilter.Q.value = 0.8;
    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.35, now + 0.015);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(context.destination);
    noise.start(now + 0.015);

    // 4. Финальный лёгкий "дзынь" пружины
    const spring = context.createOscillator();
    const springGain = context.createGain();
    spring.type = "sine";
    spring.frequency.setValueAtTime(1600, now + 0.09);
    spring.frequency.exponentialRampToValueAtTime(2200, now + 0.16);
    springGain.gain.setValueAtTime(0.001, now + 0.09);
    springGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    spring.connect(springGain);
    springGain.connect(context.destination);
    spring.start(now + 0.09);
    spring.stop(now + 0.24);
  } catch (e) {
    // Web Audio недоступен (например SSR) — тихо игнорируем
  }
}

/** Лёгкий тактильный "тик" — для UI-фидбека (переключение слайдера и т.п.) */
export function playUiTick() {
  try {
    const context = getCtx();
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {}
}

/** Мягкий "вжух" — для заезда фото в картхолдер */
export function playSlideWhoosh() {
  try {
    const context = getCtx();
    const now = context.currentTime;
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer(context, 0.5);
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(2200, now + 0.45);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    noise.start(now);
  } catch (e) {}
}
