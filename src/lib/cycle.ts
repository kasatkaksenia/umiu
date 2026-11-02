// Cycle logic: current phase, daily entries, symptoms, quote filters, widgets, period tracker,
// Apple Health import.
import { PE, PhaseKey, QX, SYM } from "../data/cycle";
import { S, commit, migV12, save } from "./store";
import { A_, TODAY, dAdd, dDiff } from "./util";

export interface Phase { day: number; L: number; next: number; k: PhaseKey }

export function phase(): Phase | null {
  const c = S.cyc;
  if (!c) return null;
  const L = c.len || 28;
  const day = ((Math.floor((new Date(TODAY()).getTime() - new Date(c.start).getTime()) / 864e5) % L) + L) % L + 1;
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
/** Recalculate average cycle and period length from the logged periods. */
function perSync() {
  const L = perSort();
  if (!L.length) return;
  const st = L.map(x => x.s).reverse(), gaps: number[] = [];
  for (let i = 1; i < st.length; i++) {
    const g = dDiff(st[i - 1], st[i]);
    if (g >= 20 && g <= 45) gaps.push(g);
  }
  const g6 = gaps.slice(-6);
  const len = g6.length ? Math.round(g6.reduce((a, b) => a + b, 0) / g6.length) : (S.cyc && S.cyc.len) || 28;
  const ds = L.filter(x => x.e).map(x => dDiff(x.s, x.e!) + 1).filter(n => n >= 2 && n <= 10).slice(0, 6);
  const per = ds.length ? Math.round(ds.reduce((a, b) => a + b, 0) / ds.length) : (S.cyc && S.cyc.per) || 5;
  S.cyc = { start: L[0].s, len, per };
}
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
  S.per = S.per.filter(x => x.s != s);
  if (!S.per.length) S.cyc = null;
  else perSync();
  commit();
}
export function setCycle(start: string, len: number) {
  S.cyc = start ? { start, len: len || 28, per: 5 } : null;
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
