// Cycle logic: current phase, daily entries, symptoms, quote filters, widgets, period tracker,
// Apple Health import.
import { PE, PhaseKey, QX, SYM } from "../data/cycle";
import { S, commit, migV12, save } from "./store";
import { A_, TODAY, dAdd, dDiff, mod } from "./util";

/** Cycle length used until there are enough logged periods to average. */
export const DEF_LEN = 26;

/** late: days past the expected start of the next period (0 = due today); only set while overdue. */
export interface Phase { day: number; L: number; next: number; k: PhaseKey; late?: number }

export function phase(): Phase | null {
  const c = S.cyc;
  if (!c) return null;
  const L = c.len || DEF_LEN;
  const raw = Math.floor((new Date(TODAY()).getTime() - new Date(c.start).getTime()) / 864e5);
  // Next period not logged yet: count on and say it's late (up to one extra cycle) instead of silently starting a new cycle.
  if (raw >= L && raw < 2 * L) return { day: raw + 1, L, next: 0, k: "luteal", late: raw - L };
  const day = ((raw % L) + L) % L + 1;
  const ov = L - 14;
  return { day, L, next: L - day + 1, k: day <= (c.per || 5) ? "menstrual" : day < ov - 1 ? "follicular" : day <= ov + 1 ? "ovulation" : "luteal" };
}

/** Today's mood / symptoms / notes entry (created on first use). */
export const ent = () => S.cl[TODAY()] || (S.cl[TODAY()] = { m: 0, sy: [], nt: "" });

export function togSym(v: string) {
  const e = ent(), i = e.sy.indexOf(v);
  i < 0 ? e.sy.push(v) : e.sy.splice(i, 1);
  commit();
}
export function addSym(v: string) {
  v = v.trim().slice(0, 28);
  if (!v) return;
  if (!S.symx.includes(v) && !SYM.includes(v)) S.symx.push(v);
  const e = ent();
  if (!e.sy.includes(v)) e.sy.push(v);
  commit();
}
export function delSym(i: number) {
  const v = S.symx[i];
  S.symx.splice(i, 1);
  Object.values(S.cl).forEach(e => {
    e.sy = e.sy.filter(x => x != v);
  });
  commit();
}
export function setMood(m: number) {
  ent().m = m;
  commit();
}
export function setNote(v: string) {
  ent().nt = v;
  save();
}

/* ---------- quotes ---------- */
export function qList(p: Phase | null) {
  const t = A_<string>(S.set.qt), e = A_<string>(S.set.qe), ph = S.set.qph && p;
  const l = QX.filter(x => (!t.length || t.includes(x.t)) && (!e.length || e.includes(x.e)) && (!ph || PE[p!.k].includes(x.e)));
  return l.length ? l : QX;
}
export function qTog(k: "qt" | "qe", v: string) {
  let a = A_<string>(S.set[k]);
  a = a.includes(v) ? a.filter(x => x != v) : a.concat(v);
  S.set[k] = a;
  S.set.q = 0;
  commit();
}
export function qClr(k: "qt" | "qe") {
  S.set[k] = [];
  if (k == "qe") S.set.qph = 0;
  S.set.q = 0;
  commit();
}

/* ---------- widgets ---------- */
export const wOn = (k: string) => !A_(S.set.hid).includes(k);
export function wTog(k: string) {
  const a = A_<string>(S.set.hid);
  S.set.hid = a.includes(k) ? a.filter(x => x != k) : a.concat(k);
  commit();
}

/* ---------- period tracker ---------- */
export const perSort = () => (S.per || []).slice().sort((a, b) => (a.s < b.s ? 1 : -1));
/**
 * Recalculate average cycle and period length from the logged periods.
 * Period days less than a week apart count as one period, so unmarking a day in the middle
 * doesn't create a "new cycle". Cycle length = average gap between the last 6 period starts
 * (gaps of 20–45 days only); with fewer than two periods it stays as set, 26 days by default.
 */
