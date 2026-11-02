// Shared helpers for the QA scripts. They drive your installed Google Chrome (no browser download).
import { chromium, devices } from "playwright-core";

export const URL = process.env.QA_URL || "http://localhost:5173/umiu/";
export const OUT = process.env.QA_OUT || new globalThis.URL("./out/", import.meta.url).pathname;
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export const PHONES = ["iPhone SE", "iPhone 15", "iPhone 15 Pro Max"];
export const ROUTES = ["train", "train/ex/mht", "train/plan", "food/log", "food/targets", "food/recipes", "food/shopping", "cycle"];

const day = n => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
/** Sample data so every widget has something to show. Only used when the browser has no saved data. */
export const SEED = {
  cyc: { start: day(9), len: 28, per: 5 },
  per: [{ s: day(9), e: day(5) }],
  hist: [{ d: day(20), n: "Lower Body A", it: [{ id: "mht", s: [{ w: 60, r: 10 }, { w: 60, r: 9 }] }] }],
  f: [{ d: day(0), n: "Greek yogurt bowl", k: 380, p: 48, c: 33, f: 10 }],
  symx: ["Sugar cravings"],
};

export const launch = () => chromium.launch({ executablePath: CHROME, headless: process.env.HEADED ? false : true });

/** Context options for a Playwright device name, or a desktop size. Chrome can't pretend to be Safari, so the iOS user agent is dropped. */
export function deviceOpts(name, extra = {}) {
  if (name == "desktop") return { viewport: { width: 1366, height: 900 }, ...extra };
  const { defaultBrowserType, userAgent, ...o } = devices[name];
  return { ...o, ...extra };
}

export async function newPage(browser, opts, { seed = true } = {}) {
  const ctx = await browser.newContext(opts);
  if (seed) await ctx.addInitScript(s => { if (!localStorage.getItem("bloom2")) localStorage.setItem("bloom2", s); }, JSON.stringify(SEED));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("page error: " + e.message));
  page.on("console", m => m.type() == "error" && errors.push("console: " + m.text()));
  return { ctx, page, errors };
}

/** Selector scoped to the visible screen (Ionic keeps earlier screens in the DOM, hidden) or the open sheet. */
export const active = sel => `.ion-page.up:not(.ion-page-hidden) ${sel}, .ov ${sel}`;

/** Which screens exist and which are visible. Exactly one should start with "+". */
export const screens = page => page.evaluate(() =>
  [...document.querySelectorAll(".ion-page.up")].map(e => (e.classList.contains("ion-page-hidden") ? "-" : "+") + (e.querySelector("h1")?.innerText.split("\n")[0] || "?")));
