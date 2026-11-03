// Small shared helpers: dates, escaping, arrays.

/** Today's date as YYYY-MM-DD in the user's local time zone. */
export const TODAY = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
};

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export const A_ = <T = any>(v: unknown): T[] => (Array.isArray(v) ? v : []);

export const dAdd = (d: string, n: number) => {
  const x = new Date(d + "T12:00:00");
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};
export const dDiff = (a: string, b: string) =>
  Math.round((new Date(b + "T12:00:00").getTime() - new Date(a + "T12:00:00").getTime()) / 864e5);
export const dFmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en", { day: "numeric", month: "short" });
/** Whole days from a date until today (never negative). */
export const dsince = (d: string) => Math.max(0, Math.floor((new Date(TODAY()).getTime() - new Date(d).getTime()) / 864e5));

/** Day number since 1970, used to rotate the daily quote and fact. */
export const dayNo = () => Math.floor(Date.now() / 864e5);
export const mod = (i: number, n: number) => ((i % n) + n) % n;

export const loadImg = (u: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = u;
  });

/** Start a file download in the browser. */
export function download(filename: string, url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