function episodes() {
  const L = (S.per || []).slice().sort((a, b) => (a.s < b.s ? -1 : 1));
  const ep: { s: string; e: string }[] = [];
  L.forEach(x => {
    const l = ep[ep.length - 1], e = perEndOf(x);
    if (l && dDiff(l.e, x.s) <= 7) l.e = e > l.e ? e : l.e;
    else ep.push({ s: x.s, e });
  });
  const gaps: number[] = [];
  for (let i = 1; i < ep.length; i++) {
    const g = dDiff(ep[i - 1].s, ep[i].s);
    if (g >= 20 && g <= 45) gaps.push(g);
  }
  return { ep, gaps: gaps.slice(-6) };
}
const avg = (a: number[]) => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
function perSync() {
  const { ep, gaps } = episodes();
  if (!ep.length) return;
  const len = gaps.length ? avg(gaps) : (S.cyc && S.cyc.len) || DEF_LEN;
  const ds = ep.filter(x => x.e < TODAY()).map(x => dDiff(x.s, x.e) + 1).filter(n => n >= 2 && n <= 10).slice(-6);
  const per = ds.length ? avg(ds) : (S.cyc && S.cyc.per) || 5;
  S.cyc = { start: ep[ep.length - 1].s, len, per };
}
/** How many cycles the average length is based on (0 = not enough logged periods yet). */
export const avgOf = () => episodes().gaps.length;
export function perStart(d = TODAY()) {
  migV12();
  const o = perSort()[0];
  if (o && !o.e && o.s < d) o.e = dAdd(d, -1);
  if (!S.per.some(x => x.s == d)) S.per.push({ s: d, e: null });
  perSync();
  commit();
}
export function perEnd() {
  migV12();
  const o = perSort()[0];
  if (o && !o.e) {
    o.e = TODAY();
    if (o.e < o.s) o.e = o.s;
    perSync();
    commit();
  }
}
export function perAdd(s: string, e: string) {
  if (!s || (e && e < s)) return false;
  if (!S.per.some(x => x.s == s)) S.per.push({ s, e: e || null });
  else {
    const x = S.per.find(y => y.s == s)!;
    if (e) x.e = e;
  }
  perSync();
  commit();
  return true;
}
export function perDel(s: string) {
  const x = S.per.find(y => y.s == s);
  if (x && S.flow) for (let d = x.s, e = perEndOf(x); d <= e; d = dAdd(d, 1)) delete S.flow[d];
  S.per = S.per.filter(x => x.s != s);
  if (!S.per.length) S.cyc = null;
  else perSync();
  commit();
}
/* ---------- flow tracking (Apple Health style: log each day) ---------- */
/** Last day of a period; an open period runs until today (at most 10 days). */
const perEndOf = (x: { s: string; e: string | null }) => {
  if (x.e) return x.e;
  const t = TODAY(), cap = dAdd(x.s, 9);
  return x.s > t ? x.s : t < cap ? t : cap;
};
/** The logged period that contains day d, if any. */
export const perOn = (d: string) => (S.per || []).find(x => x.s <= d && d <= perEndOf(x)) || null;
/** Flow for a day: null = no period, 0 = period without a flow level, 1–3 = light / medium / heavy. */
export function flowOf(d: string): number | null {
  if (!perOn(d)) return null;
  return (S.flow && S.flow[d]) || 0;
}
/** Merge periods that overlap or touch (next day). */
function perMerge() {
  const L = (S.per || []).slice().sort((a, b) => (a.s < b.s ? -1 : 1));
  const out: typeof L = [];
  L.forEach(x => {
    const l = out[out.length - 1];
    if (l && dDiff(perEndOf(l), x.s) <= 1) {
      const a = perEndOf(l), b = perEndOf(x);
      l.e = a > b ? a : b;
    } else out.push({ ...x });
  });
  S.per = out;
}
/** Log flow for a day (0 = none, or with keep = no level). Days next to a period extend it; a day in the middle of one can be cleared. */
export function setFlow(d: string, v: number, keep = false) {
  migV12();
  if (d > TODAY()) return;
  S.flow = S.flow || {};
  // keep: clear only the flow level, the day stays a period day.
  if (keep && v == 0) {
    delete S.flow[d];
    return commit();
  }
  if (v > 0) {
    S.flow[d] = v;
    if (!perOn(d)) S.per.push({ s: d, e: d });
    perMerge();
  } else {
    delete S.flow[d];
    const x = perOn(d);
    if (x) {
      const e = perEndOf(x);
      S.per = S.per.filter(y => y != x);
      if (x.s < d) S.per.push({ s: x.s, e: dAdd(d, -1) });
      if (d < e) S.per.push({ s: dAdd(d, 1), e });
    }
  }
  if (!S.per.length) S.cyc = null;
  else perSync();
  commit();
}
/** Tap on a day: mark it as a period day, or unmark it if it already is one. Future days can't be logged. */
export function perTog(d: string) {
  migV12();
  if (d > TODAY()) return;
  if (perOn(d)) return setFlow(d, 0);
  S.per.push({ s: d, e: d });
  perMerge();
  perSync();
  commit();
}
/** Estimated period and fertile days from the average cycle (for future days). */
export function predOf(d: string): "per" | "fert" | null {
  const c = S.cyc;
  if (!c) return null;
  const L = c.len || DEF_LEN, cd = mod(dDiff(c.start, d), L) + 1, ov = L - 14;
  if (cd <= (c.per || 5)) return "per";
  if (cd >= ov - 4 && cd <= ov + 1) return "fert";
  return null;
}

