// Quote card pictures: drawn SVG scenes (no photos), each with a text layout.
// Every template fits some elements and/or topics ("t:c" = Compliments …) and has 1–3 colour versions.
// pickArt() gives each new quote a picture the user hasn't seen yet (per user, saved in S.set.qu).
import type { CSSProperties } from "react";
import { S, save } from "./store";

export interface Quote { e: string; t: string; q: string; a: string; s: string }
export interface Art {
  svg: string;
  /** Style of the text block (position, font, colour). */
  tx: CSSProperties;
  /** "plain" quote, dictionary entry, big poster words, or "none" when the words are drawn in the picture. */
  lay?: "plain" | "dict" | "poster" | "none";
  ink: string;
  /** Tag colour when the top of the picture needs a different one than the text. */
  tag?: string;
  chip: [string, string];
  head?: string;
  sub?: string;
  sticker?: string;
  lower?: boolean;
  upper?: boolean;
}
interface Tpl { id: string; fit: string[]; pals: number; max?: number; draw: (p: number, R: () => number, q: Quote) => Art }

/* ---------- helpers ---------- */
const W = 450, H = 310;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
const rng = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = <T,>(R: () => number, a: T[]) => a[Math.floor(R() * a.length)];
/** Font size in container width units, smaller for longer quotes. */
// 1.15: quotes were enlarged by 15% (owner request, Nov 2026).
export const fz = (n: number, big: number) => (1.15 * big * (n < 30 ? 1 : n < 50 ? 0.9 : n < 75 ? 0.8 : 0.72)).toFixed(2) + "cqw";
const grain = (o = 0.4) => `<rect width="${W}" height="${H}" filter="url(#qa-grain)" opacity="${o}"/>`;
const DEFS = `<defs>
<filter id="qa-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.4 -.45"/></filter>
<filter id="qa-b2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="qa-b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="qa-b14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="qa-b28" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
<filter id="qa-mx" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="14 1"/></filter>
<filter id="qa-wob"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="10"/></filter>
<filter id="qa-paint"><feTurbulence type="fractalNoise" baseFrequency=".035 .5" numOctaves="3" seed="2"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter>
<filter id="qa-tex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 .8  0 0 0 2 -1"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="qa-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".04 2.2" numOctaves="1" seed="3"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .9 -.35"/></filter>
</defs>`;
const svg = (body: string) => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${DEFS}${body}</svg>`;
const lin = (id: string, stops: string[], x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x2="${x2}" y2="${y2}">${stops.map((c, i) => `<stop offset="${(i / Math.max(1, stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join("")}</linearGradient>`;
const rad = (id: string, stops: [number, string, number?][], cx = 0.5, cy = 0.5, r = 0.5) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a ?? 1}"/>`).join("")}</radialGradient>`;
const bg = (fill: string) => `<rect width="${W}" height="${H}" fill="${fill}"/>`;

// Fonts. Serif and hand fonts come from the phone (iOS has them); others fall back gracefully.
const F = {
  sans: "Urbanist, system-ui, sans-serif",
  tight: "'Inter Tight', Urbanist, sans-serif",
  mono: "'Space Mono', ui-monospace, monospace",
  block: "Montserrat, 'Inter Tight', sans-serif",
  serif: "Baskerville, 'Libre Baskerville', Georgia, serif",
  hand: "'Chalkboard SE', 'Marker Felt', 'Comic Sans MS', Urbanist, sans-serif",
  cond: "'Avenir Next Condensed', 'Avenir Next', 'Inter Tight', sans-serif",
};
const TL: CSSProperties = { left: "5.3cqw", top: "13cqw" };
const TR: CSSProperties = { right: "5.3cqw", top: "max(64px, 15cqw)", textAlign: "right" };
const BL: CSSProperties = { left: "5.3cqw", bottom: "calc(3.6cqw + 50px)" };
const CC: CSSProperties = { left: "10%", right: "10%", top: "50%", transform: "translateY(-50%)", textAlign: "center" };
const light: [string, string] = ["rgba(246,246,246,.92)", "#1b2418"];
const dark = (c: string): [string, string] => [c, "#fff"];

