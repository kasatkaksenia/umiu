// Mood emojis: a small fluffy character, from "awful" (0) to "great" (4). 32×32 SVG markup.

/** Scalloped, cloud-like outline around (cx, cy). */
function fluff(cx: number, cy: number, r: number, n = 13) {
  const pt = (a: number, rr: number) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  let d = "M" + pt(0, r);
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI;
    d += ` Q${pt((a0 + a1) / 2, r * 1.2)} ${pt(a1, r)}`;
  }
  return d + "Z";
}

const BODY = fluff(16, 17.5, 11);
const INK = "#3b2a26";
const ln = (d: string, w = 1.6) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const dot = (x: number, y: number, r = 1.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
const cheeks = '<circle cx="9.6" cy="21" r="1.9" fill="#ff8fa3" opacity=".55"/><circle cx="22.4" cy="21" r="1.9" fill="#ff8fa3" opacity=".55"/>';
const ears = (c: string) => `<circle cx="9" cy="7.5" r="3.2" fill="${c}"/><circle cx="23" cy="7.5" r="3.2" fill="${c}"/>`;
const body = (c: string) => ears(c) + `<path d="${BODY}" fill="${c}"/><ellipse cx="13" cy="12.5" rx="4" ry="2" fill="#fff" opacity=".35"/>`;

export const MOODS: { n: string; svg: string }[] = [
  { n: "Awful", svg: body("#a9bde0") + ln("M10.5 15.8l3-1.4M21.5 15.8l-3-1.4") + dot(12.5, 18) + dot(19.5, 18) + ln("M13 24q3-2.8 6 0") + '<path d="M11.4 20.2q-1.2 1.8 0 2.6 1.2-.8 0-2.6z" fill="#5f9ae8"/>' },
  { n: "Low", svg: body("#cdbbe8") + ln("M11 18h3M18 18h3") + ln("M13.5 23.4q2.5-1.6 5 0") },
  { n: "Okay", svg: body("#eedfbf") + dot(12.5, 17.6) + dot(19.5, 17.6) + ln("M13.5 22.6h5") },
  { n: "Good", svg: body("#f9c9a6") + dot(12.5, 17.4) + dot(19.5, 17.4) + cheeks + ln("M13 21.6q3 3 6 0") },
  { n: "Great", svg: body("#ffb6c9") + ln("M11 18q1.5-2.2 3 0M18 18q1.5-2.2 3 0") + cheeks + `<path d="M12.6 21.2h6.8q-.4 4.2-3.4 4.2t-3.4-4.2z" fill="${INK}"/><path d="M14.6 24.4q1.4-1 2.8 0q-1.4.9-2.8 0z" fill="#ff7a93"/>` + '<path d="M27 4.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="#ffc94d"/>' },
];
