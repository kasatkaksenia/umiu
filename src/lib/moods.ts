// Mood icons, from "awful" (0) to "great" (4). 100×100 SVG markup coloured from the current look.
// Two sets: Clay glyphs (a little figure on a tinted tile) for the crisp, light looks,
// Squishy pebbles (a blob with a face) for the glowy, dark ones.
import { S } from "./store";

export const MOODS: { n: string }[] = [{ n: "Awful" }, { n: "Low" }, { n: "Okay" }, { n: "Good" }, { n: "Great" }];

/** Looks that use Clay glyphs; every other look uses Squishy pebbles. */
const CLAY = new Set(["w", "dh", "px", "mi"]);

// Five-step colour ramp from the look: cool for Awful, warm for Great.
const C = ["var(--h2)", "color-mix(in srgb, var(--h2) 50%, var(--h1))", "var(--ol)", "var(--cr)", "var(--h1)"];
const ink = (c: string) => `color-mix(in srgb, ${c} 72%, var(--tx))`;
const tile = (c: string) => `color-mix(in srgb, ${c} 22%, var(--solid))`;
const bg = (fill: string) => `<rect width="100" height="100" rx="26" style="fill:${fill}"/>`;

function clay(m: number) {
  const c = C[m], k = ink(c), st = (w: number) => `style="stroke:${k}" stroke-width="${w}" fill="none" stroke-linecap="round"`;
  if (m == 0) return bg(tile(c)) + `<circle cx="30" cy="66" r="9" style="fill:${k}"/><path d="M42 74 C50 56 82 58 84 78" ${st(12)}/><path d="M14 88 H86" ${st(6)} opacity=".35"/>`;
  if (m == 1) return bg(tile(c)) + `<circle cx="50" cy="28" r="9" style="fill:${k}"/><path d="M24 72 Q50 44 76 72" ${st(11)}/><path d="M32 92 C32 72 68 72 68 92" ${st(12)}/>`;
  const a = [0, 0, 46, 32, 16][m], b = [0, 0, 52, 60, 64][m], hy = [0, 0, 32, 30, 30][m];
  const arms = m == 2 ? `<path d="M22 52 H78" ${st(11)}/>` : `<path d="M20 ${a} Q50 ${b + 18} 80 ${a}" ${st(11)}/>`;
  return bg(tile(c)) + `<circle cx="50" cy="${hy}" r="9" style="fill:${k}"/>${arms}<path d="M32 90 C32 70 68 70 68 90" ${st(12)}/>`;
}

function pebble(m: number) {
  const c = C[m], f = `color-mix(in srgb, ${c} 30%, #1a1014)`;
  const w = [38, 34, 30, 28, 26][m], h = [18, 24, 28, 32, 36][m], cy = [70, 64, 58, 56, 52][m], ey = cy - h * 0.25;
  const blob = `<path d="M${50 - w} ${cy + h * 0.6} C${50 - w} ${cy - h} ${50 - w * 0.4} ${cy - h * 1.15} 50 ${cy - h * 1.1} C${50 + w * 0.5} ${cy - h * 1.15} ${50 + w} ${cy - h} ${50 + w} ${cy + h * 0.5} C${50 + w} ${cy + h * 1.05} ${50 - w} ${cy + h * 1.05} ${50 - w} ${cy + h * 0.6}Z" style="fill:${c}"/>`;
  const L = `style="stroke:${f}" fill="none" stroke-linecap="round"`;
  const eyes = [
    `<path d="M37 ${ey} q5 3 10 0 M53 ${ey} q5 3 10 0" ${L} stroke-width="2.4"/>`,
    `<circle cx="42" cy="${ey}" r="6" fill="#fff"/><circle cx="58" cy="${ey}" r="6" fill="#fff"/><path d="M36 ${ey - 1} h12 M52 ${ey - 1} h12" style="stroke:${c}" stroke-width="6"/><circle cx="42" cy="${ey + 2}" r="2.2" style="fill:${f}"/><circle cx="58" cy="${ey + 2}" r="2.2" style="fill:${f}"/>`,
    `<circle cx="42" cy="${ey}" r="6.5" fill="#fff"/><circle cx="58" cy="${ey}" r="6.5" fill="#fff"/><circle cx="42" cy="${ey}" r="2.6" style="fill:${f}"/><circle cx="58" cy="${ey}" r="2.6" style="fill:${f}"/>`,
    `<circle cx="41" cy="${ey}" r="8" fill="#fff"/><circle cx="59" cy="${ey}" r="8" fill="#fff"/><circle cx="43" cy="${ey - 1}" r="3" style="fill:${f}"/><circle cx="61" cy="${ey - 1}" r="3" style="fill:${f}"/>`,
    `<circle cx="41" cy="${ey}" r="9" fill="#fff"/><circle cx="59" cy="${ey}" r="9" fill="#fff"/><circle cx="41" cy="${ey - 2}" r="3.4" style="fill:${f}"/><circle cx="59" cy="${ey - 2}" r="3.4" style="fill:${f}"/>`,
  ][m];
  const mouth = [
    `<path d="M45 ${ey + 11} q5 -3 10 0" ${L} stroke-width="2"/>`,
    `<circle cx="50" cy="${ey + 11}" r="1.6" style="fill:${f}"/>`,
    `<path d="M46 ${ey + 11} h8" ${L} stroke-width="2"/>`,
    `<path d="M45 ${ey + 12} q5 4 10 0" ${L} stroke-width="2"/>`,
    `<ellipse cx="50" cy="${ey + 14}" rx="4" ry="3.4" style="fill:${f}"/>`,
  ][m];
  const cheeks = m >= 3 ? `<ellipse cx="33" cy="${ey + 9}" rx="5" ry="3" fill="#ff8fa3" opacity=".55"/><ellipse cx="67" cy="${ey + 9}" rx="5" ry="3" fill="#ff8fa3" opacity=".55"/>` : "";
  const fx = m == 4 ? `<path d="M18 30 l6 4 M14 44 h7 M82 30 l-6 4 M86 44 h-7" style="stroke:${c}" stroke-width="2.6" stroke-linecap="round"/>`
    : m == 0 ? `<path d="M30 ${cy + h + 6} h40" style="stroke:${c}" opacity=".5" stroke-width="3" stroke-linecap="round"/>` : "";
  return blob + cheeks + eyes + mouth + fx;
}

/** True when the current look uses Clay glyphs (the icon is its own tile). */
// Same looks as LOOKS in Sheets.tsx; anything else (unset or removed) is the default, Clean white.
const KNOWN = ["w", "gs", "dh", "px", "em", "np", "mi"];
export const isClay = () => CLAY.has(KNOWN.includes(S.set.look) ? S.set.look : "w");

/** SVG markup (viewBox 0 0 100 100) for mood i in the current look. */
export const moodSvg = (i: number) => (isClay() ? clay(i) : pebble(i));
