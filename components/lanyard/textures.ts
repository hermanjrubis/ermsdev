import * as THREE from "three";

/**
 * Canvas-drawn textures for the lanyard ID card, so there are no image or 3D model files.
 * Everything uses the brand palette only.
 */

export type CardTheme = "light" | "dark";

export type CardContent = {
  name: string;
  roles: readonly string[];
  photo?: string;
  backNote?: string;
};

type Palette = { card: string; ink: string; muted: string; line: string };

const ACCENT = "#2D9CDB";

/** The card is the opposite of the page: black card on a light page, white card on a dark page. */
export function cardPalette(theme: CardTheme): Palette {
  return theme === "light"
    ? { card: "#0A0A0A", ink: "#FFFFFF", muted: "#9CA3AF", line: "#1F2937" }
    : { card: "#FFFFFF", ink: "#0A0A0A", muted: "#6B7280", line: "#E5E7EB" };
}

// Texture size matches the card's 1.6 x 2.25 proportions.
export const CARD_PX = { w: 1024, h: 1440 };

function setTracking(ctx: CanvasRenderingContext2D, em: number, fontSize: number) {
  // letterSpacing is supported in current Chromium, Firefox and Safari; ignored elsewhere.
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${em * fontSize}px`;
  }
}

/** Same construction as components/Logo.tsx, drawn at a baseline. */
function drawLogo(
  ctx: CanvasRenderingContext2D,
  family: string,
  x: number,
  baseline: number,
  size: number,
  ink: string,
) {
  const box = 0.6 * size;
  const scale = box / 48;
  const top = baseline - box + 0.05 * size;

  ctx.save();
  ctx.translate(x, top);
  ctx.scale(scale, scale);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 8;
  ctx.lineCap = "butt";
  ctx.stroke(new Path2D("M6 24 H40 M40 24 A16 16 0 1 0 33.2 37.1"));
  ctx.restore();

  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `600 ${size}px ${family}`;
  ctx.textBaseline = "alphabetic";
  setTracking(ctx, -0.04, size);
  const textX = x + box;
  ctx.fillText("rmsDev", textX, baseline);
  const textW = ctx.measureText("rmsDev").width;
  ctx.restore();

  ctx.fillStyle = ACCENT;
  ctx.fillRect(textX + textW + 0.13 * size, baseline - 0.13 * size, 0.48 * size, 0.13 * size);
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  font: string,
  color: string,
  tracking = 0,
  size = 40,
  maxWidth?: number,
) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  setTracking(ctx, tracking, size);
  ctx.fillText(value, x, y, maxWidth);
  ctx.restore();
}

/**
 * Textures are drawn in card units and rasterised larger so the card stays crisp
 * on HiDPI screens. The strap repeats along its length, so its texture must stay
 * a power of two: it gets exactly 2x (2048 x 256).
 */
const TEX_SCALE = 1.5;

function newCanvas(w: number, h: number, scale = TEX_SCALE) {
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const ctx = c.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.imageSmoothingQuality = "high";
  return { c, ctx };
}

function toTexture(canvas: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Break text into lines that fit maxWidth at the current ctx.font. */
function wrap(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const words = value.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Small deterministic random generator, so the card looks the same on every visit. */
function seeded(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function slot(ctx: CanvasRenderingContext2D, w: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(w / 2 - 90, 52, 180, 30, 15);
  ctx.fill();
}

/** Barcode made from the name. `vertical` stacks the bars top to bottom. */
function barcode(
  ctx: CanvasRenderingContext2D,
  seedText: string,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  vertical = false,
) {
  const rand = seeded(seedText);
  const length = vertical ? h : w;
  ctx.fillStyle = color;
  let pos = 0;
  while (pos < length) {
    const bar = 3 + Math.floor(rand() * 4) * 3; // 3, 6, 9 or 12px
    const space = 3 + Math.floor(rand() * 3) * 3;
    const size = Math.min(bar, length - pos);
    if (vertical) ctx.fillRect(x, y + pos, w, size);
    else ctx.fillRect(x + pos, y, size, h);
    pos += bar + space;
  }
}

/** Viewfinder-style corner marks around a square. */
function cropMarks(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const o = 18; // offset outside the photo
  const l = 46; // arm length
  const t = 6; // thickness
  ctx.fillStyle = color;
  const corners: [number, number, number, number][] = [
    [x - o, y - o, 1, 1],
    [x + size + o, y - o, -1, 1],
    [x - o, y + size + o, 1, -1],
    [x + size + o, y + size + o, -1, -1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.fillRect(dx > 0 ? cx : cx - l, dy > 0 ? cy : cy - t, l, t);
    ctx.fillRect(dx > 0 ? cx : cx - t, dy > 0 ? cy : cy - l, t, l);
  }
}

/** Grid of small dots. */
function dots(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cols: number,
  rows: number,
  gap: number,
  r: number,
  color: string,
) {
  ctx.fillStyle = color;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      ctx.arc(x + col * gap, y + row * gap, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** A tiny contribution-graph strip, echoing the GitHub section on the site. */
function heatStrip(
  ctx: CanvasRenderingContext2D,
  seedText: string,
  x: number,
  y: number,
  cols: number,
  shades: string[],
) {
  const rand = seeded(seedText + "-strip");
  const cell = 18;
  const gap = 5;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < cols; col++) {
      const r = rand();
      const level = r < 0.35 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.93 ? 3 : 4;
      ctx.fillStyle = shades[level];
      ctx.fillRect(x + col * (cell + gap), y + row * (cell + gap), cell, cell);
    }
  }
}

function shadesFor(theme: CardTheme) {
  // Same greys as the site's activity map, on the card's own background
  return theme === "light"
    ? ["#1F2937", "#374151", "#6B7280", "#9CA3AF", "#FFFFFF"]
    : ["#E5E7EB", "#9CA3AF", "#6B7280", "#374151", "#0A0A0A"];
}

export async function makeCardFront(theme: CardTheme, family: string, content: CardContent) {
  const { w, h } = CARD_PX;
  const p = cardPalette(theme);
  const { c, ctx } = newCanvas(w, h);
  const pad = 88;
  const inner = w - pad * 2;

  ctx.fillStyle = p.card;
  ctx.fillRect(0, 0, w, h);
  slot(ctx, w, p.line);

  // Header: wordmark left, dot grid right
  drawLogo(ctx, family, pad, 200, 66, p.ink);
  dots(ctx, w - pad - 4 * 26, 160, 5, 2, 26, 4, p.muted);

  // Photo with viewfinder corners
  const photoSize = 560;
  const px = pad + 18;
  const py = 286;
  const img = content.photo ? await loadImage(content.photo) : null;
  if (img) {
    const s = Math.max(photoSize / img.width, photoSize / img.height);
    const iw = img.width * s;
    const ih = img.height * s;
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, photoSize, photoSize);
    ctx.clip();
    ctx.drawImage(img, px + (photoSize - iw) / 2, py + (photoSize - ih) / 2, iw, ih);
    ctx.restore();
  } else {
    ctx.strokeStyle = p.line;
    ctx.lineWidth = 4;
    ctx.strokeRect(px + 2, py + 2, photoSize - 4, photoSize - 4);
    ctx.save();
    ctx.font = `400 40px ${family}`;
    ctx.fillStyle = p.muted;
    ctx.textAlign = "center";
    ctx.fillText("[PHOTO]", px + photoSize / 2, py + photoSize / 2 + 14);
    ctx.restore();
  }
  cropMarks(ctx, px, py, photoSize, p.ink);

  // Vertical barcode beside the photo, with the wordmark running down it
  const bx = w - pad - 96;
  barcode(ctx, content.name, bx, py, 96, photoSize, p.ink, true);
  ctx.save();
  ctx.translate(bx - 22, py);
  ctx.rotate(Math.PI / 2);
  text(ctx, "ermsDev", 0, 0, `500 26px ${family}`, p.muted, 0.08, 26);
  ctx.restore();

  // Name: wraps onto as many lines as it needs
  const nameSize = 92;
  ctx.save();
  ctx.font = `600 ${nameSize}px ${family}`;
  setTracking(ctx, -0.035, nameSize);
  const nameLines = wrap(ctx, content.name, inner);
  ctx.restore();
  let y = 1000;
  for (const line of nameLines) {
    text(ctx, line, pad, y, `600 ${nameSize}px ${family}`, p.ink, -0.035, nameSize);
    y += nameSize * 1.02;
  }

  // Roles, one per line
  y += 18;
  for (const role of content.roles) {
    text(ctx, role, pad, y, `400 42px ${family}`, p.muted, 0, 42, inner);
    y += 54;
  }

  // Footer: mini activity strip + the accent underscore
  heatStrip(ctx, content.name, pad, h - pad - 64, 18, shadesFor(theme));
  ctx.fillStyle = ACCENT;
  ctx.fillRect(w - pad - 64, h - pad - 16, 64, 16);

  return toTexture(c);
}

export function makeCardBack(theme: CardTheme, family: string, content?: CardContent) {
  const { w, h } = CARD_PX;
  const p = cardPalette(theme);
  const { c, ctx } = newCanvas(w, h);
  const pad = 88;
  ctx.fillStyle = p.card;
  ctx.fillRect(0, 0, w, h);
  slot(ctx, w, p.line);

  // Dot field across the top half
  dots(ctx, pad + 6, 170, 14, 10, 64, 4, p.line);

  // Centered wordmark
  const size = 140;
  ctx.font = `600 ${size}px ${family}`;
  setTracking(ctx, -0.04, size);
  const total = 0.6 * size + ctx.measureText("rmsDev").width + 0.61 * size;
  drawLogo(ctx, family, (w - total) / 2, h / 2 + 20, size, p.ink);

  // Barcode + note
  barcode(ctx, (content?.name ?? "ermsDev") + "-back", pad, h - pad - 230, w - pad * 2, 110, p.ink);
  if (content?.backNote) {
    text(ctx, content.backNote, pad, h - pad - 30, `400 34px ${family}`, p.muted, 0, 34, w - pad * 2);
  }
  return toTexture(c);
}

/** Repeating strap texture: "ermsDev" with the accent underscore. */
export function makeBandTexture(theme: CardTheme, family: string) {
  const w = 1024;
  const h = 128;
  const p = cardPalette(theme);
  const { c, ctx } = newCanvas(w, h, 2);
  ctx.fillStyle = p.card;
  ctx.fillRect(0, 0, w, h);
  drawLogo(ctx, family, 60, 86, 64, p.ink);
  drawLogo(ctx, family, 60 + w / 2, 86, 64, p.ink);
  const t = toTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}
