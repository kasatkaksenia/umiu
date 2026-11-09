// App state. `S` is saved on the device (localStorage); `UI` holds what is open right now.
// Actions change S or UI directly, then call save() and/or render(). Components that call
// useStore() re-render after render().
import { useSyncExternalStore } from "react";
import type { Recipe } from "../data/foods";

export interface SetRow { r: number | ""; w: number | ""; i?: number | ""; d: boolean }
export interface Draft { n: string; ids: string[]; sets: Record<string, SetRow[]> }
export interface LoggedSet { w: number; r: number; i?: number }
export interface Workout { d: string; n: string; it: { id: string; s: LoggedSet[] }[] }
export interface LibWorkout { k: string; n: string; ids: string[] }
export interface FoodEntry { d: string; n: string; k: number; p: number; c: number; f: number }
export interface SavedFood { n: string; k: number; p: number; c: number; f: number }
export interface ShopItem { k: string; n: string; u: string; done: boolean; parts: { r: string; q: number | null; raw: string }[] }
export interface DayEntry { m: number; sy: string[]; nt: string }
export interface Period { s: string; e: string | null; src?: string }
export interface Profile {
  sex: "f" | "m"; a: number; h: number; w: number; act: number; g: number; pk: number;
  neck: number; waist: number; hip: number; gbf: number;
}

export interface State {
  lib: LibWorkout[] | null;
  hist: Workout[];
  draft: Draft | null;
  tpl: Record<string, string[]>;
  plan: { days: number; split: string; i: number; set?: boolean };
  f: FoodEntry[];
  goal: { k: number; p: number; c: number; f: number };
  prof: Profile;
  foods: Record<string, SavedFood>;
  rec: Recipe[];
  shop: ShopItem[];
  cyc: { start: string; len: number; per: number } | null;
  cl: Record<string, DayEntry>;
  symx: string[];
  /** Small preferences and view settings (filters, chosen style, open panels …). */
  set: Record<string, any>;
  per: Period[];
  /** Menstrual flow per day (YYYY-MM-DD → 1 light, 2 medium, 3 heavy), like Apple Health. */
  flow?: Record<string, number>;
  fav: string[];
  eq: string[];
}

export const BLANK: State = {
  lib: null, hist: [], draft: null, tpl: {}, plan: { days: 3, split: "ul", i: 0 }, f: [],
  goal: { k: 2000, p: 110, c: 220, f: 60 },
  prof: { sex: "f", a: 30, h: 165, w: 65, act: 1.75, g: 0, pk: 1.8, neck: 0, waist: 0, hip: 0, gbf: 0 },
  foods: {}, rec: [], shop: [], cyc: null, cl: {}, symx: [], set: {}, per: [], fav: [], eq: [],
};

const KEY = "bloom2";
const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

export let S: State = clone(BLANK);

export type Sheet =
  | { t: "swap"; id: string }
  | { t: "add" }
  | { t: "wk"; del?: string | null }
  | { t: "ew"; k: string }
  | { t: "ewp"; k: string; m: "swap" | "add"; id?: string }
  | { t: "ai"; f: string[]; n?: number; e?: string }
  | { t: "wid" }
  | { t: "cm" }
  | { t: "pnd" }
  | { t: "col"; items?: { title: string; img: string }[]; msg?: string }
  | { t: "csel"; sel: string[] }
  | { t: "qf" }
  | { t: "ntf" }
  | { t: "rf" }
  | { t: "gp" }
  | { t: "goals" }
  | { t: "look" }
  | { t: "pho"; id: string; del?: boolean }
  | { t: "data" };

export const UI: { sheet: Sheet | null; menu: string | null; msg: string } = { sheet: null, menu: null, msg: "" };

let version = 0;
const subs = new Set<() => void>();

/** Re-render every component that uses the store. */
export function render() {
  version++;
  subs.forEach(f => f());
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch {
    /* storage full or blocked: the app keeps working for this session */
  }
}

/** Save and re-render: the usual ending of an action. */
export function commit() {
  save();
  render();
}

export function openSheet(s: Sheet | null) {
  UI.sheet = s;
  render();
}

export function useStore() {
  return useSyncExternalStore(
    f => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => version,
  );
}

/** Upgrade older saved data. */
export function migV12() {
  if (!Array.isArray(S.per)) S.per = [];
  if (!Array.isArray(S.fav)) S.fav = [];
  if (!Array.isArray(S.eq)) S.eq = [];
  if (!S.set) S.set = {};
  if (S.set.acv != 2) {
    const m: Record<string, number> = { 1.2: 1.4, 1.375: 1.55, 1.55: 1.75, 1.725: 1.95, 1.9: 2.2 };
    if (S.prof && m[S.prof.act]) S.prof.act = m[S.prof.act];
    S.set.acv = 2;
  }
}

export function merge(o: Partial<State>) {
  S = Object.assign(clone(BLANK), o);
  S.goal = Object.assign({}, BLANK.goal, S.goal);
  S.prof = Object.assign({}, BLANK.prof, S.prof);
  S.plan = Object.assign({}, BLANK.plan, S.plan);
  S.tpl = S.tpl || {};
  S.symx = S.symx || [];
  if (S.lib && !Array.isArray(S.lib)) S.lib = null;
  delete (S as any).sess;
  migV12();
  if (S.draft && !S.draft.ids) S.draft = null;
}

export function load() {
  try {
    const l = localStorage.getItem(KEY);
    if (l) merge(JSON.parse(l));
    else migV12();
  } catch {
    migV12();
  }
}

/** Replace all data with an imported backup. Throws if the file isn't a umiu backup. */
export function importData(json: string) {
  const o = JSON.parse(json);
  const d = o && o.app === "umiu" && o.data ? o.data : o;
  if (!d || typeof d !== "object" || !("hist" in d || "f" in d || "cl" in d)) throw new Error("not a backup");
  merge(d);
  UI.sheet = null;
  commit();
}

export function exportData() {
  return JSON.stringify({ app: "umiu", v: 1, at: new Date().toISOString(), data: S });
}

load();