/* ---------- reusable drawings ---------- */
function cat(x: number, y: number, s: number, o: { fur?: string; ear?: string; eye?: string; open?: boolean; stripes?: boolean; hat?: "party" | "bucket"; shades?: boolean }) {
  const fur = o.fur || "#f4f3f1", ear = o.ear || "#f1c6c9", eye = o.eye || "#8c7a3a";
  const eyes = o.shades ? "" : o.open
    ? `<ellipse cx="-52" cy="-92" rx="15" ry="13" fill="${eye}" stroke="#2a2b2a" stroke-width="3"/><ellipse cx="52" cy="-92" rx="15" ry="13" fill="${eye}" stroke="#2a2b2a" stroke-width="3"/><circle cx="-50" cy="-92" r="5" fill="#141414"/><circle cx="54" cy="-92" r="5" fill="#141414"/>`
    : `<path d="M-74-92q22-10 44 0q-22 6-44 0z" fill="${eye}" stroke="#2a2b2a" stroke-width="4" stroke-linejoin="round"/><path d="M30-92q22-10 44 0q-22 6-44 0z" fill="${eye}" stroke="#2a2b2a" stroke-width="4" stroke-linejoin="round"/>`;
  const str = o.stripes ? `<path d="M-20-160q6 20 0 34M0-164v36M20-160q-6 20 0 34M-120-60q20 4 36 0M120-60q-20 4-36 0" stroke="#c97a2e" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/>` : "";
  const hat = o.hat == "party"
    ? `<path d="M-46-158l46-110 46 110z" fill="#f7f1e6"/><path d="M-46-158q46 22 92 0" stroke="#7a4a2a" stroke-width="16" fill="none"/><circle cy="-272" r="11" fill="#f1d9b6"/><circle cx="-26" cy="-200" r="8" fill="#9fd0e6"/><circle cx="24" cy="-220" r="8" fill="#f2a8bf"/>`
    : o.hat == "bucket" ? `<path d="M-150-138q150-50 300 0q-20 18-300 0z" fill="#e9a91c"/><path d="M-100-150q10-80 100-80t100 80q-100 18-200 0z" fill="#f5b82a"/>` : "";
  const sh = o.shades ? `<g fill="#151515"><path d="M-96-108h70q8 0 6 10l-6 22q-4 12-18 12h-34q-16 0-20-14z"/><path d="M26-108h70q8 0 6 10l-6 22q-4 12-18 12h-34q-16 0-20-14z"/><rect x="-28" y="-104" width="56" height="7" rx="3"/></g><path d="M-84-100l18 0" stroke="#fff" stroke-width="4" opacity=".5"/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-150 20q-10-120 40-170l-10-70 60 44q60-14 120 0l60-44-10 70q50 50 40 170z" fill="${fur}"/>${str}
<path d="M-108-188l22 40M98-188l-22 40" stroke="${ear}" stroke-width="14" stroke-linecap="round"/>${eyes}
<path d="M-10-58q10 8 20 0q-10-8-20 0z" fill="#f1a6ae"/><path d="M0-52q-4 14-16 14M0-52q4 14 16 14" stroke="#9b8f8f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M-40-50l-60-8M-40-44l-58 6M40-50l60-8M40-44l58 6" stroke="#fff" stroke-width="2" opacity=".7"/>${hat}${sh}</g>`;
}
function duck(x: number, y: number, s: number, o: { shades?: boolean; body?: string } = {}) {
  const b = o.body || "#fbfbf8";
  const sh = o.shades ? `<path d="M-30-12h26q4 0 3 5l-3 10q-2 6-9 6h-12q-7 0-8-7zM4-12h26q4 0 4 5l-4 10q-2 6-9 6H9q-7 0-8-7z" fill="#fff" stroke="#e8e8e8"/><path d="M-26-8h20l-3 10h-14zM8-8h20l-3 10H11z" fill="#3a4a5c"/>` : `<circle cx="-11" cy="-8" r="3.4" fill="#151515"/><circle cx="11" cy="-8" r="3.4" fill="#151515"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="30" ry="34" fill="${b}"/><ellipse cy="14" rx="20" ry="11" fill="#f0a733"/><path d="M-18 12q18 6 36 0" stroke="#d98a1c" stroke-width="2" fill="none"/>${sh}</g>`;
}
function bunny(x: number, y: number, s: number) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="40" rx="120" ry="62" fill="#f3f1ee"/><ellipse cx="-70" cy="-20" rx="58" ry="52" fill="#f6f4f1"/>
<path d="M-96-62q-30-90 0-110q22 40 10 110zM-56-66q0-96 34-104q12 46-14 108z" fill="#f6f4f1"/><path d="M-90-74q-18-60 0-82q10 30 4 80zM-50-76q4-62 22-76q4 34-12 76z" fill="#efc9cc"/>
<g fill="#121212"><path d="M-118-30h36q5 0 4 6l-3 12q-3 8-12 8h-16q-10 0-12-9z"/><path d="M-70-30h36q5 0 4 6l-3 12q-3 8-12 8h-16q-10 0-12-9z"/><rect x="-84" y="-28" width="16" height="4"/></g>
<path d="M-76 0q4 4 8 0" stroke="#d9a0a6" stroke-width="3" fill="none"/><ellipse cx="80" cy="70" rx="40" ry="16" fill="#e9e6e2"/>
<ellipse cx="20" cy="56" rx="50" ry="18" fill="#d68a3a"/><ellipse cx="20" cy="52" rx="42" ry="12" fill="#e9b25e"/><circle cx="6" cy="50" r="5" fill="#b8462e"/><circle cx="32" cy="54" r="5" fill="#b8462e"/></g>`;
}
function figure(x: number, y: number, s: number, fill: string, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${fill}" stroke="${fill}"><circle cx="0" cy="-92" r="10"/><path d="M-9-80q9-4 18 0l6 46q-15 6-30 0z"/><path d="M-8-74q-24-18-26-52M8-74q26-14 30-50" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M-15-36q-30 40-50 92q50 14 100 4q-10-50-20-96z"/><path d="M-8 60l-4 30M10 58l6 30" stroke-width="6" stroke-linecap="round"/></g>`;
}
function star(x: number, y: number, s: number, rot: number, fill: string) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0-78L16-30 62-52 38-10 84 8 34 20 50 70 6 40-18 82-22 34-72 40-36 6-80-20-30-26-46-72-6-38z" fill="${fill}"/></g>`;
}
function hills(cols: string[][], R: () => number, tex = 0.45) {
  let o = "", y = 130;
  cols.forEach((c, i) => {
    const a = y + R() * 20, b = y - 30 + R() * 30, d = y + R() * 24;
    const path = `M-10 ${a}Q${80 + R() * 60} ${b} ${190 + R() * 40} ${y + 6}T${460} ${d}V320H-10z`;
    o += `<defs>${lin("qh" + i, c, 0.3, 1)}</defs><path d="${path}" fill="url(#qh${i})"/><path d="${path}" filter="url(#qa-tex)" opacity="${tex}"/>`;
    y += 50;
  });
  return o;
}
const sparkle = (x: number, y: number, r: number, c: string) => `<path d="M${x} ${y - r}l${r * 0.28} ${r * 0.72} ${r * 0.72} ${r * 0.28}-${r * 0.72} ${r * 0.28}-${r * 0.28} ${r * 0.72}-${r * 0.28}-${r * 0.72}-${r * 0.72}-${r * 0.28} ${r * 0.72}-${r * 0.28}z" fill="${c}"/>`;
function spiral(cx: number, cy: number, b: number, turns: number, s = 6) {
  let d = "";
  for (let t = 0; t < turns * 2 * Math.PI; t += 0.05) {
    const r = s * Math.exp(b * t);
    d += (d ? "L" : "M") + (cx + r * Math.cos(t)).toFixed(1) + " " + (cy + r * Math.sin(t)).toFixed(1);
  }
  return d;
}
/** Split a quote into 2–4 short parts for the chart and path layouts. */
function parts(q: string, n = 4) {
  let a = q.split(/(?<=[,.;:—?!])\s+/).filter(Boolean);
  if (a.length < 3 || a.length > n) {
    const w = q.split(" "), k = Math.min(n, w.length, Math.max(3, Math.ceil(w.length / 4)));
    a = [];
    for (let i = 0; i < k; i++) a.push(w.slice(Math.round((i * w.length) / k), Math.round(((i + 1) * w.length) / k)).join(" "));
  }
  return a;
}
const wrap = (s: string, n: number) => {
  const out: string[] = [];
  let cur = "";
  for (const w of s.split(" ")) {
    if ((cur + " " + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out;
};

const HEAD: Record<string, string[]> = {
  moon: ["stillness", "glow", "hush"], water: ["tide", "depth", "current"], grass: ["sprout", "becoming", "beginning"],
  moss: ["steady", "rooted", "grounded"], ribbon: ["ease", "drift", "unfold"], petal: ["bloom", "tender", "open"],
  sun: ["radiant", "spark", "warmth"], goddess: ["sovereign", "grace", "whole"], wind: ["breath", "release", "lightness"],
};
const STICK = ["TRUE ✸ STORY", "SAY IT ✸ LOUDER", "NO ✸ NOTES", "MAIN ✸ CHARACTER", "OFFICIALLY ✸ TRUE", "READ IT ✸ TWICE"];

/* ---------- templates ---------- */
const T: Tpl[] = [
  // ——— Moon ———
  { id: "moonCatch", fit: ["moon", "goddess"], pals: 3, draw: (p, R, q) => {
    const P = [["#5a6176", "#b3939d", "#5d6772", "#3c4550", "#f4dcc6", "#3b3440", "#fbefe9"], ["#1f2a44", "#4b5a86", "#26304a", "#141b2c", "#f1e6c8", "#0e1220", "#eef0fb"], ["#e9b9a0", "#f3d9c4", "#9aa7b3", "#6c7a88", "#fff4e0", "#5a4a52", "#3d2f35"]][p];
    const lit = Math.floor(R() * 7);
    const dots = [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${60 + i * 20}" cy="203" r="${i == lit ? 3.6 : 3}" fill="${P[4]}" opacity="${i == lit ? 1 : 0.35}"/>`).join("");
    return { svg: svg(`<defs>${lin("qm", [P[0], P[1]])}${rad("qmg", [[0, "#ffe7d0", 0.8], [1, "#ffe7d0", 0]])}</defs>${bg("url(#qm)")}
<rect y="196" width="450" height="114" fill="${P[2]}"/><rect y="250" width="450" height="60" fill="${P[3]}" opacity=".6"/>
<g opacity=".35" stroke="${P[4]}" stroke-width="1.2"><path d="M30 224h70M140 232h110M290 226h60M60 246h150M260 250h120M20 268h90M180 272h160"/></g>
<circle cx="330" cy="62" r="60" fill="url(#qmg)"/><circle cx="330" cy="62" r="22" fill="${P[4]}"/>
<g filter="url(#qa-b2)" fill="${P[5]}" opacity=".88"><path d="M317 150c-10-22-14-46-10-74M343 150c10-22 14-46 10-74" stroke="${P[5]}" stroke-width="7" stroke-linecap="round" fill="none"/><ellipse cx="330" cy="134" rx="10" ry="12"/><path d="M314 148q16-6 32 0l5 54q-21 7-42 0z"/><path d="M309 200q21 9 42 0l8 70h-58z" fill="${P[4]}" opacity=".35"/></g>${dots}${grain(0.5)}`),
      tx: { ...TL, width: "52%", font: `300 ${fz(q.q.length, 5.6)}/1.12 ${F.tight}`, letterSpacing: "-.01em" }, ink: P[6], chip: light };
  } },
  { id: "moonPhases", fit: ["moon", "t:w", "t:g"], pals: 3, draw: (p, _R, q) => {
    const P = [["#151c33", "#2c3a63", "#f1e6c8"], ["#2a1630", "#5a2f5e", "#f6d9e6"], ["#13261f", "#2f5245", "#e9f2d8"]][p];
    let m = "";
    for (let i = 0; i < 8; i++) {
      const x = 42 + i * 52, f = i / 7, off = (f - 0.5) * 2 * 22;
      m += `<circle cx="${x}" cy="62" r="17" fill="${P[2]}" opacity=".95"/><circle cx="${x + (i == 0 || i == 7 ? 0 : off * 1.6)}" cy="62" r="${i == 0 || i == 7 ? 17.5 : 17}" fill="${P[0]}" opacity="${i == 0 || i == 7 ? 0.85 : 0.8}"/>`;
    }
    return { svg: svg(`<defs>${lin("qp", [P[0], P[1]])}</defs>${bg("url(#qp)")}<circle cx="225" cy="62" r="120" fill="${P[2]}" opacity=".06" filter="url(#qa-b28)"/>${m}${grain(0.55)}`),
      tx: { ...BL, width: "78%", font: `400 ${fz(q.q.length, 5.4)}/1.15 ${F.serif}` }, ink: P[2], chip: light };
  } },
  { id: "nightPool", fit: ["moon", "water"], pals: 2, draw: (p, R, q) => {
    const P = [["#0f1626", "#273452", "#f3e3c2"], ["#20142a", "#4a2c4c", "#ffd9c4"]][p];
    let r = "";
    for (let i = 0; i < 16; i++) { const y = 150 + i * 10, w = 8 + i * 5 + R() * 10; r += `<rect x="${330 - w / 2 + (R() - 0.5) * 8}" y="${y}" width="${w}" height="3" rx="1.5" fill="${P[2]}" opacity="${(0.85 - i * 0.045).toFixed(2)}"/>`; }
    return { svg: svg(`<defs>${lin("qn", [P[0], P[1], P[0]])}</defs>${bg("url(#qn)")}<rect y="140" width="450" height="170" fill="${P[0]}" opacity=".6"/>
<circle cx="330" cy="70" r="70" fill="${P[2]}" opacity=".18" filter="url(#qa-b28)"/><circle cx="330" cy="70" r="26" fill="${P[2]}"/><g filter="url(#qa-b2)">${r}</g>${grain(0.5)}`),
      tx: { ...TL, width: "50%", font: `500 ${fz(q.q.length, 5.2)}/1.16 ${F.tight}` }, ink: P[2], chip: light };
  } },
  // ——— Water ———
  { id: "ripple", fit: ["water", "ribbon", "t:i"], pals: 3, draw: (p, R, q) => {
    const P = [["#9c9a68", "#5a6140", "#efe4bd", "#3a3e26", "#fbf4da"], ["#8aa0b3", "#3e5163", "#e6eef4", "#22313d", "#f4f8fb"], ["#d8c3a0", "#a88c66", "#fff6e4", "#6d5638", "#fffaf0"]][p];
    const cx = 220 + R() * 40, cy = 170 + R() * 10;
    const rings = [14, 32, 56, 84, 116, 150, 190, 236, 290].map((r, i) => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${(r * 0.55).toFixed(0)}" stroke-width="${(2.6 - i * 0.18).toFixed(2)}" opacity="${(0.95 - i * 0.09).toFixed(2)}"${i == 0 ? ` fill="${P[3]}"` : ""}/>`).join("");
    const t = esc(q.q.toLowerCase().replace(/[.!]$/, ""));
    return { svg: svg(`<defs>${rad("qw", [[0, P[0]], [1, P[1]]], 0.55, 0.55, 0.8)}<path id="qrp" d="M${cx - 150} ${cy}a150 82 0 1 0 300 0a150 82 0 1 0 -300 0"/></defs>${bg("url(#qw)")}
<g fill="none" stroke="${P[2]}" filter="url(#qa-wob)">${rings}</g>
<text style="font:600 ${q.q.length > 60 ? 15 : 18}px Urbanist,sans-serif;fill:${P[4]};letter-spacing:.4px"><textPath href="#qrp" startOffset="2%">${t} · ${t.length < 45 ? t + " ·" : ""}</textPath></text>${grain(0.45)}`),
      tx: {}, lay: "none", ink: P[4], chip: light };
  } },
  { id: "vortex", fit: ["water", "wind", "t:w"], pals: 3, draw: (p, _R, q) => {
    const P = [["#a8b39a", "#5d6b56", "#f1ecd6"], ["#9fb7c9", "#45607a", "#f2f7fb"], ["#c9a99a", "#7a5248", "#fbeee6"]][p];
    let s = "";
    for (let k = 0; k < 9; k++) s += `<path d="${spiral(0, 0, 0.16, 3.2, 4)}" transform="translate(300 150) rotate(${k * 40}) scale(1 .62)" stroke-width="${1.2 + (k % 3) * 0.5}" opacity="${0.35 + (k % 3) * 0.2}"/>`;
    return { svg: svg(`<defs>${rad("qv", [[0, P[1]], [1, P[0]]], 0.66, 0.5, 0.7)}</defs>${bg("url(#qv)")}<g fill="none" stroke="${P[2]}" filter="url(#qa-wob)">${s}</g><ellipse cx="300" cy="150" rx="10" ry="6" fill="${P[1]}"/>${grain(0.45)}`),
      tx: { ...TL, width: "46%", font: `500 ${fz(q.q.length, 5.2)}/1.16 ${F.serif}` }, ink: P[2], chip: light };
  } },
  { id: "conch", fit: ["water", "t:w", "t:g"], pals: 2, draw: (p, _R, q) => {
    const P = [["#c9d4dc", "#7d93a6", "#f4f7f9", "#e48a6a", "#2c3e4f"], ["#e6d6cc", "#b08f80", "#fbf6f2", "#c76a5a", "#4a2e28"]][p];
    let rings = "";
    for (let i = 7; i >= 1; i--) {
      const r = i * 20; let d = "";
      for (let a = 0; a <= 360; a += 6) { const rr = r + Math.sin((a * Math.PI) / 30) * (i * 1.2); d += (a ? "L" : "M") + (140 + rr * Math.cos((a * Math.PI) / 180)).toFixed(1) + " " + (155 + rr * Math.sin((a * Math.PI) / 180)).toFixed(1); }
      rings += `<path d="${d}z" fill="${i % 2 ? P[0] : P[2]}" stroke="${P[1]}" stroke-width="1.2" opacity=".95"/>`;
    }
    return { svg: svg(`${bg(P[1])}<g filter="url(#qa-b2)">${rings}</g><circle cx="140" cy="155" r="14" fill="${P[3]}" filter="url(#qa-b2)"/><path d="${spiral(140, 155, 0.2, 2, 2)}" stroke="${P[2]}" fill="none" stroke-width="1.5"/>${grain(0.4)}`),
      tx: { ...TR, width: "38%", font: `500 ${fz(q.q.length, 4.8)}/1.18 ${F.serif}` }, ink: P[4], chip: dark(P[4]) };
  } },
  { id: "hexGlass", fit: ["water", "ribbon", "t:i"], pals: 3, draw: (p, _R, q) => {
    const P = [["#8fc0d8", "#7bb84a", "#2f5a2a"], ["#f2c48a", "#c9784a", "#5a2a16"], ["#e8b6c9", "#9a7ac8", "#3a2458"]][p];
    return { svg: svg(`<defs>${lin("qx", [P[0], P[1], P[2]], 0.4, 1)}<pattern id="qhex" width="26" height="45" patternUnits="userSpaceOnUse"><path d="M13 0l13 7.5v15L13 30 0 22.5v-15zM0 37.5l13 7.5M26 37.5L13 45M13 30v15" fill="none" stroke="#fff" stroke-width="2" opacity=".45"/></pattern></defs>${bg("url(#qx)")}
<g filter="url(#qa-b28)"><circle cx="110" cy="80" r="70" fill="#fff" opacity=".45"/><circle cx="340" cy="230" r="80" fill="${P[2]}" opacity=".6"/></g><rect width="450" height="310" fill="url(#qhex)"/><rect width="450" height="310" fill="url(#qhex)" transform="translate(2 2)" opacity=".5" filter="url(#qa-b2)"/>${grain(0.3)}`),
      tx: { ...CC, font: `800 ${fz(q.q.length, 6.2)}/1.05 ${F.sans}`, textShadow: "0 2px 18px rgba(0,0,0,.25)" }, ink: "#fff", chip: light };
  } },
  // ——— Sprout ———
  { id: "backlitLeaf", fit: ["grass", "petal", "t:i"], pals: 3, draw: (p, R, q) => {
    const P = [["#cfdc9a", "#e3ebd2", "#b7c77e", "#9fb36a", "#f6f8f1", "#2f4a20"], ["#f2c9c9", "#f7e3e1", "#e3a3a8", "#d9898f", "#fdf6f5", "#6b2b35"], ["#efe39a", "#f7f1cf", "#d8c768", "#c2ad44", "#fdfbee", "#5a4a10"]][p];
    let v = "";
    for (let a = 0; a < 360; a += 15) v += `M0 0L${(120 * Math.cos((a * Math.PI) / 180)).toFixed(0)} ${(120 * Math.sin((a * Math.PI) / 180)).toFixed(0)}`;
    const leaf = (x: number, y: number, r: number, o: number) => `<g opacity="${o}" transform="translate(${x} ${y})"><circle r="${r}" fill="url(#ql)"/><path d="${v}" transform="scale(${r / 120})" stroke="${P[2]}" stroke-width="1.3"/></g>`;
    return { svg: svg(`<defs>${rad("ql", [[0, P[0]], [0.55, P[1]], [1, P[0]]])}</defs>${bg(P[4])}${leaf(330 + R() * 20, 70, 120, 0.8)}${leaf(110, 300, 135, 0.75)}${leaf(420, 290, 90, 0.6)}
<path d="M330 70q-30 70-40 150M120 300q20-60 70-90" stroke="${P[3]}" stroke-width="5" fill="none" stroke-linecap="round"/><g transform="translate(196 206) rotate(-20)"><ellipse rx="13" ry="20" fill="${P[4]}" stroke="${P[3]}"/></g>${grain(0.25)}`),
      tx: { ...TL, width: "46%", font: `300 ${fz(q.q.length, 6)}/1.08 ${F.tight}`, letterSpacing: "-.02em" }, ink: P[5], chip: dark(P[5]) };
  } },
  { id: "bigLeaf", fit: ["grass", "petal", "t:g", "t:w"], pals: 2, draw: (p, _R, q) => {
    const P = [["#d9dacd", "#eeeee6", "#c7c9b6", "#9eae6a", "#3e4a2a"], ["#e6d9d2", "#f6efea", "#d6c3b6", "#b58b6a", "#4a3226"]][p];
    let v = "";
    for (let i = -3; i <= 3; i++) v += `<path d="M300 180Q${300 + i * 40} ${120} ${300 + i * 62} ${40 + Math.abs(i) * 20}" stroke="${P[3]}" stroke-width="1.4" fill="none" opacity=".7"/>`;
    return { svg: svg(`<defs>${rad("qbl", [[0, P[1]], [1, P[0]]], 0.66, 0.4, 0.7)}</defs>${bg(P[2])}<path d="M300 190C150 220 80 80 160 10S300-10 300 30C300-10 460-30 470 60S420 220 300 190z" fill="url(#qbl)"/>${v}
<path d="M300 180q-6 80 4 140" stroke="${P[3]}" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="300" cy="182" r="14" fill="${P[3]}" opacity=".5" filter="url(#qa-b6)"/>${grain(0.3)}`),
      tx: { ...BL, width: "44%", font: `500 ${fz(q.q.length, 4.8)}/1.18 ${F.serif}` }, ink: P[4], chip: dark(P[4]) };
  } },
  { id: "track", fit: ["grass", "sun", "t:i", "t:c"], pals: 3, draw: (p, _R, q) => {
    const P = [["#8fb83a", "#5f8a22", "#5b4fc8", "#4339a8"], ["#9ab84a", "#6a8a2a", "#c8603a", "#a84a2a"], ["#a6c24a", "#6f8f2a", "#2f8a8a", "#1f6a6a"]][p];
    let lanes = "";
    for (let i = 0; i < 6; i++) lanes += `<ellipse cx="60" cy="-40" rx="${330 + i * 34}" ry="${300 + i * 30}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".9"/>`;
    return { svg: svg(`<defs>${lin("qt", [P[0], P[1]], 1, 1)}</defs>${bg(P[3])}<ellipse cx="60" cy="-40" rx="${330 + 6 * 34}" ry="${300 + 6 * 30}" fill="${P[2]}"/><ellipse cx="60" cy="-40" rx="330" ry="300" fill="url(#qt)"/>
<ellipse cx="60" cy="-40" rx="330" ry="300" filter="url(#qa-tex)" opacity=".5"/>${lanes}<g filter="url(#qa-b28)"><ellipse cx="120" cy="80" rx="140" ry="40" fill="#1e3a10" opacity=".35"/></g>${grain(0.3)}`),
      tx: { ...TL, width: "58%", font: `700 ${fz(q.q.length, 4.8)}/1.2 ${F.hand}`, textTransform: "uppercase", letterSpacing: ".04em" }, ink: "#fff", chip: light };
  } },
  { id: "chart", fit: ["grass", "moss", "t:i"], max: 56, pals: 3, draw: (p, R, q) => {
    const P = [["#a9b9a0", "#4d6b3a", "#2f4a20"], ["#b8bdb4", "#6a7466", "#3a4238"], ["#c9c08a", "#7a7038", "#4a4218"]][p];
    const a = parts(q.q, 4), n = a.length, pts = a.map((_, i) => [40 + (i * 330) / Math.max(1, n - 1), 196 - i * (84 / Math.max(1, n - 1)) + (i % 2 ? 18 : 0)]);
    let leaves = "";
    for (let i = 0; i < 6; i++) leaves += `<ellipse cx="${R() * 450}" cy="${R() * 310}" rx="${70 + R() * 60}" ry="${30 + R() * 20}" transform="rotate(${-40 + R() * 80} 225 155)" fill="${i % 2 ? P[1] : P[2]}" opacity=".8"/>`;
    const labels = a.map((s, i) => wrap(s.toUpperCase(), 12).map((l, j) => `<tspan x="${Math.min(pts[i][0] - 6, 292)}" dy="${j ? 20 : 0}">${esc(l)}</tspan>`).join("")).map((t, i) => `<text y="${pts[i][1] + 28}" style="font:600 17px 'Inter Tight',sans-serif;fill:#fff;letter-spacing:.4px">${t}</text>`).join("");
    return { svg: svg(`${bg(P[0])}<g filter="url(#qa-b14)">${leaves}</g><polyline points="${pts.map(x => x.join(",")).join(" ")}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 5"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#fff"/>`).join("")}${labels}${grain(0.3)}`),
      tx: {}, lay: "none", ink: "#fff", chip: light };
  } },
  // ——— Earth ———
  { id: "hillsDict", fit: ["moss", "grass", "wind"], pals: 3, draw: (p, R, q) => {
    const P = [{ sky: ["#cfd3cc", "#e6e7e0"], h: [["#9fae8c", "#7f8f6a"], ["#8ea65a", "#3f5a22"], ["#6f8d38", "#2b4116"], ["#a6b862", "#4b6a24"]], ink: "#2c3a20" },
      { sky: ["#f1d6b0", "#f6e8d2"], h: [["#d8b07a", "#b98a52"], ["#c99a52", "#8a5a2a"], ["#a87a3a", "#5a3a18"], ["#d4a85a", "#8a6022"]], ink: "#3a2410" },
      { sky: ["#c9d3dc", "#e3e8ec"], h: [["#a8b6c4", "#8496a8"], ["#7f93a8", "#4a5e72"], ["#5d7288", "#2e3e50"], ["#8aa0b4", "#46607a"]], ink: "#1e2a38" }][p];
    return { svg: svg(`<defs>${lin("qs", P.sky)}</defs>${bg("url(#qs)")}${hills(P.h, R)}${grain(0.3)}`),
      tx: { ...TL, width: "78%" }, lay: "dict", head: pick(R, HEAD[q.e] || HEAD.moss), ink: P.ink, chip: light };
  } },
  { id: "grassWaves", fit: ["moss", "grass", "wind", "t:w"], pals: 3, draw: (p, _R, q) => {
    const P = [["#1f3a12", "#4f7a22", "#b8d86a"], ["#5a3a10", "#a8782a", "#f2d27a"], ["#123a3a", "#2f6a5a", "#9ad8b8"]][p];
    let w = "";
    for (let i = 0; i < 7; i++) { const y = 20 + i * 46; w += `<path d="M-20 ${y + 40}Q100 ${y - 20} 220 ${y + 30}T470 ${y + 10}V${y + 120}H-20z" fill="url(#qg)" opacity=".95"/><path d="M-20 ${y + 40}Q100 ${y - 20} 220 ${y + 30}T470 ${y + 10}" stroke="${P[2]}" stroke-width="3" fill="none" opacity=".55" filter="url(#qa-b2)"/>`; }
    return { svg: svg(`<defs>${lin("qg", [P[1], P[0]])}</defs>${bg(P[0])}${w}<rect width="450" height="310" filter="url(#qa-tex)" opacity=".18" fill="#fff"/>${grain(0.35)}`),
      tx: { ...BL, width: "70%", font: `600 ${fz(q.q.length, 5.4)}/1.12 ${F.tight}` }, ink: "#fff", chip: light };
  } },
  { id: "mossTree", fit: ["moss", "t:w", "t:g"], pals: 2, draw: (p, _R, q) => {
    const P = [["#e9ece6", "#5a6a2a", "#a8b84a", "#3a3a32"], ["#e6e3ea", "#4a5a3a", "#94a86a", "#3a3440"]][p];
    const br = `<path d="M260 330C250 230 220 190 170 120S120 40 110-20h40c10 50 40 90 80 130 20-60 60-110 90-140h40c-30 40-80 100-90 170 0 60 10 130 20 190z"/>`;
    return { svg: svg(`${bg(P[0])}<g filter="url(#qa-b14)" fill="${P[3]}" opacity=".25"><path d="M60 330C60 200 20 120-10 60h30c30 60 60 140 70 270zM420 330c0-120 20-200 60-260v40c-30 60-40 130-40 220z"/></g><g fill="${P[1]}">${br}</g><g fill="${P[2]}" filter="url(#qa-tex)" opacity=".9">${br}</g><rect width="450" height="120" fill="${P[0]}" opacity=".45" filter="url(#qa-b14)"/>${grain(0.3)}`),
      tx: { ...TL, width: "40%", font: `500 ${fz(q.q.length, 4.8)}/1.18 ${F.serif}` }, ink: P[3], chip: dark(P[3]) };
  } },
  { id: "arch", fit: ["moss", "wind", "t:w"], pals: 2, draw: (p, _R, q) => {
    const P = [["#e9e2d6", "#4a3a2c", "#f2ede4", "#1c1a18"], ["#e3e3e1", "#3a3a3a", "#f1f1ef", "#151515"]][p];
    return { svg: svg(`${bg(P[0])}<path d="M-10 160C60 40 160 10 230 50s120 70 230 110" stroke="${P[1]}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M-10 160C60 40 160 10 230 50s120 70 230 110" stroke="#fff" stroke-width="34" fill="none" filter="url(#qa-tex)" opacity=".35"/>
<rect y="170" width="450" height="140" fill="${P[2]}"/><rect y="290" width="450" height="20" fill="#8a8580" opacity=".4"/>
<g fill="${P[3]}" transform="translate(110 0)"><path d="M150 290l70-90q14-14 26 0l70 90h-14l-62-74-62 74z"/><circle cx="150" cy="282" r="9" fill="#d8c8b8"/><path d="M150 290l40-52 8 10-38 46z" fill="#f4f1ec" stroke="#bbb"/></g>${grain(0.45)}`),
      tx: { ...BL, width: "50%", font: `500 ${fz(q.q.length, 4.2)}/1.18 ${F.serif}` }, ink: P[3], chip: dark(P[3]) };
  } },
  // ——— Flow (new concept: silk scarf) ———
  { id: "silk", fit: ["ribbon", "goddess", "wind", "t:c"], pals: 3, draw: (p, R, q) => {
    const P = [["#d9e6ef", "#f4ece6", "#f3c9cf", "#e5a3b0", "#fff1f2", "#4a2a33"], ["#ece4f2", "#fbeee6", "#d9c3ef", "#f2b8a0", "#fff6f0", "#3e2a4a"], ["#e3ebe1", "#f6f2e6", "#cfe0c6", "#e8d6a8", "#fbfaf2", "#2e3a2a"]][p];
    const fold = (d: string, g: string, o: number) => `<path d="${d}" fill="url(#${g})" opacity="${o}"/>`;
    const y = R() * 20;
    return { svg: svg(`<defs>${lin("qk", [P[0], P[1]])}${lin("qk1", [P[4], P[2], P[3]], 1, 0.4)}${lin("qk2", [P[3], P[4], P[2]], 1, 0.2)}${lin("qk3", [P[2], P[4]], 0.6, 1)}</defs>${bg("url(#qk)")}
<g filter="url(#qa-b2)">${fold(`M-20 ${150 + y}C80 40 170 260 280 120S420 ${10 + y} 480 60V140C420 90 360 250 270 210S110 160-20 260z`, "qk1", 0.95)}
${fold(`M-20 ${190 + y}C90 120 160 300 270 170S400 60 480 110V170C420 140 340 300 250 240S100 230-20 300z`, "qk2", 0.85)}
${fold(`M60 ${80 + y}C140 20 210 140 300 60S400 0 470 20V50C400 40 330 140 260 120S140 60 60 ${110 + y}z`, "qk3", 0.75)}</g>
<path d="M-20 ${150 + y}C80 40 170 260 280 120S420 ${10 + y} 480 60" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>${grain(0.2)}`),
      tx: { ...BL, width: "66%", font: `600 ${fz(q.q.length, 5.2)}/1.14 ${F.tight}`, letterSpacing: "-.01em" }, ink: P[5], chip: dark(P[5]) };
  } },
  { id: "dancers", fit: ["ribbon", "goddess", "petal", "t:i"], pals: 2, draw: (p, R, q) => {
    const P = [["#2a1d18", "#5a3a2c", ["#a9c8e6", "#f0eccf", "#b39ad8", "#bcd8d0"]], ["#1a1a24", "#3a3450", ["#f2b8c8", "#f6e6b8", "#9fd0c8", "#d8b8f0"]]][p] as [string, string, string[]];
    let d = "";
    P[2].forEach((c, i) => {
      const x = 70 + i * 100 + R() * 20;
      d += `<g filter="url(#qa-mx)" opacity=".9"><path d="M${x - 8} 90q-10-40-4-70M${x + 8} 90q12-40 6-70" stroke="#e6c8b0" stroke-width="7" stroke-linecap="round"/><circle cx="${x}" cy="80" r="10" fill="#3a2a22"/><path d="M${x - 12} 92h24l6 60h-36z" fill="${c}"/><path d="M${x - 20} 150q${20} -10 40 0l${50} ${70}q-70 20-130 0z" fill="${c}"/><path d="M${x - 6} 230v40M${x + 8} 230v40" stroke="#e6c8b0" stroke-width="5"/></g>`;
    });
    return { svg: svg(`<defs>${rad("qd", [[0, P[1]], [1, P[0]]], 0.5, 0.3, 0.8)}</defs>${bg("url(#qd)")}<rect y="260" width="450" height="50" fill="#5a2a1c" opacity=".7"/>${d}${grain(0.4)}`),
      tx: { ...TL, width: "50%", font: `500 ${fz(q.q.length, 5)}/1.15 ${F.serif}`, textShadow: "0 1px 12px rgba(0,0,0,.5)" }, ink: "#fbf3ea", chip: light };
  } },
  { id: "echoes", fit: ["ribbon", "wind", "sun", "t:i"], pals: 2, draw: (p, _R, q) => {
    const P = [["#f4efea", "#e2552c", "#1d1718"], ["#eef0f2", "#5a6ad8", "#141824"]][p];
    const lunge = (x: number, o: number, f: string) => `<g transform="translate(${x} 0)" opacity="${o}" fill="${f}"><circle cx="0" cy="120" r="16"/><path d="M-14 136q14-6 28 0l8 70q-20 10-40 0z"/><path d="M-6 206l-70 40 6 30 70-46zM10 206l40 70h28l-50-80z"/><path d="M10 150q30 20 60 60" stroke="${f}" stroke-width="10" stroke-linecap="round"/></g>`;
    return { svg: svg(`${bg(P[0])}<g filter="url(#qa-b6)">${lunge(150, 0.4, P[1])}${lunge(220, 0.45, P[1])}${lunge(290, 0.5, P[1])}</g>${lunge(165, 0.25, P[2])}${lunge(235, 0.45, P[2])}${lunge(305, 0.9, P[2])}<g filter="url(#qa-b28)"><circle cx="100" cy="40" r="60" fill="${P[2]}" opacity=".12"/></g>${grain(0.3)}`),
      tx: { ...TL, width: "40%", font: `600 ${fz(q.q.length, 4.6)}/1.16 ${F.tight}` }, ink: P[2], chip: dark(P[2]) };
  } },
  // ——— Bloom ———
  { id: "florescence", fit: ["petal", "sun", "t:i", "t:c"], pals: 3, draw: (p, R, q) => {
    const P = [["#2e3226", "#e8a02c", "#8ea4e6", "#5b6b2f"], ["#2a2228", "#f08aa8", "#a6d88a", "#6a3a5a"], ["#1e1e2e", "#b88af0", "#f2d24a", "#3a3a6a"]][p];
    let s = "";
    for (let i = 0; i < 6; i++) s += `<ellipse cx="${R() * 450}" cy="${R() * 310}" rx="${100 + R() * 80}" ry="${24 + R() * 18}" fill="${P[1 + (i % 3)]}"/>`;
    return { svg: svg(`${bg(P[0])}<g filter="url(#qa-b28)" transform="rotate(-24 225 155)">${s}</g>${grain(0.7)}`),
      tx: { ...CC, width: "auto" }, lay: "dict", head: pick(R, HEAD[q.e] || HEAD.petal), ink: "#f6f1e6", chip: light, upper: true };
  } },
  { id: "driedPetals", fit: ["petal", "wind", "t:g", "t:w"], pals: 3, draw: (p, R, q) => {
    const P = [["#efe6d2", "#b9a27a", "#8a7044", "#3a2a14"], ["#f6e6e6", "#d8a8a8", "#a86a6a", "#4a1e22"], ["#e8f0e2", "#a8bf98", "#6a8a5a", "#1e3a1a"]][p];
    let s = "";
    for (let i = 0; i < 14; i++) {
      const x = R() * 450, y = R() * 310, r = R() * 360, l = 60 + R() * 80;
      s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${r.toFixed(0)})"><path d="M0 0C${l * 0.3} -26 ${l * 0.8} -18 ${l} 0C${l * 0.8} 14 ${l * 0.3} 22 0 0z" fill="${P[1]}" opacity=".55"/><path d="M4 0H${l - 6}M10 -3Q${l / 2} -8 ${l - 10} -2M10 3Q${l / 2} 8 ${l - 10} 2" stroke="${P[2]}" stroke-width=".8" fill="none" opacity=".7"/></g>`;
    }
    return { svg: svg(`${bg(P[0])}${s}<rect x="0" y="0" width="300" height="200" fill="${P[0]}" opacity=".6" filter="url(#qa-b28)"/>${grain(0.3)}`),
      tx: { ...TL, width: "50%", font: `500 ${fz(q.q.length, 4.8)}/1.18 ${F.serif}` }, ink: P[3], chip: dark(P[3]) };
  } },
  { id: "lotus", fit: ["petal", "goddess", "t:c"], pals: 3, draw: (p, _R, q) => {
    const P = [["#f6e9ea", "#f2b8c2", "#e07a90", "#fff6f6", "#5a1e2c"], ["#eef0e6", "#f2e2a0", "#d8b03a", "#fffbe8", "#4a3a0a"], ["#ece9f4", "#cbb8ec", "#8a6ad0", "#f8f4ff", "#2e1e58"]][p];
    let pe = "";
    for (let k = 0; k < 2; k++) for (let i = 0; i < 12; i++) pe += `<path d="M0 0C-26 -40 -18 -${100 - k * 30} 0 -${120 - k * 40}C18 -${100 - k * 30} 26 -40 0 0z" transform="rotate(${i * 30 + k * 15})" fill="url(#qlo)" opacity="${0.9 - k * 0.1}" stroke="${P[2]}" stroke-width=".6"/>`;
    return { svg: svg(`<defs>${lin("qlo", [P[3], P[1], P[2]], 0, 1)}</defs>${bg(P[0])}<g transform="translate(330 170)">${pe}<circle r="16" fill="${P[2]}"/></g>${grain(0.25)}`),
      tx: { ...TL, width: "42%", font: `600 ${fz(q.q.length, 5)}/1.12 ${F.tight}` }, ink: P[4], chip: dark(P[4]) };
  } },
  // ——— Sun ———
  { id: "auraHands", fit: ["sun", "goddess", "t:c", "t:i"], pals: 3, draw: (p, _R, q) => {
    const P = [["#cfe6ee", "#f3f0e6", "#c8532e", "#ef8a70", "#f7b9a8", "#2c6a6a", "#2a1e1e"], ["#efe6f6", "#fbf4e6", "#d89a1a", "#f2c84a", "#f8e2a0", "#5a3a8a", "#2a1e10"], ["#f6e0e6", "#e6eef6", "#d8406a", "#f08aa8", "#f6c0d0", "#2a4a8a", "#2a1220"]][p];
    const w = q.q.replace(/[.!]$/, "").split(" "), last = w.pop();
    return { svg: svg(`<defs>${lin("qa0", [P[0], P[1]], 1, 1)}${rad("qa1", [[0, P[2]], [0.35, P[3]], [0.7, P[4], 0.8], [1, P[4], 0]])}</defs>${bg("url(#qa0)")}
<g filter="url(#qa-b6)" fill="${P[5]}" opacity=".85"><path d="M120 330q10-70 40-110q-14-50 2-70q14 30 22 70q30 10 60 40q-50-10-80 10q-10 30-6 60z"/><path d="M330 330q-10-70-40-110q14-50-2-70q-14 30-22 70q-30 10-60 40q50-10 80 10q10 30 6 60z"/></g>
<circle cx="225" cy="140" r="115" fill="url(#qa1)" filter="url(#qa-b14)"/>${grain(0.45)}`),
      tx: { ...CC, top: "45%", left: "22%", right: "22%", font: `400 ${fz(q.q.length, 4.4)}/1.25 ${F.tight}` }, sub: last, lower: true, ink: P[6], chip: dark(P[6]) };
  } },
  { id: "sunrise", fit: ["sun", "t:g", "t:i"], pals: 3, draw: (p, _R, q) => {
    const P = [["#f6d6b8", "#f2a07a", "#e8603a", "#7a3a2a"], ["#f8e6b0", "#f2c04a", "#d88a1a", "#5a3a10"], ["#f6d0d8", "#f08aa0", "#d84a6a", "#5a1a2a"]][p];
    let r = "";
    for (let i = 0; i < 18; i++) r += `<path d="M225 250L${225 + 600 * Math.cos(Math.PI + (i + 0.5) * (Math.PI / 18))} ${250 + 600 * Math.sin(Math.PI + (i + 0.5) * (Math.PI / 18))}" stroke="#fff" stroke-width="${i % 2 ? 6 : 14}" opacity=".18"/>`;
    return { svg: svg(`<defs>${lin("qsu", [P[0], P[1]])}</defs>${bg("url(#qsu)")}${r}<circle cx="225" cy="250" r="80" fill="${P[2]}"/><circle cx="225" cy="250" r="110" fill="${P[2]}" opacity=".3" filter="url(#qa-b14)"/><rect y="250" width="450" height="60" fill="${P[3]}"/>${grain(0.5)}`),
      tx: { ...TL, width: "70%", font: `700 ${fz(q.q.length, 5.4)}/1.08 ${F.tight}`, letterSpacing: "-.02em" }, ink: P[3], chip: dark(P[3]) };
  } },
  { id: "starField", fit: ["goddess", "sun", "t:c"], max: 70, pals: 2, draw: (p, R, q) => {
    const P = [["#9cbf6a", "#5a7f2a", "#f6e7a4", "#7a1f3a"], ["#c9d88a", "#7a9a3a", "#f8d0e0", "#5a1a6a"]][p];
    return { svg: svg(`<defs>${lin("qsf", [P[0], P[1]])}</defs>${bg("url(#qsf)")}<rect width="450" height="310" filter="url(#qa-tex)" opacity=".35" fill="#fff"/><g filter="url(#qa-b14)"><ellipse cx="80" cy="80" rx="90" ry="60" fill="#2a3a14" opacity=".4"/><ellipse cx="400" cy="60" rx="70" ry="50" fill="#2a3a14" opacity=".4"/></g>${star(225, 158, 1.75 + R() * 0.1, -8 + R() * 6, P[2])}${grain(0.3)}`),
      tx: { left: "32%", right: "32%", top: "50%", transform: "translateY(-50%) rotate(-6deg)", textAlign: "center", font: `800 ${fz(q.q.length, 3.6)}/1.1 ${F.block}`, textTransform: "uppercase" }, ink: P[3], chip: dark(P[3]) };
  } },
  // ——— Goddess ———
  { id: "eraPoster", fit: ["goddess", "t:c", "t:i"], max: 52, pals: 3, draw: (p, R, q) => {
    const P = [["#eee8dc", "#a785c8", "#f6e7a4", "#7a1f3a"], ["#f4e6e0", "#e8604a", "#bcd8f0", "#2a3a6a"], ["#eef0e2", "#5a8a4a", "#f6c6d6", "#5a1a3a"]][p];
    return { svg: svg(`${bg(P[0])}<rect width="450" height="310" filter="url(#qa-paper)"/>${star(355, 225, 0.95, -12, P[2])}`),
      tx: { left: "5.3cqw", top: "12cqw", width: "72%", font: `800 ${fz(q.q.length, 7.6)}/.98 ${F.block}`, textTransform: "uppercase", letterSpacing: ".01em" }, lay: "poster", sticker: pick(R, STICK), ink: P[1], chip: dark(P[3]), head: P[3] };
  } },
  { id: "statue", fit: ["goddess", "t:w", "moon"], pals: 2, draw: (p, _R, q) => {
    const P = [["#1e3a7a", "#f4efe6", "#d6cbbb", "#1c2c5a"], ["#7a3a2a", "#f6eee6", "#d8c4b4", "#4a1e12"]][p];
    let f = "";
    for (let i = 0; i < 9; i++) f += `<path d="M${150 + i * 34} 0C${130 + i * 34} 100 ${190 + i * 30} 200 ${140 + i * 36} 320" stroke="${P[2]}" stroke-width="${10 + (i % 3) * 6}" fill="none" opacity=".7" filter="url(#qa-b6)"/>`;
    return { svg: svg(`${bg(P[0])}<path d="M140 0H460V320H110C150 220 120 120 140 0z" fill="${P[1]}"/>${f}<path d="M170 60q30-10 80 10t90 0" stroke="${P[2]}" stroke-width="3" fill="none" stroke-dasharray="1 7" stroke-linecap="round"/>${grain(0.25)}`),
      tx: { ...TR, width: "52%", font: `500 ${fz(q.q.length, 5)}/1.16 ${F.serif}` }, ink: P[3], chip: dark(P[3]) };
  } },
  // ——— Air ———
  { id: "windExposure", fit: ["wind", "ribbon", "t:w"], pals: 3, draw: (p, _R, q) => {
    const P = [["#e9e7e3", "#cfccc6", "#1d1a1c", "#e2552c"], ["#efe6d8", "#d6c6ae", "#2a1e14", "#c8603a"], ["#e3e8ee", "#c3ccd6", "#141c26", "#5a7ad8"]][p];
    return { svg: svg(`<defs>${lin("qwe", [P[0], P[1]])}</defs>${bg("url(#qwe)")}
<g opacity=".55" fill="${P[2]}" filter="url(#qa-b2)"><path d="M352 310q-4-110 22-176l7 2q-20 70-18 174z"/><path d="M376 134q-50-40-130-34q70 8 128 40z"/><path d="M376 134q-60-10-120 30q70-30 120-24z"/><path d="M376 134q-40 10-80 70q50-56 82-64z"/><path d="M376 134q-70-60-150-60q90 20 146 64z"/><path d="M378 134q-10-40-60-70q46 40 56 72z"/></g>
<g opacity=".3">${figure(112, 210, 1, P[3], -12)}</g><g opacity=".45" filter="url(#qa-b2)">${figure(146, 212, 1, P[2], -5)}</g><g opacity=".85">${figure(180, 214, 1, P[2])}</g>${grain(0.6)}`),
      tx: { ...TR, width: "40%", font: `500 ${fz(q.q.length, 5)}/1.12 ${F.serif}` }, ink: P[2], chip: dark(P[2]) };
  } },
  { id: "palmStorm", fit: ["wind", "t:w", "t:i"], max: 60, pals: 2, draw: (p, R, q) => {
    const P = [["#dcdcda", "#0d0d0d", "#2a2a2a"], ["#e6dccc", "#1a120c", "#3a2a1c"]][p];
    let palms = "";
    for (let i = 0; i < 5; i++) {
      const x = 40 + i * 95 + R() * 20, h = 70 + R() * 40;
      palms += `<g transform="translate(${x} 190)"><path d="M0 0q-6-${h / 2} 10-${h}" stroke="${P[2]}" stroke-width="5" fill="none"/><g transform="translate(10 -${h})" fill="none" stroke="${P[2]}" stroke-linecap="round">${[[-80, -6], [-74, 14], [-62, 34], [-40, 46], [-86, -22], [22, -16], [16, 18]].map(([dx, dy], k) => `<path d="M0 0Q${dx * 0.5} ${dy * 0.3 - 16} ${dx} ${dy}" stroke-width="${k < 5 ? 5 : 3.5}"/><path d="M0 0Q${dx * 0.5} ${dy * 0.3 - 16} ${dx} ${dy}" stroke-width="12" stroke-dasharray="2 5" opacity=".7"/>`).join("")}</g></g>`;
    }
    return { svg: svg(`${bg(P[0])}<g filter="url(#qa-b2)" opacity=".9">${palms}</g><rect y="190" width="450" height="120" fill="${P[1]}"/>${grain(0.6)}`),
      tx: { ...BL, width: "80%", font: `500 ${fz(q.q.length, 4.8)}/1.16 ${F.serif}` }, ink: "#f2f0ea", tag: P[1], chip: light };
  } },
  { id: "mistDict", fit: ["wind", "moss", "moon", "t:w"], max: 75, pals: 2, draw: (p, R, q) => {
    const P = [{ sky: ["#d6d8d6", "#eceeec"], h: [["#b4bca8", "#8a9a7a"], ["#8a9a5a", "#4a5a2a"], ["#7a8a42", "#3a4a1a"]] }, { sky: ["#d8d4dc", "#ecebef"], h: [["#bab4c4", "#948aa6"], ["#8a7a9a", "#4e4060"], ["#6a5a7a", "#2e2440"]] }][p];
    return { svg: svg(`<defs>${lin("qmd", P.sky)}</defs>${bg("url(#qmd)")}${hills(P.h, R, 0.3)}<rect y="90" width="450" height="220" fill="#000" opacity=".12"/>${grain(0.3)}`),
      tx: { left: "6cqw", bottom: "calc(3.6cqw + 52px)", width: "76%" }, lay: "dict", head: pick(R, HEAD[q.e] || HEAD.wind), ink: "#fff", tag: "#2a2a2a", chip: light, lower: true };
  } },
  // ——— Topic moods ———
  { id: "catDeadpan", fit: ["t:c", "t:i"], pals: 3, draw: (p, _R, q) => {
    const P = [["#4a5370", "#eef0f6"], ["#7a8a72", "#f4f6ee"], ["#6a4a62", "#f8eef4"]][p];
    return { svg: svg(`${bg(P[0])}${cat(345, 318, 0.82, {})}${grain(0.35)}`),
      tx: { left: "5.3cqw", top: "13cqw", width: "46%", font: `400 ${fz(q.q.length, 4.9)}/1.2 ${F.sans}` }, lower: true, ink: P[1], chip: light };
  } },
  { id: "partyCat", fit: ["t:c", "t:g"], pals: 2, draw: (p, _R, q) => {
    const P = [["#d8d3cc", "#4a2e1e"], ["#cfd6dc", "#2a2e3a"]][p];
    return { svg: svg(`${bg(P[0])}<path d="M0 230L450 170" stroke="#c0bab2" stroke-width="2"/>${cat(335, 300, 0.6, { fur: "#e6a45a", ear: "#f2c0a0", eye: "#6a7a3a", open: true, stripes: true, hat: "party" })}${grain(0.25)}`),
      tx: { left: "5.3cqw", top: "13cqw", width: "44%", font: `400 ${fz(q.q.length, 4.8)}/1.25 ${F.cond}` }, lower: true, ink: P[1], chip: dark(P[1]) };
  } },
  { id: "catHat", fit: ["t:i", "t:c"], pals: 2, draw: (p, _R, q) => {
    const P = [["#2f6ad8", "#6a9af0", "#f5c63a"], ["#3a8ab8", "#8ac6e6", "#ffd84a"]][p];
    return { svg: svg(`<defs>${lin("qch", [P[0], P[1]])}</defs>${bg("url(#qch)")}<path d="M0 300Q120 250 240 280T450 260V310H0z" fill="#5a6a3a" opacity=".6" filter="url(#qa-b6)"/>${cat(225, 345, 0.6, { shades: true, hat: "bucket" })}${grain(0.4)}`),
      tx: { ...CC, top: "24%", left: "17%", right: "17%", font: `500 ${fz(q.q.length, 5.4)}/1.2 ${F.sans}` }, lower: true, ink: P[2], chip: light };
  } },
  { id: "bathDuck", fit: ["t:g", "t:c", "water"], pals: 2, draw: (p, _R, q) => {
    const P = [["#c7ccd0", "#b6bcc1"], ["#d6ccc6", "#c2b6ae"]][p];
    return { svg: svg(`${bg(P[0])}<g stroke="${P[1]}" stroke-width="3" fill="none"><rect x="40" y="-20" width="150" height="190" rx="14"/><rect x="215" y="-20" width="150" height="190" rx="14"/><path d="M60 190h330"/></g>${duck(330, 232, 1.25)}<path d="M0 252q225-14 450 0v58H0z" fill="#fafaf8"/><path d="M0 252q225-14 450 0" stroke="#d8d8d2" stroke-width="2" fill="none"/>${grain(0.2)}`),
      tx: { ...CC, top: "36%", font: `400 ${fz(q.q.length, 5.4)}/1.25 ${F.cond}`, textShadow: "0 1px 8px rgba(40,50,60,.45)" }, lower: true, ink: "#fff", chip: dark("#2b2b2b") };
  } },
  { id: "duckShades", fit: ["t:c", "t:i", "sun"], pals: 2, draw: (p, _R, q) => {
    const P = [["#6f9ccc", "#b8d0e6"], ["#7aa6c8", "#e6eef4"]][p];
    return { svg: svg(`<defs>${lin("qds", [P[0], P[1]])}</defs>${bg("url(#qds)")}<g filter="url(#qa-b14)" fill="#fff" opacity=".6"><ellipse cx="380" cy="120" rx="60" ry="20"/></g>${duck(225, 262, 2.5, { shades: true })}${grain(0.3)}`),
      tx: { ...CC, top: "29%", left: "16%", right: "16%", font: `400 ${fz(q.q.length, 5.4)}/1.25 ${F.cond}` }, lower: true, ink: "#f4f8fc", chip: light };
  } },
  { id: "bunnyChill", fit: ["t:g", "t:c", "t:i"], pals: 2, draw: (p, _R, q) => {
    const P = [["#14100e", "#2a2018"], ["#10121a", "#24283a"]][p];
    return { svg: svg(`${bg(P[0])}<path d="M0 200q225-40 450 0v110H0z" fill="${P[1]}"/><circle cx="380" cy="60" r="40" fill="#f2c48a" opacity=".25" filter="url(#qa-b28)"/>${bunny(330, 236, 0.8)}${grain(0.55)}`),
      tx: { left: "5.3cqw", top: "13cqw", width: "44%", font: `400 ${fz(q.q.length, 4.6)}/1.25 ${F.sans}` }, lower: true, ink: "#f4f0ea", chip: light };
  } },
  { id: "stickerSky", fit: ["t:i", "t:c", "grass"], max: 64, pals: 2, draw: (p, _R, q) => {
    const P = [["#9cb9e6", "#e6edf5", "#4e74b8", "#3b66c4", "#2f55c4"], ["#e6b8a8", "#f6ebe2", "#c86a4a", "#c8603a", "#a8402a"]][p];
    const rings = [20, 40, 62, 88, 118, 150, 186].map(r => `<circle cx="230" cy="40" r="${r}"/>`).join("");
    return { svg: svg(`<defs>${lin("qss", [P[0], P[1]])}</defs>${bg("url(#qss)")}<rect y="216" width="450" height="94" fill="${P[2]}"/><g fill="none" stroke="${P[3]}" stroke-width="1.2" opacity=".55" filter="url(#qa-paint)">${rings}</g>
<path d="M0 310L0 275Q200 240 450 210V310z" fill="#5f8f3a"/><path d="M0 310L0 275Q200 240 450 210V310z" filter="url(#qa-tex)" opacity=".5"/><g fill="#2a2a3a"><ellipse cx="302" cy="236" rx="5" ry="8"/><ellipse cx="316" cy="234" rx="5" ry="8"/></g>
<g transform="translate(150 56) rotate(-4)"><path d="M6 4l170-4 4 30 10 2 2 60-8 2 2 26-178 6-4-40 6-2-6-44z" fill="#fbf4ea"/></g>${sparkle(326, 162, 9, P[4])}${grain(0.25)}`),
      tx: { left: "36%", top: "21%", width: "37%", transform: "rotate(-4deg)", font: `700 ${fz(q.q.length, 4.3)}/1.08 ${F.hand}`, textTransform: "uppercase" }, ink: P[4], chip: light };
  } },
  { id: "ammonite", fit: ["t:w", "petal", "sun"], pals: 3, draw: (p, _R, q) => {
    const P = [["#b8611f", "#e2b46a", "#f1d9a4", "#fbf0d6", "#4a2a10"], ["#8a4a3a", "#d8a08a", "#f2dcd0", "#fff4ee", "#3a1a12"], ["#4a6a7a", "#9ab8c6", "#dcebf0", "#f6fbfc", "#1a2e38"]][p];
    let w = "";
    const b = 0.18;
    for (let t = 1.5; t < 5.2 * Math.PI; t += 0.42) {
      const r1 = 6 * Math.exp(b * t), r0 = 6 * Math.exp(b * (t - 2 * Math.PI)), m = (r1 + r0) / 2, pt = (r: number, a: number) => `${(165 + r * Math.cos(a)).toFixed(1)} ${(170 + r * Math.sin(a)).toFixed(1)}`;
      w += `M${pt(r0, t)}Q${pt(m * 1.08, t + 0.18)} ${pt(r1, t)}`;
    }
    return { svg: svg(`<defs>${rad("qam", [[0, P[0]], [0.2, P[1]], [1, P[2]]], 0.38, 0.55)}</defs>${bg("url(#qam)")}<g fill="none" stroke="${P[3]}" opacity=".9"><path d="${spiral(165, 170, b, 2.6)}" stroke-width="4"/><path d="${w}" stroke-width="2.4"/></g>${grain(0.35)}`),
      tx: { right: "5.3cqw", bottom: "calc(3.6cqw + 50px)", width: "42%", textAlign: "right", font: `500 ${fz(q.q.length, 4.8)}/1.14 ${F.serif}` }, ink: P[4], chip: dark(P[4]) };
  } },
  { id: "auraGrain", fit: ["t:c", "t:i", "sun"], max: 48, pals: 3, draw: (p, _R, q) => {
    const P = [["#5a3f42", "#c9605a", "#f0d3c8", "#d8573f", "#b24fbf", "#f0c9f2"], ["#283a5a", "#4a8ad8", "#d8ecf6", "#f08a3a", "#6a4ad8", "#ffe0b8"], ["#2a3a2a", "#6ab86a", "#e6f6d8", "#f06a9a", "#3a8a8a", "#ffd0e6"]][p];
    return { svg: svg(`${bg(P[0])}<g filter="url(#qa-b28)"><ellipse cx="80" cy="200" rx="110" ry="140" fill="${P[1]}"/><ellipse cx="90" cy="190" rx="50" ry="70" fill="${P[2]}"/><ellipse cx="380" cy="90" rx="120" ry="110" fill="${P[3]}"/><ellipse cx="400" cy="70" rx="40" ry="50" fill="${P[2]}"/><ellipse cx="200" cy="300" rx="150" ry="60" fill="${P[4]}"/></g>${grain(0.9)}
${sparkle(70, 60, 10, P[5])}${sparkle(380, 240, 10, P[5])}${sparkle(330, 158, 7, P[5])}${sparkle(120, 266, 7, P[5])}`),
      tx: { ...CC, font: `800 ${fz(q.q.length, 8.4)}/.92 ${F.sans}`, letterSpacing: "-.04em" }, lower: true, ink: P[5], chip: light };
  } },
  { id: "curvedBlobs", fit: ["t:i", "sun", "petal", "ribbon"], max: 64, pals: 2, draw: (p, _R, q) => {
    const P = [["#f6c6b8", "#e8508a", "#3a3ab8", "#f0a050"], ["#d8e6f6", "#4ab8a8", "#3a3ab8", "#f2d24a"]][p];
    const blob = (x: number, y: number, rx: number, ry: number, rot: number) => `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse rx="${rx}" ry="${ry}" fill="url(#qcb)"/><ellipse rx="${rx * 0.7}" ry="${ry * 0.5}" cx="${rx * 0.15}" fill="${P[2]}" opacity=".45" filter="url(#qa-b14)"/></g>`;
    const t = esc(q.q.toLowerCase());
    return { svg: svg(`<defs>${lin("qcb", [P[1], P[3]], 1, 1)}<path id="qcp" d="M20 170Q225 -20 430 170"/></defs>${bg(P[0])}<g filter="url(#qa-b6)">${blob(380, 30, 110, 100, 0)}${blob(60, 240, 140, 60, -30)}</g>
<text text-anchor="middle" style="font:700 ${q.q.length > 40 ? 19 : 26}px Urbanist,sans-serif;fill:#fff"><textPath href="#qcp" startOffset="50%">${t}</textPath></text>${grain(0.5)}`),
      tx: {}, lay: "none", ink: "#fff", chip: light };
  } },
  { id: "buddhaHills", fit: ["t:w", "moss", "wind"], pals: 2, draw: (p, R, q) => {
    const P = [{ sky: ["#c6ccc6", "#dfe2dc"], h: [["#a8b49a", "#7a8a6a"], ["#6a8a3a", "#3a5a1a"], ["#5a7a2a", "#2a4a12"]], f: "#222624" }, { sky: ["#d6cfc6", "#ece6de"], h: [["#c4b49a", "#9a8a6a"], ["#a08a5a", "#6a5a2a"], ["#8a7442", "#4a3a12"]], f: "#2a221c" }][p];
    return { svg: svg(`<defs>${lin("qbh", P.sky)}</defs>${bg("url(#qbh)")}${hills(P.h, R, 0.35)}
<g fill="${P.f}"><ellipse cx="225" cy="196" rx="20" ry="24"/><path d="M190 230q35-20 70 0l30 90H160z"/><path d="M218 236l7-26 7 26z" fill="#4a4e4a"/></g>${grain(0.35)}`),
      tx: { left: "14%", right: "14%", top: "13cqw", textAlign: "center", font: `500 ${fz(q.q.length, 4.6)}/1.12 ${F.serif}`, textTransform: "uppercase", letterSpacing: ".04em" }, ink: P.f, chip: dark(P.f) };
  } },
];

/** Every picture: template + colour version. */
export const ARTS = T.flatMap(t => Array.from({ length: t.pals }, (_, p) => t.id + "." + p));

const fits = (t: Tpl, q: Quote) => (!t.max || q.q.length <= t.max) && (t.fit.includes(q.e) || t.fit.includes("t:" + q.t));

export function drawArt(key: string, q: Quote): Art {
  const [id, p] = key.split(".");
  const t = T.find(x => x.id == id) || T[0];
  return t.draw(Math.min(+p || 0, t.pals - 1), rng(hash(key)), q);
}

/**
 * The picture for the quote shown now. A new quote (new day or "Another") gets the next picture
 * this user hasn't seen that fits it; when all fitting pictures were seen, that set starts over.
 */
export function pickArt(q: Quote, token: string): string {
  const cur = S.set.qa as { t: string; v: string } | undefined;
  if (cur && cur.t == token && ARTS.includes(cur.v)) return cur.v;
  if (!S.set.qs) S.set.qs = Math.floor(Math.random() * 1e9);
  const seed = S.set.qs as number;
  const ok = T.filter(t => fits(t, q)).flatMap(t => Array.from({ length: t.pals }, (_, p) => t.id + "." + p));
  const list = (ok.length ? ok : ARTS).slice().sort((a, b) => hash(a + seed) - hash(b + seed));
  let used: string[] = Array.isArray(S.set.qu) ? S.set.qu : [];
  let v = list.find(k => !used.includes(k));
  if (!v) {
    used = used.filter(k => !list.includes(k));
    v = list.find(k => k != cur?.v) || list[0];
  }
  S.set.qu = [...used, v].slice(-400);
  S.set.qa = { t: token, v };
  save();
  return v;
}
