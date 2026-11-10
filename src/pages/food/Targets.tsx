import { useIonRouter } from "@ionic/react";
import { NT, NT_TOPICS, ntList } from "../../data/tips";
import { AC, bfCat, calc, gTxt, navy } from "../../lib/food";
import { PHOTOS, setPending } from "../../lib/photos";
import { resizeImage } from "../../lib/food";
import { Profile, S, commit, openSheet } from "../../lib/store";
import { FileButton, Ico, NumField, InfoButton } from "../../components/ui";
import { showChanges } from "../../lib/photos";
import { useState } from "react";
import { A_, dayNo, dmy, mod } from "../../lib/util";
import { pn, t, tr } from "../../lib/i18n";
import { LU, W, WU, lIn, lOut, wIn, wOut } from "../../lib/units";

export function Targets() {
  const r = useIonRouter();
  const p = S.prof, c = calc();
  // u: "w" = body weight, "l" = length; stored metric, shown in the chosen unit.
  const F = (l: string, k: keyof Profile, step?: string, u?: "w" | "l") => {
    const raw = (p[k] as number) || 0, shown = !raw ? "" : u == "w" ? wOut(raw) : u == "l" ? lOut(raw) : raw;
    return (
      <NumField label={u ? `${tr(l)} (${u == "w" ? WU() : LU()})` : l} value={shown} step={step} min={0} onChange={v => {
        const x = Math.max(0, v || 0);
        (S.prof as any)[k] = u == "w" ? Math.round(wIn(x) * 100) / 100 : u == "l" ? Math.round(lIn(x) * 10) / 10 : x;
        commit();
      }} />
    );
  };
  // The multiplier field only shows when "Custom" is chosen.
  const [isC, setC] = useState(!AC.some(a => a[0] == p.act));
  return (
    <div className="cols c-even">
      <div className="col">
        <div className="card">
          <div className="row" style={{ alignItems: "center" }}>
            <b>Mifflin–St Jeor formula</b>
            <button className="g s ibtn" style={{ flex: "none" }} aria-label="Set calorie and macro goals manually" onClick={() => openSheet({ t: "goals" })}>
              <Ico k="flame" s={16} /><span className="ibl">Manual</span>
            </button>
          </div>
          <p className="mu" style={{ margin: "4px 0" }}>BMR = 10 × kg + 6.25 × cm − 5 × age + 5 (men) or − 161 (women), then × activity multiplier.</p>
          <div className="row">
            <div>
              <span className="mu">Sex</span>
              <select aria-label="Sex" value={p.sex} onChange={e => {
                S.prof.sex = e.target.value as "f" | "m";
                commit();
              }}>
                <option value="f">Woman</option>
                <option value="m">Man</option>
              </select>
            </div>
            {F("Age", "a")}
          </div>
          <div className="row" style={{ marginTop: 8 }}>{F("Height", "h", undefined, "l")}{F("Weight", "w", undefined, "w")}</div>
          <div style={{ marginTop: 8 }}>
            <span className="mu">Activity level</span>
            <select aria-label="Activity level" value={isC ? "c" : String(p.act)} onChange={e => {
              setC(e.target.value == "c");
              if (e.target.value != "c") {
                S.prof.act = +e.target.value;
                commit();
              }
            }}>
              {AC.map(([x, l]) => <option key={x} value={String(x)}>{l}</option>)}
              <option value="c">Custom</option>
            </select>
          </div>
          {isC && <div style={{ marginTop: 8 }}>
            <NumField label="Multiplier (calories burned vs. at rest)" value={p.act} step="0.01" min={1} max={2.4} onChange={v => {
              S.prof.act = Math.min(2.4, Math.max(1, v || 1.2));
              commit();
            }} />
          </div>}
          <div style={{ marginTop: 8 }}>
            <span className="mu">Goal</span>
            <button className="fldb" aria-haspopup="dialog" onClick={() => openSheet({ t: "gp" })}>
              <span>{gTxt(c.t, p.g)}</span><Ico k="down" s={16} />
            </button>
          </div>
          <div className="row" style={{ marginTop: 8 }}>{F("Protein (g/kg)", "pk")}</div>
          <p className="mu">
            {t("BMR {b} kcal → maintenance {m} kcal.", { b: c.bmr, m: c.t })}<br />
            {t("Protein {p} g/kg sits in the 1.6–2.2 range shown to support training gains; fat is 25% of calories (guideline 20–35%); carbs fill the rest.", { p: p.pk })}
          </p>
          <div className="row">
            <div><b>{c.k}</b><br /><span className="mu">kcal</span></div>
            <div><b>{c.p}</b><br /><span className="mu">protein (g)</span></div>
            <div><b>{c.c}</b><br /><span className="mu">carbs (g)</span></div>
            <div><b>{c.f}</b><br /><span className="mu">fat (g)</span></div>
          </div>
          <button style={{ width: "100%", marginTop: 10 }} onClick={() => {
            S.goal = { k: c.k, p: c.p, c: c.c, f: c.f };
            commit();
            r.push("/food/log", "none", "replace");
          }}>Set my goals</button>
        </div>
      </div>
      <div className="col">
        <BodyFat F={F} />
        <TipCard />
        <PhotosCard />
      </div>
    </div>
  );
}

