// Food logic: daily targets, body fat, food search, barcode reading, shopping list, recipes.
import { ALI, CATS, FD, FSRC, REC, Recipe, catOf, nz, stem } from "../data/foods";
import { S, ShopItem, commit } from "./store";
import { TODAY } from "./util";
import { ai } from "./ai";
import { t as tt } from "./i18n";
import { W } from "./units";

export const allRecipes = (): Recipe[] => REC.concat(S.rec);

/* ---------- recipe filters (Food › Recipes, the filter pop-up) ---------- */
/** [setting key, row label, options as [value, segment label, chip label]] */
export const RF: [string, string, [number, string, string][]][] = [
  ["rt", "Time, min", [[0, "Any", ""], [15, "≤15", "≤15 min"], [30, "≤30", "≤30 min"], [45, "≤45", "≤45 min"]]],
  ["rk", "Calories", [[0, "Any", ""], [450, "≤450", "≤450 kcal"], [600, "≤600", "≤600 kcal"], [750, "≤750", "≤750 kcal"]]],
  ["rp", "Protein, g", [[0, "Any", ""], [45, "45+", "45 g+ protein"], [50, "50+", "50 g+ protein"], [55, "55+", "55 g+ protein"]]],
  ["ri", "Ingredients", [[0, "Any", ""], [4, "≤4", "≤4 ingredients"], [6, "≤6", "≤6 ingredients"], [8, "≤8", "≤8 ingredients"]]],
];
/** Recipes that pass the saved filters, with their index in allRecipes(). */
export function recipesShown() {
  const st = S.set, mt = st.rt || 0, mk = st.rk || 0, mp = st.rp || 0, mi = st.ri || 0, fv = !!st.rf, rc = st.rc || "", fav = S.fav || [];
  return allRecipes()
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => (!mt || (r.m || 99) <= mt) && (!mk || r.k <= mk) && (!mp || r.p >= mp) && (!mi || r.ing.length <= mi) && (!fv || fav.includes(r.t)) && (!rc || catOf(r) == rc));
}
/** Active filters as removable chips: [label, clear]. */
export function rfChips(): [string, () => void][] {
  const st = S.set, out: [string, () => void][] = [];
  const clr = (k: string) => () => { S.set[k] = k == "rc" ? "" : 0; commit(); };
  if (st.rc) out.push([CATS.find(c => c[0] == st.rc)?.[1] || st.rc, clr("rc")]);
  RF.forEach(([k, , o]) => { const x = o.find(y => y[0] == (st[k] || 0)); if (x && x[0]) out.push([x[2], clr(k)]); });
  if (st.rf) out.push(["Favourites", clr("rf")]);
  return out;
}
export function rfReset() {
  S.set.rt = S.set.rk = S.set.rp = S.set.ri = S.set.rf = 0;
  S.set.rc = "";
  commit();
}

/* ---------- targets ---------- */
export function calc() {
  const p = S.prof;
  const bmr = 10 * p.w + 6.25 * p.h - 5 * p.a + (p.sex == "m" ? 5 : -161);
  const t = bmr * p.act, k = Math.round(t * (1 + p.g)), pr = Math.round(p.w * p.pk), f = Math.round((k * 0.25) / 9);
  return { bmr: Math.round(bmr), t: Math.round(t), k, p: pr, f, c: Math.max(0, Math.round((k - pr * 4 - f * 9) / 4)) };
}