export function setCycle(start: string, len: number) {
  S.cyc = start ? { start, len: len || DEF_LEN, per: (S.cyc && S.cyc.per) || 5 } : null;
  commit();
}

/* ---------- Apple Health export reader: zip (stored or deflate) or plain xml ---------- */
async function ahReadZip(f: File): Promise<ReadableStream<Uint8Array>> {
  const tail = await f.slice(Math.max(0, f.size - 70000)).arrayBuffer(), v = new DataView(tail);
  let e = -1;
  for (let i = tail.byteLength - 22; i >= 0; i--) {
    if (v.getUint32(i, true) == 0x06054b50) {
      e = i;
      break;
    }
  }
  if (e < 0) throw new Error("zip");
  const cnt = v.getUint16(e + 10, true), cdo = v.getUint32(e + 16, true);
  if (cdo == 0xffffffff) throw new Error("zip64");
  const cd = new DataView(await f.slice(cdo, cdo + v.getUint32(e + 12, true)).arrayBuffer());
  let p = 0, best: { m: number; cs: number; lo: number } | null = null;
  for (let i = 0; i < cnt; i++) {
    if (cd.getUint32(p, true) != 0x02014b50) break;
    const m = cd.getUint16(p + 10, true), cs = cd.getUint32(p + 20, true), nl = cd.getUint16(p + 28, true);
    const el = cd.getUint16(p + 30, true), cl = cd.getUint16(p + 32, true), lo = cd.getUint32(p + 42, true);
    const nm = new TextDecoder().decode(new Uint8Array(cd.buffer, p + 46, nl));
    if (/(^|\/)export\.xml$/i.test(nm) && !/cda/i.test(nm)) best = { m, cs, lo };
    p += 46 + nl + el + cl;
  }
  if (!best) throw new Error("noxml");
  const lh = new DataView(await f.slice(best.lo, best.lo + 30).arrayBuffer());
  const st = best.lo + 30 + lh.getUint16(26, true) + lh.getUint16(28, true), raw = f.slice(st, st + best.cs);
  if (best.m == 0) return raw.stream();
  if (best.m != 8) throw new Error("method");
  return raw.stream().pipeThrough(new DecompressionStream("deflate-raw" as CompressionFormat));
}
async function ahScan(stream: ReadableStream<Uint8Array>) {
  const rd = stream.pipeThrough(new TextDecoderStream() as any).getReader() as ReadableStreamDefaultReader<string>, days = new Set<string>();
  let buf = "";
  const feed = (l: string) => {
    if (l.indexOf("MenstrualFlow") < 0) return;
    if (/HKCategoryValueMenstrualFlowNone/.test(l)) return;
    const m = l.match(/startDate="(\d{4}-\d{2}-\d{2})/);
    if (m) days.add(m[1]);
  };
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    buf += value;
    const parts = buf.split(/\r?\n|>/);
    buf = parts.pop()!;
    parts.forEach(feed);
  }
  feed(buf);
  return [...days].sort();
}
function ahGroup(days: string[]) {
  const out: { s: string; e: string }[] = [];
  days.forEach(d => {
    const l = out[out.length - 1];
    if (l && dDiff(l.e, d) <= 3) l.e = d;
    else out.push({ s: d, e: d });
  });
  return out;
}
/** Import period days from an Apple Health export. Returns a message for the user. */
export async function ahImport(f: File): Promise<string> {
  try {
    const zip = /\.zip$/i.test(f.name) || f.type == "application/zip";
    if (zip && typeof DecompressionStream == "undefined") throw new Error("nods");
    const days = await ahScan(zip ? await ahReadZip(f) : f.stream());
    if (!days.length) return "No period records found in this file. Make sure Cycle Tracking data is turned on in Health.";
    const g = ahGroup(days);
    migV12();
    let add = 0;
    g.forEach(x => {
      const ex = S.per.find(y => y.s == x.s || (y.s <= x.e && (y.e || y.s) >= x.s));
      if (ex) {
        if (!ex.e) ex.e = x.e;
      } else {
        S.per.push({ s: x.s, e: x.e, src: "ah" });
        add++;
      }
    });
    perSync();
    commit();
    return `Imported ${add} new period${add == 1 ? "" : "s"} (${g.length} found).`;
  } catch (e: any) {
    return ["zip64", "method", "zip", "noxml"].includes(e?.message)
      ? "Couldn’t read this zip. Unzip it and choose export.xml inside apple_health_export."
      : "Couldn’t read this file. Try export.xml from inside the zip.";
  }
}
