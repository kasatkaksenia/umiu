// Training logic: workout library, the current draft, logging sets, progression advice, swaps.
import { CD, EQ, EQN, EX, FM, MN, PL, SPL } from "../data/exercises";
import { S, UI, Draft, SetRow, render, save, commit, LoggedSet } from "./store";
import { TODAY, dsince } from "./util";
import { ai } from "./ai";

export const muscles = (list: string) => list.split(",").filter(Boolean).map(m => MN[m]).join(", ");

/* ---------- workout library ---------- */
export const libOf = (k: string) => S.lib?.find(x => x.k == k);
export const nameOf = (k: string) => (libOf(k) || { n: k }).n;

export function ensureLib() {
  if (!S.lib || !S.lib.length) S.lib = Object.keys(PL).map(k => ({ k, n: k, ids: ((S.tpl && S.tpl[k]) || PL[k]).slice() }));
}
/** Workouts of the chosen split, as many as the plan's workouts per week (at most the split's full rotation). */
export const planKeys = () => {
  const q = SPL[S.plan.split].seq;
  return q.slice(0, Math.max(1, Math.min(S.plan.days || q.length, q.length)));
};
/** Workouts the owner made (New workout, generated); they always stay in the list. */
export const isCustom = (k: string) => /^[ua]\d/.test(k);
const seq = () => {
  ensureLib();
  let q = planKeys().filter(libOf);
  if (!q.length) q = S.lib!.map(x => x.k);
  if (!q.length) {
    S.lib!.push({ k: "u" + Date.now(), n: "New workout", ids: [] });
    q = [S.lib![0].k];
  }
  return q;
};
export const curName = () => {
  const q = seq();
  return q[S.plan.i % q.length];
};
export function mkDraft(k: string) {
  ensureLib();
  const L = libOf(k);
  S.draft = { n: k, ids: L ? L.ids.slice() : [], sets: {} };
}
/** The workout being prepared right now. */
export const dr = (): Draft => {
  ensureLib();
  if (!S.draft || !libOf(S.draft.n)) mkDraft(curName());
  return S.draft!;
};
/** Save the draft's exercise list back into its library workout. */
const pers = () => {
  const L = libOf(dr().n);
  if (L) L.ids = dr().ids.slice();
  save();
};

/* ---------- equipment filter ---------- */
export const eqOk = (k: string) => {
  const e = Array.isArray(S.eq) ? S.eq : [];
  return !e.length || !EQ[k] || e.includes(EQ[k]);
};
export const eqLbl = (k: string) => (EQ[k] && EQN[EQ[k]] ? " · " + EQN[EQ[k]] : "");
export function eqTog(k: string) {
  const e = Array.isArray(S.eq) ? S.eq.slice() : [];
  const i = e.indexOf(k);
  i < 0 ? e.push(k) : e.splice(i, 1);
  S.eq = e;
  commit();
}
export function eqClr() {
  S.eq = [];
  commit();
}

/* ---------- history helpers ---------- */
export const lastOf = (id: string) => {
  for (let i = S.hist.length - 1; i >= 0; i--) {
    const x = S.hist[i].it.find(y => y.id == id);
    if (x) return x;
  }
};
const lastE = (id: string) => {
  for (let i = S.hist.length - 1; i >= 0; i--) {
    const x = S.hist[i].it.find(y => y.id == id);
    if (x) return { x, d: S.hist[i].d };
  }
};
/** Workouts logged since Monday. */
export const wkDone = () => {
  const d = new Date(TODAY());
  const m = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 864e5).toISOString().slice(0, 10);
  return S.hist.filter(x => x.d >= m).length;
};
export const vol = (w: { it: { id: string; s: LoggedSet[] }[] }) =>
  Math.round(w.it.reduce((a, x) => a + (CD[x.id] ? 0 : x.s.reduce((b, s) => b + s.w * s.r, 0)), 0));
