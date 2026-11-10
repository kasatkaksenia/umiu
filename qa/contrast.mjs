// Text contrast check (WCAG): every visible text element vs. its composited background, per look.
// Usage: node qa/contrast.mjs [look …]   (needs the dev server). Lists texts under 4.5:1 (3:1 for large text).
import { launch, newPage, deviceOpts, URL, ROUTES } from "./lib.mjs";
const LOOKS = process.argv.slice(2).length ? process.argv.slice(2) : ["w", "gs", "dh", "px", "em", "np", "mi"];
const b = await launch();
const { page } = await newPage(b, deviceOpts("iPhone SE", { colorScheme: process.env.DARK ? "dark" : "light" }));
let total = 0;
for (const look of LOOKS) {
  await page.goto(URL + "#/train"); await page.waitForTimeout(400);
  await page.evaluate(l => { const s = JSON.parse(localStorage.getItem("bloom2")); s.set = s.set || {}; s.set.look = l; localStorage.setItem("bloom2", JSON.stringify(s)); }, look);
  const bad = new Map();
  for (const r of ROUTES) {
    await page.goto(URL + "#/" + r); await page.reload(); await page.waitForTimeout(900);
    const found = await page.evaluate(() => {
      const P = c => { const m = c.match(/[\d.]+/g); if (!m) return [0, 0, 0, 0]; const k = c.startsWith("color(") ? 255 : 1; return [m[0] * k, m[1] * k, m[2] * k, m[3] == null ? 1 : +m[3]]; };
      const L = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
      const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
      const bgOf = el => { const st = []; let e = el, img = false; while (e && e.nodeType == 1) { const s = getComputedStyle(e); if (s.backgroundImage != "none" && !e.matches(".up,.uc,ion-content,body,html")) img = true; const c = P(s.backgroundColor); if (c[3] > 0) st.push(c); if (c[3] >= 1) break; e = e.parentElement; }
        let bg = P(getComputedStyle(document.body).backgroundColor); if (bg[3] < 1) bg = [255, 255, 255, 1]; for (let i = st.length - 1; i >= 0; i--) bg = over(st[i], bg); return { bg, img }; };
      const pg = [...document.querySelectorAll(".ion-page.up")].find(e => !e.classList.contains("ion-page-hidden"));
      const out = [];
      pg.querySelectorAll("main *").forEach(el => {
        if (![...el.childNodes].some(n => n.nodeType == 3 && n.textContent.trim())) return;
        if (el.closest(".qa,.hero,svg,[aria-hidden=true]")) return;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
        const s = getComputedStyle(el); if (s.visibility == "hidden") return;
        let op = 1; for (let e = el; e && e.nodeType == 1; e = e.parentElement) op *= +getComputedStyle(e).opacity;
        const { bg, img } = bgOf(el); if (img) return;
        let fg = P(s.color); fg = over([fg[0], fg[1], fg[2], fg[3] * op], bg);
        const a = L(fg), c = L(bg), ratio = (Math.max(a, c) + .05) / (Math.min(a, c) + .05);
        const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.6 && +s.fontWeight >= 700);
        if (ratio < (big ? 3 : 4.5)) out.push(`${ratio.toFixed(2)} ${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} "${el.textContent.trim().slice(0, 30)}"`);
      });
      return out;
    });
    found.forEach(f => { const k = f.replace(/^[\d.]+ /, ""); if (!bad.has(k)) bad.set(k, f.split(" ")[0] + " @" + r); });
  }
  total += bad.size;
  console.log(`\n${look}: ${bad.size} low-contrast texts`); [...bad].slice(0, 14).forEach(([k, v]) => console.log("  " + v + " " + k));
}
console.log("\ntotal", total);
await b.close();