/** Body fat % with the US Navy formula, or null when measurements are missing. */
export function navy() {
  const p = S.prof, h = p.h, n = p.neck, w = p.waist, hp = p.hip, log10 = Math.log10;
  if (!(h > 0 && n > 0 && w > 0)) return null;
  if (p.sex == "m") {
    if (w - n <= 0) return null;
    return 495 / (1.0324 - 0.19077 * log10(w - n) + 0.15456 * log10(h)) - 450;
  }
  if (!(hp > 0) || w + hp - n <= 0) return null;
  return 495 / (1.29579 - 0.35004 * log10(w + hp - n) + 0.221 * log10(h)) - 450;
}
export function bfCat(b: number) {
  const T: [number, string][] =
    S.prof.sex == "m"
      ? [[6, "Essential"], [14, "Athletic"], [18, "Fit"], [25, "Average"], [99, "Higher"]]
      : [[14, "Essential"], [21, "Athletic"], [25, "Fit"], [32, "Average"], [99, "Higher"]];
  return (T.find(x => b < x[0]) || T[4])[1];
}

export const AC: [number, string][] = [
  [1.4, "Sedentary (×1.4): little exercise"],
  [1.55, "Light (×1.55): 1 to 3 workouts a week"],
  [1.75, "Moderate (×1.75): 3 to 5 a week"],
  [1.95, "Very active (×1.95): 6 to 7 a week"],
  [2.2, "Extreme (×2.2): physical job or 2 a day"],
];

export const gPct = () => Math.round((S.prof.g || 0) * 1000) / 10;
export const gTxt = (t: number, g: number) => {
  const p = Math.round(g * 1000) / 10, kg = ((t * Math.abs(g) * 30) / 7700).toFixed(1);
  return p < 0 ? tt("Fat loss {p}%, about {w} a month", { p: Math.abs(p), w: W(+kg) }) : p > 0 ? tt("Muscle gain {p}%, about {w} a month", { p, w: W(+kg) }) : tt("Maintain weight (0%)");
};
export function gpInfo(v: number | string) {
  const c = calc(), pc = Math.max(-30, Math.min(25, +v || 0)), t = c.t, k = Math.round(t * (1 + pc / 100)), kg = (Math.abs((t * pc) / 100) * 30) / 7700;
  let m =
    pc < 0
      ? tt("Fat loss of about {m} a month ({w} a week).", { m: W(kg), w: W(kg / 4.3, 2) })
      : pc > 0
        ? tt("Weight gain of about {m} a month ({w} a week).", { m: W(kg), w: W(kg / 4.3, 2) })
        : tt("Weight stays about the same.");
  m += " " + tt("That is {k} kcal a day against {t} kcal to maintain.", { k, t });
  if (k < c.bmr) m += " " + tt("This is below your BMR ({b} kcal), which is not recommended.", { b: c.bmr });
  return m;
}

/* ---------- today's log ---------- */
export const todayLog = () => S.f.filter(x => x.d == TODAY());
export const eaten = (k: "k" | "p" | "c" | "f") => Math.round(todayLog().reduce((a, x) => a + (x[k] || 0), 0));

export function logRecipe(r: Recipe) {
  S.f.push({ d: TODAY(), n: r.t, k: r.k, p: r.p, c: r.c, f: r.f });
  commit();
}

/* ---------- food search (English, Russian and Bulgarian names) ---------- */
export interface Suggestion { n: string; k: number; p: number; c: number; f: number; h: string; key?: string; saved?: 1 }
export function searchFoods(q0: string): Suggestion[] {
  const q = nz(q0.trim());
  if (q.length < 2) return [];
  const T = q.split(/\s+/).map(stem);
  const saved = Object.values(S.foods).map(x => ({ ...x, saved: 1 as const, h: nz(x.n) }));
  const lib = FSRC.map(x => ({ ...FD[x.k], h: x.h, key: x.k }));
  return [...saved, ...lib]
    .filter(x => T.every(t => x.h.includes(t)))
    .sort((a, b) => (b.h.startsWith(T[0]) ? 1 : 0) - (a.h.startsWith(T[0]) ? 1 : 0))
    .slice(0, 8);
}
/** Local-language name to show next to a suggestion when the query is in Cyrillic. */
export function localName(x: Suggestion, q: string) {
  const a = ((x.key && ALI[x.key]) || "").split("|");
  return /[а-я]/.test(q) ? (a[/ъ/.test(q) ? 1 : 0] || "").split(" ").slice(0, 2).join(" ") : "";
}
export function searchIngredients(q0: string) {
  const q = nz(q0.trim());
  if (q.length < 2) return [];
  const T = q.split(/\s+/).map(stem);
  return FSRC.filter(x => T.every(t => x.h.includes(t))).slice(0, 6).map(x => x.k);
}