export const setTxt = (id: string, s: LoggedSet) =>
  CD[id]
    ? `${s.r} min · ${s.w} ${(CD[id][1] || [])[1] && /level/.test(CD[id][1][1]) ? "level" : "km/h"}${CD[id].length > 2 ? " · " + (s.i || 0) + "% incline" : ""}`
    : `${s.w} kg × ${s.r}`;

/* ---------- sets of the draft ---------- */
export function rowsOf(id: string): SetRow[] {
  const D = dr();
  if (!D.sets[id]) {
    const l = lastOf(id), n = CD[id] ? 1 : 3;
    D.sets[id] = Array.from({ length: n }, (_, j) => {
      const p = l ? l.s[j] || l.s[l.s.length - 1] : null;
      return { r: p ? p.r : "", w: p ? p.w : "", i: p && p.i != null ? p.i : "", d: false };
    });
  }
  return D.sets[id];
}
/** Clean a typed value. Reps are whole numbers; weight, time and speed allow one decimal point. */
export function cleanNum(id: string, k: string, v: string) {
  v = v.replace(",", ".");
  const dec = k != "r" || !!CD[id];
  return dec ? v.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1") : v.replace(/\D/g, "");
}
export function setVal(id: string, j: number, k: "r" | "w" | "i", v: string) {
  rowsOf(id)[j][k] = v === "" ? "" : +v;
  commit();
}
export function setDone(id: string, j: number, on: boolean) {
  rowsOf(id)[j].d = on;
  commit();
}
export function rowOp(id: string, d: number) {
  const R = rowsOf(id);
  if (d > 0) {
    // A new set starts empty (no copied weight or reps).
    R.push({ r: "", w: "", i: "", d: false });
  } else if (R.length > 1) R.pop();
  commit();
}

/* ---------- editing the draft ---------- */
export function rmEx(id: string) {
  const D = dr();
  D.ids = D.ids.filter(x => x != id);
  delete D.sets[id];
  UI.menu = null;
  pers();
  render();
}
export function swapTo(o: string, n: string) {
  const D = dr();
  D.ids[D.ids.indexOf(o)] = n;
  delete D.sets[o];
  UI.sheet = null;
  pers();
  render();
}
export function addEx(n: string | string[]) {
  const D = dr();
  ([] as string[]).concat(n).forEach(x => !D.ids.includes(x) && D.ids.push(x));
  UI.sheet = null;
  pers();
  render();
}
export function chWk(n: string) {
  mkDraft(n);
  UI.sheet = null;
  UI.msg = "";
  commit();
}
export function newWk() {
  ensureLib();
  const k = "u" + Date.now(), prev = S.draft ? JSON.stringify(S.draft) : null;
  S.lib!.push({ k, n: "New workout", ids: [] });
  mkDraft(k);
  ewNew = { k, prev };
  ewLast = null;
  UI.sheet = { t: "ew", k };
  commit();
}
export function delWk(k: string) {
  S.lib = S.lib!.filter(x => x.k != k);
  if (S.draft && S.draft.n == k) S.draft = null;
  UI.sheet = { t: "wk" };
  commit();
}

/** Log the ticked sets. Returns false (and sets a message) when nothing is ticked. */
export function fin() {
  const D = dr();
  const it = D.ids
    .map(id => ({
      id,
      s: rowsOf(id)
        .filter(x => x.d && +x.r > 0)
        .map(x => (CD[id] ? { w: +x.w || 0, r: +x.r, i: +(x.i || 0) || 0 } : { w: +x.w || 0, r: +x.r })),
    }))
    .filter(x => x.s.length);
  if (!it.length) {
    UI.msg = "Tick at least one completed set (with reps) first.";
    render();
    return false;
  }
  S.hist.push({ d: TODAY(), n: nameOf(D.n), it });
  if (D.n == curName()) S.plan.i++;
  S.set.hm = TODAY().slice(0, 7);
  S.set.tv = "h";
  S.draft = null;
  UI.msg = "";
  commit();
  return true;
}

