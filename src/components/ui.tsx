// Small building blocks shared by every screen.
import { ReactNode, useEffect, useRef, useState } from "react";
import { CI, MI, WIC, hsh } from "../lib/icons";
import { mb, av } from "../lib/art";
import { figSvg } from "../lib/figures";
import { EX } from "../data/exercises";
import { eqLbl, muscles } from "../lib/train";

/** Render trusted, generated SVG markup (figures, charts) inside an element. */
export function Svg({ html, className, style, as: Tag = "div" }: { html: string; className?: string; style?: React.CSSProperties; as?: any }) {
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Ico({ k, s = 18 }: { k: string; s?: number }) {
  return (
    <svg className="ci" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: CI[k] }} />
  );
}

/** Colourful widget icon (Cycle cards). */
export function Wico({ k }: { k: string }) {
  const [c, b] = WIC[k];
  return (
    <span className="wi" aria-hidden="true" style={{ ["--c" as any]: `var(${c})`, ["--a" as any]: "var(--cr)" }}>
      <svg viewBox="0 0 32 32" width={26} height={26} dangerouslySetInnerHTML={{ __html: b }} />
    </span>
  );
}

export function MoodIcon({ i, s = 26 }: { i: number; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MI[i] }} />
  );
}

export function Logo({ height = 32 }: { height?: number }) {
  return (
    <svg className="logo" viewBox="-2 -13 152 63" height={height} role="img" aria-label="umiu" fill="none" stroke="currentColor"
      strokeWidth={9} strokeLinecap="butt" strokeLinejoin="miter">
      <path d="M8 10.500V29.500A11 11 0 0 0 30 29.500M30 10.500V45" />
      <path d="M48 45V10.500M48 24A9 9 0 0 1 66 24V45M66 24A9 9 0 0 1 84 24V45" />
      <path d="M100 10.500V45" />
      <path d="M116 10.500V29.500A11 11 0 0 0 138 29.500M138 10.500V38Q138 45 145 45" />
      <path d="M93.500 2.500C93.500-4.500 100-7.500 107-6.500C107 0.500 102 4.500 93.500 2.500Z" fill="var(--ac)" stroke="none" />
    </svg>
  );
}

/** Scattered organic shapes over a picture. */
export function Deco({ seed, n, top }: { seed: string; n: number; top?: boolean }) {
  const R = mb(hsh(seed));
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const k = Math.floor(R() * 5) + 1;
    const s = top ? 30 + R() * 18 : 30 + R() * 44, x = top ? 64 + R() * 24 : 46 + R() * 46, y = top ? 4 + R() * 14 : 4 + R() * 56, r = (R() - 0.5) * 80;
    out.push(
      <span key={i} className="dc" aria-hidden="true" style={{
        left: `${x.toFixed(0)}%`, top: `${y.toFixed(0)}%`, width: `${s.toFixed(0)}px`, height: `${s.toFixed(0)}px`,
        transform: `rotate(${r.toFixed(0)}deg)`, WebkitMaskImage: `var(--m${k})`, maskImage: `var(--m${k})`,
      }} />,
    );
  }
  return <>{out}</>;
}

/** Paint generated art after the first frame so the screen appears immediately. */
export function useArt(make: () => string, key: string) {
  const [bg, setBg] = useState<string | undefined>();
  useEffect(() => {
    let on = true;
    const t = setTimeout(() => on && setBg(make()), 0);
    return () => {
      on = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return bg;
}

export function Hero({ kind, seed, a, b, tag }: { kind: string; seed: number; a: string; b: string; tag: string }) {
  const bg = useArt(() => av(kind, 640, 280, seed), kind + seed);
  return (
    <div className="hero" style={bg ? { backgroundImage: bg } : undefined}>
      <span className="tag">[{tag}]</span>
      <Deco seed={kind + seed} n={2} />
      <h1>{a}<br /><span>{b}</span></h1>
    </div>
  );
}

export function Tabs<K extends string>({ items, cur, on }: { items: [K, string][]; cur: K; on: (k: K) => void }) {
  return (
    <div className="tabs" role="tablist">
      {items.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={cur == k} className={cur == k ? "on" : ""} onClick={() => on(k)}>{l}</button>
      ))}
    </div>
  );
}

export function Chip({ on, onClick, children, label }: { on?: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button className={"chip" + (on ? " on" : "")} aria-pressed={!!on} aria-label={label} onClick={onClick}>{children}</button>
  );
}

/** One exercise in a pick list: figure, name, muscles, equipment, optional badge. */
export function ExOption({ k, onPick, badge }: { k: string; onPick: () => void; badge?: string }) {
  return (
    <button className="opt ox" onClick={onPick}>
      <Svg as="span" className="oth" html={figSvg(k, 1)} />
      <span className="otx"><b>{EX[k][0]}</b><span className="mu">{muscles(EX[k][1])}{eqLbl(k)}</span></span>
      {badge && <span className="pill mt">{badge}</span>}
    </button>
  );
}
export const exMatches = (k: string, q: string) => !q || (EX[k][0] + " " + muscles(EX[k][1])).toLowerCase().includes(q.toLowerCase());

/** Looping exercise demo. Tap to pause. Respects reduced-motion. */
export function FigAnim({ id }: { id: string }) {
  const el = useRef<HTMLDivElement>(null);
  const playing = useRef(true);
  useEffect(() => {
    let raf = 0, t0 = performance.now();
    playing.current = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (el.current) el.current.innerHTML = figSvg(id, 0);
    const loop = (n: number) => {
      if (playing.current && el.current) {
        const t = ((n - t0) / 3200) % 1, u = 0.5 - 0.5 * Math.cos(t * 2 * Math.PI);
        el.current.innerHTML = figSvg(id, u);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    (el.current as any).toggle = () => {
      playing.current = !playing.current;
      if (playing.current) t0 = performance.now();
    };
    return () => cancelAnimationFrame(raf);
  }, [id]);
  return <div className="anim" ref={el} role="button" aria-label="Pause or play the demo" tabIndex={0} onClick={() => (el.current as any)?.toggle?.()} />;
}

/** Hidden file input wrapped in a label styled as a button. */
export function FileButton({ accept, multiple, capture, onFiles, className = "lab", style, children }: {
  accept: string; multiple?: boolean; capture?: boolean; onFiles: (f: FileList) => void; className?: string; style?: React.CSSProperties; children: ReactNode;
}) {
  return (
    <label className={className} style={style}>
      {children}
      <input type="file" accept={accept} multiple={multiple} hidden {...(capture ? { capture: "environment" } : {})}
        onChange={e => {
          if (e.target.files && e.target.files.length) onFiles(e.target.files);
          e.target.value = "";
        }} />
    </label>
  );
}

/** Number input that keeps what the user is typing and reports numbers on change. */
export function NumField({ label, value, onChange, step, min, max, inputMode = "decimal" }: {
  label: string; value: number | ""; onChange: (v: number) => void; step?: string; min?: number; max?: number; inputMode?: "decimal" | "numeric";
}) {
  const [txt, setTxt] = useState(value === 0 || value === "" ? "" : String(value));
  useEffect(() => {
    if (+txt !== value) setTxt(value === 0 || value === "" ? "" : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <div>
      <span className="mu">{label}</span>
      <input type="number" step={step || "any"} min={min} max={max} inputMode={inputMode} value={txt} aria-label={label}
        onChange={e => setTxt(e.target.value)} onBlur={() => onChange(+txt)} onKeyDown={e => e.key == "Enter" && onChange(+txt)} />
    </div>
  );
}