/* ---------- barcode ---------- */
export async function readBarcode(file: File): Promise<string | null> {
  try {
    if ("BarcodeDetector" in window) {
      const r = await new (window as any).BarcodeDetector().detect(await createImageBitmap(file));
      if (r[0]) return r[0].rawValue;
    }
  } catch {
    /* try the library below */
  }
  try {
    const { Html5Qrcode } = await import("html5-qrcode");
    let el = document.getElementById("qr-reader");
    if (!el) {
      el = document.createElement("div");
      el.id = "qr-reader";
      el.hidden = true;
      document.body.appendChild(el);
    }
    const h = new Html5Qrcode("qr-reader");
    const code = await h.scanFile(file, false);
    try {
      h.clear();
    } catch {
      /* ignore */
    }
    return code;
  } catch {
    return null;
  }
}

/* ---------- images ---------- */
/** Resize a photo so its longest side is at most `max` px; returns a JPEG data URL under ~185 KB. */
export function resizeImage(f: Blob, max: number, q0 = 0.72, limit = 185000) {
  return new Promise<string>((res, rej) => {
    const i = new Image();
    i.onload = () => {
      const s = Math.min(1, max / Math.max(i.width, i.height)), c = document.createElement("canvas");
      c.width = Math.round(i.width * s);
      c.height = Math.round(i.height * s);
      c.getContext("2d")!.drawImage(i, 0, 0, c.width, c.height);
      let q = q0, u = c.toDataURL("image/jpeg", q);
      while (u.length > limit && q > 0.3) {
        q -= 0.08;
        u = c.toDataURL("image/jpeg", q);
      }
      URL.revokeObjectURL(i.src);
      res(u);
    };
    i.onerror = rej;
    i.src = URL.createObjectURL(f);
  });
}
export function shrinkBlob(f: Blob) {
  return new Promise<Blob>(res => {
    const i = new Image();
    i.onload = () => {
      const s = Math.min(1, 1000 / Math.max(i.width, i.height)), c = document.createElement("canvas");
      c.width = i.width * s;
      c.height = i.height * s;
      c.getContext("2d")!.drawImage(i, 0, 0, c.width, c.height);
      c.toBlob(b => res(b!), "image/jpeg", 0.8);
    };
    i.src = URL.createObjectURL(f);
  });
}