/* ---------- library editor (the "Edit workout" sheet) ---------- */
function ewSync(k: string) {
  const L = libOf(k)!;
  if (S.draft && S.draft.n == k) {
    const D = S.draft;
    Object.keys(D.sets).forEach(i => {
      if (!L.ids.includes(i)) delete D.sets[i];
    });
    D.ids = L.ids.slice();
  }
  save();
}
/* ---------- edit workout: every change saves at once and can be undone for a few seconds ---------- */
type EwState = { k: string; n: string; ids: string[]; draft: string | null };
const ewState = (k: string): EwState => {
  const L = libOf(k)!;
  return { k, n: L.n, ids: L.ids.slice(), draft: S.draft && S.draft.n == k ? JSON.stringify(S.draft) : null };
};
/** A workout just made with "+ New workout": if it is left empty and unnamed it is removed again. */
let ewNew: { k: string; prev: string | null } | null = null;
/** The state before the last change, for Undo. */
let ewLast: (EwState & { msg: string; at: number }) | null = null;
export const UNDO_MS = 5000;
const ewMark = (k: string, msg: string) => void (ewLast = { ...ewState(k), msg, at: Date.now() });
/** The undo message to show for workout k, or "" when it has expired. */
export const ewUndoMsg = (k: string) => (ewLast && ewLast.k == k && Date.now() - ewLast.at < UNDO_MS ? ewLast.msg : "");
export function ewUndo() {
  const s = ewLast;
  ewLast = null;
  const L = s && libOf(s.k);
  if (!s || !L) return;
  L.n = s.n;
  L.ids = s.ids;
  if (s.draft) S.draft = JSON.parse(s.draft);
  else ewSync(s.k);
  commit();
}
/** Leaving the editor. A new workout that is still empty and unnamed is dropped, and the previous one comes back. */
export function ewLeave(k: string) {
  ewLast = null;
  const L = libOf(k);
  if (ewNew && ewNew.k == k && L && !L.ids.length && L.n == "New workout") {
    S.lib = S.lib!.filter(x => x.k != k);
    S.draft = ewNew.prev ? JSON.parse(ewNew.prev) : null;
    save();
  }
  ewNew = null;
}
/** Rename from the editor (with Undo). */
export function ewRename(k: string, v: string) {
  v = v.trim().slice(0, 32);
  const L = libOf(k);
  if (!L || !v || v == L.n) return;
  ewMark(k, "Renamed");
  ewName(k, v);
}
export function ewName(k: string, v: string) {
  v = v.trim().slice(0, 32);
  if (v) libOf(k)!.n = v;
  commit();
}
export function ewRm(k: string, id: string) {
  const L = libOf(k)!;
  ewMark(k, `Removed ${EX[id][0]}`);
  L.ids = L.ids.filter(x => x != id);
  ewSync(k);
  render();
}
export function ewDo(k: string, m: "swap" | "add", o: string, n: string | string[]) {
  const L = libOf(k)!, c = ([] as string[]).concat(n).length;
  ewMark(k, m == "swap" ? `Swapped for ${EX[n as string][0]}` : `Added ${c} exercise${c > 1 ? "s" : ""}`);
  if (m == "swap") L.ids[L.ids.indexOf(o)] = n as string;
  else ([] as string[]).concat(n).forEach(x => !L.ids.includes(x) && L.ids.push(x));
  ewSync(k);
  UI.sheet = { t: "ew", k };
  render();
}

