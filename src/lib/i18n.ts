// Interface language: English (default) or Ukrainian (Russian removed for now). Content (exercises, recipes, tips, quotes)
// stays English for now. Text is looked up by its English wording in src/i18n/dict.ts.
// JSX text and placeholder / aria-label / title / alt are translated automatically by the custom JSX
// runtime (src/i18n/jsx-runtime.ts); strings built in code (alerts, advice) use t().
import { D } from "../i18n/dict";

export type Lang = "en" | "uk";
export const LANGS: [Lang, string][] = [["en", "English"], ["uk", "Українська"]];

/** Read once at start-up (changing the language reloads the app). */
export const LANG: Lang = (() => {
  try {
    const l = JSON.parse(localStorage.getItem("bloom2") || "{}")?.set?.lang;
    return l == "uk" ? l : "en";
  } catch {
    return "en";
  }
})();

/** Translate one piece of text, keeping its leading and trailing spaces. */
export function tr(s: string): string {
  if (LANG == "en" || !s) return s;
  const core = s.trim();
  const v = D[core];
  if (!v) return s;
  return s.slice(0, s.indexOf(core)) + v + s.slice(s.indexOf(core) + core.length);
}
/** Translate a template and fill in {name} placeholders: t("Keep {w}", { w: "60 kg" }). */
export function t(s: string, vars?: Record<string, string | number>) {
  let o = tr(s);
  if (vars) for (const k in vars) o = o.split("{" + k + "}").join(String(vars[k]));
  return o;
}

const ATTR = ["placeholder", "aria-label", "title", "alt"];
/** Used by the JSX runtime for DOM elements. */
export function fixProps(type: string, props: any) {
  if (LANG == "en" || !props) return props;
  let p = props;
  const set = (k: string, v: any) => {
    if (p === props) p = { ...props };
    p[k] = v;
  };
  for (const a of ATTR) if (typeof props[a] == "string") {
    const v = tr(props[a]);
    if (v !== props[a]) set(a, v);
  }
  const c = props.children;
  if (typeof c == "string") {
    const v = tr(c);
    if (v !== c) {
      // An <option> without a value keeps its English text as the value, so <select> values still match.
      if (type == "option" && props.value === undefined) set("value", c);
      set("children", v);
    }
  } else if (Array.isArray(c)) {
    // Arrays can be nested (children passed through components), so walk them.
    let hit = false;
    const walk = (a: any[]): any[] => a.map(x => {
      if (typeof x == "string") {
        const v = tr(x);
        if (v !== x) hit = true;
        return v;
      }
      return Array.isArray(x) ? walk(x) : x;
    });
    const n = walk(c);
    if (hit) set("children", n);
  }
  return p;
}

/** Plural nouns: English [one, many]; Ukrainian [one, few, many]. */
const PL: Record<string, [[string, string], [string, string, string]]> = {
  day: [["day", "days"], ["день", "дні", "днів"]],
  week: [["week", "weeks"], ["тиждень", "тижні", "тижнів"]],
  period: [["period", "periods"], ["період", "періоди", "періодів"]],
  item: [["item", "items"], ["штука", "штуки", "штук"]],
  workout: [["workout", "workouts"], ["тренька", "треньки", "треньок"]],
  exercise: [["exercise", "exercises"], ["вправа", "вправи", "вправ"]],
  recipe: [["recipe", "recipes"], ["рецептик", "рецептики", "рецептиків"]],
  quote: [["quote", "quotes"], ["цитатка", "цитатки", "цитаток"]],
  tip: [["tip", "tips"], ["лайфхак", "лайфхаки", "лайфхаків"]],
  set: [["set", "sets"], ["сет", "сети", "сетів"]],
  ingredient: [["ingredient", "ingredients"], ["інгредієнт", "інгредієнти", "інгредієнтів"]],
};
/** "7 days" / "7 днів". */
export function pn(n: number, w: string) {
  const f = PL[w];
  if (!f) return n + " " + w;
  if (LANG == "en") return n + " " + f[0][n == 1 ? 0 : 1];
  const a = Math.abs(n) % 100, b = a % 10;
  const i = a > 10 && a < 20 ? 2 : b == 1 ? 0 : b >= 2 && b <= 4 ? 1 : 2;
  return n + " " + f[1][Number.isInteger(n) ? i : 1];
}