/* ---------- shopping list ---------- */
const SU: Record<string, string> = { g: "g", kg: "kg", ml: "ml", l: "l", tbsp: "tbsp", tsp: "tsp", cup: "cup", cups: "cup", slice: "slice", slices: "slice", clove: "clove", cloves: "clove", pinch: "pinch", can: "can", cans: "can" };
const sing = (n: string) => {
  n = n.toLowerCase().trim();
  return n.length > 3 && /oes$/.test(n) ? n.slice(0, -2) : n.length > 3 && /ies$/.test(n) ? n.slice(0, -3) + "y" : n.length > 3 && /s$/.test(n) && !/ss$/.test(n) ? n.slice(0, -1) : n;
};
const plur = (n: string) => (/s$/.test(n) ? n : /[^aeiou]y$/.test(n) ? n.slice(0, -1) + "ies" : /o$/.test(n) ? n + "es" : n + "s");
function parseIng(t: string) {
  t = String(t).trim();
  const m = t.match(/^(\d+(?:[.,]\d+)?)\s*([A-Za-z]+)?\s*(.*)$/);
  if (!m) return { q: null, u: "", n: t, k: "|" + sing(t) };
  const q = +m[1].replace(",", ".");
  let u = m[2] || "", n = m[3] || "";
  const ul = u.toLowerCase();
  if (SU[ul]) u = SU[ul];
  else {
    n = (u + " " + n).trim();
    u = "";
  }
  n = n.replace(/^of\s+/i, "").trim();
  if (!n) n = t;
  return { q, u, n, k: u + "|" + sing(n) };
}
/** Older saves stored one row per recipe ingredient; merge them into combined items. */
export function shopMig() {
  S.shop = ((S.shop || []) as any[]).reduce((a: ShopItem[], x: any) => {
    if (x.parts) {
      a.push(x);
      return a;
    }
    const p = parseIng(x.t);
    let it = a.find(y => y.k == p.k && !y.done && !x.done);
    if (!it) {
      it = { k: p.k, n: p.n, u: p.u, done: !!x.done, parts: [] };
      a.push(it);
    }
    it.parts.push({ r: x.r, q: p.q, raw: x.t });
    return a;
  }, []);
}
export const inShop = (t: string) => (S.shop || []).some(x => (x.parts ? x.parts.some(p => p.r == t) : (x as any).r == t));
export function toShop(r: Recipe) {
  shopMig();
  if (inShop(r.t)) {
    S.shop.forEach(x => (x.parts = x.parts.filter(p => p.r != r.t)));
    S.shop = S.shop.filter(x => x.parts.length);
  } else
    r.ing.forEach(t => {
      const p = parseIng(t);
      let it = S.shop.find(x => x.k == p.k && !x.done);
      if (!it) {
        it = { k: p.k, n: p.n, u: p.u, done: false, parts: [] };
        S.shop.push(it);
      }
      it.parts.push({ r: r.t, q: p.q, raw: t });
    });
  commit();
}
const fq = (q: number) => String(Math.round(q * 10) / 10).replace(/\.0$/, "");
export function shopTxt(x: ShopItem) {
  const nums = x.parts.filter(p => p.q != null);
  if (!nums.length || nums.length < x.parts.length) return x.parts.length == 1 ? x.parts[0].raw : x.n;
  const q = nums.reduce((a, p) => a + p.q!, 0), n = !x.u && q > 1 && sing(x.n) == x.n.toLowerCase() ? plur(x.n) : x.n;
  return `${fq(q)}${x.u ? " " + x.u : ""} ${n}`;
}

export function favTog(r: Recipe) {
  const f = (S.fav || []).slice(), k = f.indexOf(r.t);
  k < 0 ? f.push(r.t) : f.splice(k, 1);
  S.fav = f;
  commit();
}

/* ---------- meal from a photo ---------- */
/** One ingredient of a meal: grams on the plate, nutrition per 100 g. */
export interface MealIng { n: string; g: number; k: number; p: number; c: number; f: number }
/** Ask the AI (when connected) to name the meal and list its ingredients with grams and nutrition per 100 g. */
export async function analyseMeal(file: Blob): Promise<{ n: string; items: MealIng[] }> {
  if (!ai) throw new Error("no ai");
  const r = await ai.json(
    'Look at this food photo. List each visible ingredient or component with an estimated weight in grams and its nutrition PER 100 g. Reply ONLY JSON: {"n":"short dish name","items":[{"n":"ingredient","g":grams,"k":kcal per 100g,"p":protein per 100g,"c":carbs per 100g,"f":fat per 100g}]} (numbers).',
    { images: [await shrinkBlob(file)] },
  );
  const it = Array.isArray(r?.items) ? r.items.filter((x: any) => x && x.n && +x.g > 0) : [];
  return {
    n: String(r?.n || "Meal").slice(0, 40),
    items: it.slice(0, 15).map((x: any) => ({ n: String(x.n).slice(0, 40), g: Math.round(+x.g), k: +x.k || 0, p: +x.p || 0, c: +x.c || 0, f: +x.f || 0 })),
  };
}