/* ---------- swap suggestions ---------- */
const jac = (a: string[], b: string[]) => {
  const A = new Set(a.filter(Boolean)), B = new Set(b.filter(Boolean)), u = new Set([...A, ...B]);
  if (!u.size) return 0;
  let n = 0;
  A.forEach(x => B.has(x) && n++);
  return n / u.size;
};
function matchPct(a: string, b: string) {
  const A = EX[a], B = EX[b];
  const pr = jac(A[1].split(","), B[1].split(",")), sc = jac(A[2].split(","), B[2].split(","));
  const eq = EQ[a] && EQ[a] == EQ[b] ? 1 : 0;
  const lo = A[3].split("-").map(Number), hi = B[3].split("-").map(Number);
  const rp = isNaN(lo[0]) || isNaN(hi[0]) ? 0 : Math.max(0, 1 - Math.abs(lo[0] - hi[0]) / 12);
  return Math.round(100 * (0.6 * pr + 0.2 * sc + 0.1 * eq + 0.1 * rp));
}
/** Exercises to swap `id` for, best match first, split into same and other muscle groups. */
export function swapList(id: string, ok: (k: string) => boolean) {
  const ks = Object.keys(EX)
    .filter(k => k != id && ok(k) && eqOk(k))
    .map(k => ({ k, pct: matchPct(id, k), same: EX[k][1].split(",").some(m => EX[id][1].split(",").includes(m)) }))
    .sort((x, y) => y.pct - x.pct);
  return { same: ks.filter(x => x.same), other: ks.filter(x => !x.same) };
}

/* ---------- progression advice ---------- */
function brk(days: number) {
  if (days < 14) return null;
  if (days < 21) return { f: 0.95, v: "5% lighter", sets: 0 };
  if (days < 35) return { f: 0.9, v: "about 10% lighter", sets: 0 };
  if (days < 56) return { f: 0.85, v: "about 15% lighter", sets: -1 };
  if (days < 91) return { f: 0.8, v: "about 20% lighter", sets: -1 };
  return { f: 0.7, v: "about 30% lighter", sets: -1 };
}
const rndW = (w: number) => (w < 20 ? Math.round(w * 2) / 2 : w < 60 ? Math.round(w) : Math.round(w / 2.5) * 2.5);
const LOWER = new Set(["gl", "qd", "ha", "ca", "ad", "lb"]);

export function adv(id: string) {
  const e = EX[id];
  if (CD[id])
    return "Build time before speed: add about 5–10% duration per week, keep most sessions at a conversational effort, and add one harder interval session a week if you like. Guidelines: 150–300 min of moderate activity a week (ACSM).";
  const L = lastE(id), [lo, hi] = e[3].split("-").map(Number);
  if (!L) return `First time: choose a weight you can lift for ${lo}–${hi} reps with 1–3 reps left in reserve.`;
  const l = L.x, w = Math.max(...l.s.map(s => s.w)), gap = dsince(L.d), b = brk(gap);
  const low = e[1].split(",").some(m => LOWER.has(m)), pct = low ? 0.05 : 0.025;
  let t: string;
  if (b) {
    const nw = rndW(w * b.f);
    t = `It has been ${gap} days since you did this. Restart at about ${nw} kg (${b.v} than your last ${w} kg)${b.sets ? " with one set fewer" : ""}, keep 2–3 reps in reserve, then add about 5% a session until you are back to ${w} kg.`;
  } else if (l.s.every(s => s.r >= hi)) {
    const st = w < 20 ? 0.5 : w < 60 ? 1 : 2.5, n = Math.max(w + st, rndW(w * (1 + pct)));
    t = `All sets reached ${hi} reps. Try ${n} kg next (about +${low ? 5 : 2.5}%, within the 2–10% range ACSM suggests), and aim for ${lo}–${hi} reps again.`;
  } else if (l.s.some(s => s.r < lo)) t = `Some sets were under ${lo} reps. Keep ${w} kg (or drop about 5%) and rebuild your reps.`;
  else t = `Keep ${w} kg and add a rep per set until every set reaches ${hi}, then increase the load (double progression).`;
  const hs = S.hist.filter(h => h.it.some(y => y.id == id)).slice(-4);
  if (!b && hs.length >= 4) {
    const top = (h: (typeof hs)[0]) => Math.max(...h.it.find(y => y.id == id)!.s.map(s => s.w * (1 + s.r / 30)));
    if (top(hs[3]) <= top(hs[0]))
      t += " Your last 4 sessions show no progress. Consider a lighter deload week (about 10% less weight) or swapping to a similar exercise.";
  }
  return t;
}