function BodyFat({ F }: { F: (l: string, k: keyof Profile, step?: string, u?: "w" | "l") => JSX.Element }) {
  const p = S.prof, c = calc(), bf = navy(), def = Math.max(0, c.t - c.k);
  let body: JSX.Element | null = null;
  if (bf != null && bf > 0 && bf < 70) {
    const lean = p.w * (1 - bf / 100), fat = p.w - lean;
    let goal: JSX.Element | null = null;
    if (p.gbf > 0 && p.gbf < bf) {
      const gw = lean / (1 - p.gbf / 100), lose = p.w - gw;
      goal = (
        <p className="mu" style={{ marginBottom: 0 }}>
          {t("Goal {g}% body fat ≈ {w}, so about {l} of fat to lose (lean mass kept).", { g: p.gbf, w: W(gw), l: W(lose) })}{" "}
          {def > 0
            ? t("At your current {p}% deficit ({d} kcal/day ≈ {w}/week) that takes about {n}.", { p: Math.round(p.g * -100), d: def, w: W((def * 7) / 7700, 2), n: pn(Math.ceil(lose / ((def * 7) / 7700)), "week") })
            : t("Pick a fat-loss goal above to see a timeline.")}
        </p>
      );
    } else if (p.gbf > 0) goal = <p className="mu" style={{ marginBottom: 0 }}>You are already at or below your goal body fat.</p>;
    body = (
      <>
        <div className="row" style={{ marginTop: 8 }}>
          <div><b>{bf.toFixed(1)}%</b><br /><span className="mu">body fat · {bfCat(bf)}</span></div>
          <div><b>{W(fat)}</b><br /><span className="mu">fat mass</span></div>
          <div><b>{W(lean)}</b><br /><span className="mu">lean mass</span></div>
        </div>
        {goal}
      </>
    );
  }
  return (
    <div className="card">
      <div className="ch" style={{ marginBottom: 6 }}><b>Body fat (US Navy method)</b><InfoButton k="bf" label="How to measure" /></div>
      <div className="row">{F("Neck", "neck", undefined, "l")}{F("Waist", "waist", undefined, "l")}{p.sex == "f" && F("Hip", "hip", undefined, "l")}</div>
      {body}
      <div className="row" style={{ marginTop: 8 }}>{F("Goal body fat %", "gbf")}</div>
    </div>
  );
}

function PhotosCard() {
  const [st, setSt] = useState("");
  const n = PHOTOS.length;
  return (
    <div className="card">
      <b>Progress photos</b>
      <p className="phl">Photos show change better than the mirror.</p>
      <ul className="phs">
        <li><Ico k="cam" s={18} /><span>Add one every 2–4 weeks</span></li>
        <li><Ico k="cols" s={18} /><span>Put them side by side to see how far you’ve come</span></li>
      </ul>
      <div className="pg">
        {PHOTOS.map(p => (
          <button key={p.id} className="pt" aria-label={`${dmy(p.d)} ${p.lab || ""}`} onClick={() => openSheet({ t: "pho", id: p.id })}>
            <img alt="" src={p.img} />
            <span>{dmy(p.d)} · {p.lab || ""}</span>
          </button>
        ))}
      </div>
      <FileButton accept="image/*" multiple style={{ marginTop: 8 }} onFiles={async fl => {
        const files = [...fl].slice(0, 12);
        setSt("Preparing photos…");
        try {
          setPending(await Promise.all(files.map(f => resizeImage(f, 720))));
          setSt("");
          openSheet({ t: "pnd" });
        } catch {
          setSt("Couldn’t read those photos.");
        }
      }}><Ico k="cam" /> Add photos</FileButton>
      <p className="phtip"><b>For a fair look:</b> same spot, light and outfit, in the morning before breakfast, and on a similar cycle day if you can.</p>
      {n > 1 && (
        <div className="row" style={{ marginTop: 8 }}>
          <button onClick={showChanges}>Show my changes</button>
          <button className="g" onClick={() => openSheet({ t: "csel", sel: [] })}>Choose photos</button>
        </div>
      )}
      <p className="mu" role="status" style={{ marginBottom: 0 }}>{st}</p>
    </div>
  );
}

/**
 * Nutrition tips: one at a time with topic, source, ‹ › and Shuffle; a filter picks topics (like the quotes).
 * Starts on a different tip each day. All tips of the list share one grid cell, so the card never changes size.
 */
function TipCard() {
  const tp = A_<string>(S.set.ntf), L = ntList(tp), n = L.length;
  const i = mod(dayNo() + (S.set.nti || 0), n), x = L[i];
  const go = (d: number) => {
    S.set.nti = (S.set.nti || 0) + d;
    commit();
  };
  const name = (k: string) => NT_TOPICS.find(y => y[0] == k)?.[1] || "";
  return (
    <div className="card tipc">
      <div className="tipt">
        <span className="eyebrow mu">{name(x.t)}</span>
        <button className={"g s ic" + (tp.length ? " on" : "")} aria-label={`Choose tip topics${tp.length ? " (filtered)" : ""}`} onClick={() => openSheet({ t: "ntf" })}>
          <Ico k="sliders" s={16} />
        </button>
      </div>
      <div className="tips">
        {L.map((y, j) => (
          <div key={y.h} className={j == i ? "on" : ""} aria-hidden={j != i}>
            <span className="tipn" aria-hidden="true">{String(NT.indexOf(y) + 1).padStart(2, "0")}</span>
            <b className="tiph">{y.h}</b>
            <p>{y.b}</p>
          </div>
        ))}
      </div>
      <div className="tipf">
        <span className="mu tipc-n">{i + 1} of {n}</span>
        <button className="g s ic" aria-label="Previous tip" onClick={() => go(-1)}>‹</button>
        <button className="g s ic" aria-label="Next tip" onClick={() => go(1)}>›</button>
        <button className="g s" onClick={() => go(1 + Math.floor(Math.random() * Math.max(1, n - 1)))}>Shuffle</button>
      </div>
    </div>
  );
}
