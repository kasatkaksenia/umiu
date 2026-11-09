// Screenshots of every screen on iPhones and desktop, plus a horizontal-overflow check.
// Usage: node qa/shots.mjs [routes,comma,separated] [devices,comma,separated]
//   devices: Playwright names ("iPhone SE", "iPad Mini") or "desktop". Add "dark" via QA_DARK=1.
import { mkdirSync } from "node:fs";
import { URL, OUT, PHONES, ROUTES, launch, deviceOpts, newPage } from "./lib.mjs";

const routes = process.argv[2] ? process.argv[2].split(",") : ROUTES;
const devs = process.argv[3] ? process.argv[3].split(",") : [...PHONES, "desktop"];
mkdirSync(OUT, { recursive: true });
const b = await launch();
let problems = 0;
for (const dn of devs) {
  const { page, errors, ctx } = await newPage(b, deviceOpts(dn, process.env.QA_DARK ? { colorScheme: "dark" } : {}));
  const tag = dn.replace(/\W+/g, "") + (process.env.QA_DARK ? "-dark" : "");
  for (const r of routes) {
    await page.goto(URL + "#/" + r);
    await page.waitForTimeout(1300);
    const name = `${tag}-${r.replace(/\//g, "_")}`;
    await page.screenshot({ path: `${OUT}/${name}.png` });
    // Anything sticking out past the screen edge (sideways scroll on a phone). Clipped decorations are ignored.
    const wide = await page.evaluate(() => {
      const pg = [...document.querySelectorAll(".ion-page.up")].find(e => !e.classList.contains("ion-page-hidden"));
      const W = document.documentElement.clientWidth, bad = [];
      pg?.querySelectorAll("main *").forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.width && (r.right > W + 1 || r.left < -1) && !e.closest(".hs,.tb,.hero,.qc,.tabs,.pstrip,.exs")) bad.push(String(e.className || e.tagName));
      });
      return bad.slice(0, 5);
    });
    if (wide.length) { problems++; console.log(`OVERFLOW ${name}: ${wide.join(", ")}`); }
    // Full-length capture: grow the window to the page height.
    const h = await page.evaluate(() => {
      const pg = [...document.querySelectorAll(".ion-page.up")].find(e => !e.classList.contains("ion-page-hidden"));
      return Math.ceil(pg.querySelector("main").scrollHeight) + 40;
    });
    const vp = page.viewportSize();
    await page.setViewportSize({ width: vp.width, height: Math.min(Math.max(h, vp.height), 8000) });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${name}-full.png` });
    await page.setViewportSize(vp);
  }
  if (errors.length) { problems += errors.length; console.log(`[${dn}]\n` + errors.join("\n")); }
  await ctx.close();
}
await b.close();
console.log(`\nScreenshots in ${OUT}` + (problems ? `\n${problems} problems found` : "\nno overflow or console errors"));
process.exit(problems ? 1 : 0);