/** "Welcome back" advice after a break of 10+ days, or null. */
export function comeback() {
  const hs = S.hist;
  if (!hs.length) return null;
  const last = hs.map(h => h.d).sort().pop()!, g = dsince(last);
  if (g < 10 || (S.set.brkX && dsince(S.set.brkX) < 7)) return null;
  const ill = S.set.brk == "ill", b = brk(Math.max(g, 14)) || brk(14)!, f = ill ? Math.min(b.f, 0.85) : b.f;
  const wk = g >= 56 ? "3–4" : g >= 21 ? "2–3" : "1–2";
  const vol = ill ? "about 60%" : g >= 56 ? "about 60%" : g >= 21 ? "about 70%" : "about 80%";
  return { g, ill, f, wk, vol };
}

/* ---------- workout generator ---------- */
function localGen(f: string[], n: number, eq: string) {
  const M = new Set(f.flatMap(x => FM[x]));
  const rx = eq == "Dumbbells" ? /dumbbell|bulgarian/i : eq == "Machines" ? /machine|cable|leg press|pulldown|pushdown|extension|assisted|curl|smith/i : null;
  const hit = (s: string) => s.split(",").some(m => M.has(m));
  const sc = (k: string) => (hit(EX[k][1]) ? 3 : 0) + (hit(EX[k][2]) ? 1 : 0) + (rx && rx.test(EX[k][0]) ? 1.5 : 0) + Math.random() * 0.9;
  const all = Object.keys(EX).filter(k => !CD[k]).sort((a, b) => sc(b) - sc(a));
  const pick: string[] = [], cnt: Record<string, number> = {};
  const cap = M.size > 3 ? 2 : 4;
  // Fill in passes, each one less strict, until the workout has n exercises:
  // 1) focus muscle as main target, at most `cap` per muscle; 2) same without the cap;
  // 3) focus muscle as a secondary target; 4) the same three again ignoring the equipment list.
  const passes: ((k: string) => boolean)[] = [
    k => eqOk(k) && hit(EX[k][1]) && (cnt[EX[k][1].split(",")[0]] || 0) < cap,
    k => eqOk(k) && hit(EX[k][1]),
    k => eqOk(k) && hit(EX[k][2]),
    k => hit(EX[k][1]),
    k => hit(EX[k][2]),
  ];
  for (const ok of passes)
    for (const k of all) {
      if (pick.length >= n) break;
      if (pick.includes(k) || !ok(k)) continue;
      pick.push(k);
      const m = EX[k][1].split(",")[0];
      cnt[m] = (cnt[m] || 0) + 1;
    }
  pick.sort((a, b) => parseInt(EX[a][3]) - parseInt(EX[b][3]));
  return { name: f.slice(0, 2).join(" + ") + " workout", ids: pick };
}

