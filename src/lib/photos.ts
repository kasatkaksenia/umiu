// Progress photos, saved on this device in IndexedDB (they can be too big for localStorage).
// Photos are never uploaded anywhere.
import { S, UI, render } from "./store";
import { TODAY, loadImg } from "./util";

export interface Photo { id: string; d: string; lab: string; w: number; img: string; ts: number }

export let PHOTOS: Photo[] = [];
/** Photos picked but not yet saved, waiting for their angle (Front / Side / Back). */
export let PEND: { img: string; lab: string }[] = [];

const DB = "umiu", STORE = "photos";
function db() {
  return new Promise<IDBDatabase>((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "id" });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) {
  const d = await db();
  return new Promise<T>((res, rej) => {
    const q = fn(d.transaction(STORE, mode).objectStore(STORE));
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
}

export async function loadPhotos() {
  try {
    const all = (await tx<Photo[]>("readonly", s => s.getAll() as IDBRequest<Photo[]>)) || [];
    PHOTOS = all.sort((a, b) => (a.ts || 0) - (b.ts || 0));
    render();
  } catch {
    /* IndexedDB unavailable (private mode): photos stay in memory */
  }
}

export function setPending(imgs: string[]) {
  PEND = imgs.map((img, i) => ({ img, lab: ["Front", "Side", "Back"][i % 3] }));
}

export async function savePending() {
  const base = Date.now();
  for (let i = 0; i < PEND.length; i++) {
    const o: Photo = { id: "ph_" + (base + i), d: TODAY(), lab: PEND[i].lab, w: S.prof.w || 0, img: PEND[i].img, ts: base + i };
    try {
      await tx("readwrite", s => s.put(o));
    } catch {
      /* keep it in memory for this session */
    }
    PHOTOS.push(o);
  }
  PEND = [];
  UI.sheet = null;
  render();
}

export async function delPhoto(id: string) {
  try {
    await tx("readwrite", s => s.delete(id));
  } catch {
    /* ignore */
  }
  PHOTOS = PHOTOS.filter(p => p.id != id);
  UI.sheet = null;
  render();
}

/* ---------- side-by-side collages ---------- */
function rrect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
async function drawCollage(list: { img: string; cap: string }[]) {
  const n = list.length, W = 1080, H = 1440, pw = W / n, cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d")!, cs = getComputedStyle(document.documentElement);
  const bg = cs.getPropertyValue("--bg").trim() || "#f6f1e8", F = '"Urbanist","Manrope",system-ui,sans-serif';
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < n; i++) {
    const im = await loadImg(list[i].img), x = i * pw;
    c.save();
    c.beginPath();
    c.rect(x, 0, pw, H);
    c.clip();
    const s = Math.max(pw / im.width, H / im.height);
    c.drawImage(im, x + (pw - im.width * s) / 2, (H - im.height * s) / 2, im.width * s, im.height * s);
    c.restore();
  }
  c.fillStyle = bg;
  for (let i = 1; i < n; i++) c.fillRect(i * pw - 2, 0, 4, H);
  c.font = `600 34px ${F}`;
  c.textAlign = "center";
  for (let i = 0; i < n; i++) {
    const t = list[i].cap, tw = c.measureText(t).width + 44, x = i * pw + pw / 2;
    c.fillStyle = "rgba(20,14,12,.55)";
    rrect(c, x - tw / 2, H - 96, tw, 56, 28);
    c.fill();
    c.fillStyle = "#fff";
    c.fillText(t, x, H - 58);
  }
  return cv.toDataURL("image/png");
}
const cap = (p: Photo, t: string) => `${t}${t ? " · " : ""}${p.d.slice(5).replace("-", "/")}${p.w ? " · " + p.w + " kg" : ""}`;

/** Before / Now collage for each angle that has at least two photos. */
export async function showChanges() {
  UI.sheet = { t: "col", msg: "Building your collages…" };
  render();
  try {
    const items: { title: string; img: string }[] = [];
    for (const l of ["Front", "Side", "Back"]) {
      const a = PHOTOS.filter(p => p.lab == l).sort((x, y) => x.ts - y.ts).slice(-2);
      if (a.length < 2) continue;
      items.push({ title: l, img: await drawCollage([{ img: a[0].img, cap: cap(a[0], "Before") }, { img: a[1].img, cap: cap(a[1], "Now") }]) });
    }
    UI.sheet = items.length ? { t: "col", items } : { t: "col", msg: "You need at least two photos from the same angle (Front, Side or Back) to compare." };
  } catch {
    UI.sheet = { t: "col", msg: "Couldn’t build the collages." };
  }
  render();
}
export async function selCollage(sel: string[]) {
  const L = PHOTOS.filter(p => sel.includes(p.id)).sort((a, b) => a.ts - b.ts);
  if (L.length < 2) return;
  UI.sheet = { t: "col", msg: "Building your collage…" };
  render();
  try {
    const img = await drawCollage(L.map((p, i) => ({ img: p.img, cap: cap(p, i == 0 ? "Before" : i == L.length - 1 ? "Now" : p.lab || "") })));
    UI.sheet = { t: "col", items: [{ title: "Your progress", img }] };
  } catch {
    UI.sheet = { t: "col", msg: "Couldn’t build the collage." };
  }
  render();
}