/** Build a new workout for the chosen focus areas. Uses AI when connected, otherwise picks locally. */
export async function genWk(f: string[], n: number, eq: string) {
  let res: { name: string; ids: string[] } | null = null;
  if (ai) {
    try {
      const list = Object.keys(EX)
        .filter(k => !CD[k] && eqOk(k))
        .map(k => `${k}: ${EX[k][0]} [${EX[k][1]}${EX[k][2] ? "," + EX[k][2] : ""}]`)
        .join("\n");
      const r = await ai.json(
        `You are a strength coach. Available exercises (id: name [primary,secondary muscles]):\n${list}\nDesign ONE workout with exactly ${n} exercises focused on: ${f.join(", ")}. Equipment preference: ${eq}. Put big compound lifts first, avoid duplicate movements, and use only the ids above. Reply ONLY JSON: {"name":"short workout name","ids":["id","id"]}`,
      );
      if (r && Array.isArray(r.ids)) {
        const v = [...new Set<string>(r.ids.filter((x: string) => EX[x] && !CD[x] && eqOk(x)))];
        if (v.length >= 3) res = { name: String(r.name || "").slice(0, 32), ids: v.slice(0, n) };
      }
    } catch {
      /* fall back to the local generator */
    }
  }
  if (!res) res = localGen(f, n, eq);
  const k = "a" + Date.now();
  ensureLib();
  S.lib!.push({ k, n: res.name || "Generated workout", ids: res.ids });
  mkDraft(k);
  UI.sheet = null;
  commit();
}

/* ---------- exercise search ---------- */
// Lowercase, punctuation to spaces, simple plurals off ("thrusts" → "thrust"), so "pull up" finds "Pull-up".
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\b(\w{3,}[^s\s])s\b/g, "$1").trim();
const HAY: Record<string, string> = {};
/** True when every word of the query appears somewhere in the name, muscles or equipment, in any order. */
export function exMatches(k: string, q: string) {
  const w = norm(q).split(" ").filter(Boolean);
  if (!w.length) return true;
  const e = EX[k];
  const hay = (HAY[k] ??= norm(e[0] + " " + muscles(e[1]) + " " + muscles(e[2]) + " " + (EQN[EQ[k]] || "")));
  const flat = hay.replace(/ /g, "");
  return w.every(x => hay.includes(x) || flat.includes(x));
}

// Words in a workout name and the muscles they point to.
const UP = ["ba", "ch", "de", "bi", "tr"], LOW = ["gl", "qd", "ha", "ca", "ad"];
const NAME_HINTS: [RegExp, string[]][] = [
  [/glute|butt|booty/, ["gl"]], [/ham/, ["ha"]], [/quad/, ["qd"]], [/calf|calves/, ["ca"]], [/hip|abduct|adduct/, ["ad", "gl"]],
  [/leg|lower/, LOW], [/upper/, UP], [/back|lat/, ["ba"]], [/pull/, ["ba", "bi"]], [/chest|pec/, ["ch"]], [/push/, ["ch", "de", "tr"]],
  [/shoulder|delt/, ["de"]], [/arm/, ["bi", "tr"]], [/bicep/, ["bi"]], [/tricep/, ["tr"]], [/full|total|whole/, [...LOW, ...UP]],
];
const CORE = /crunch|sit-up|knee raise|leg raise|woodchop|side bend|torso/i;
/**
 * Order exercises for a workout: the ones that fit words in its name come first
 * (e.g. "Glute focus" puts glute exercises on top), then the rest; A–Z within each group.
 */
export function exOrder(ks: string[], name: string) {
  const n = name.toLowerCase(), want = new Set<string>();
  NAME_HINTS.forEach(([re, m]) => re.test(n) && m.forEach(x => want.add(x)));
  const core = /core|abs\b|\bab\b/.test(n), cardio = /cardio|run|bike|walk/.test(n);
  const score = (k: string) => {
    const e = EX[k];
    let s = 0;
    // The first listed muscle is the main target, so it counts most.
    e[1].split(",").forEach((m, i) => want.has(m) && (s += i ? 3 : 4));
    e[2].split(",").forEach(m => want.has(m) && (s += 1));
    if (core && CORE.test(e[0])) s += 3;
    if (cardio && e[3] == "cardio") s += 3;
    return s;
  };
  const sc: Record<string, number> = {};
  ks.forEach(k => (sc[k] = score(k)));
  return ks.slice().sort((a, b) => sc[b] - sc[a] || EX[a][0].localeCompare(EX[b][0]));
}
