import { useIonRouter } from "@ionic/react";
import { TIPS } from "../../data/foods";
import { AC, bfCat, calc, gTxt, navy } from "../../lib/food";
import { PHOTOS, setPending } from "../../lib/photos";
import { resizeImage } from "../../lib/food";
import { Profile, S, commit, openSheet } from "../../lib/store";
import { FileButton, Ico, NumField } from "../../components/ui";
import { showChanges } from "../../lib/photos";
import { useState } from "react";

export function Targets() {
  const r = useIonRouter();
  const p = S.prof, c = calc();
  const F = (l: string, k: keyof Profile, step?: string) => (
    <NumField label={l} value={(p[k] as number) || ""} step={step} onChange={v => {
      (S.prof as any)[k] = v;
      commit();
    }} />
  );
  const isC = !AC.some(a => a[0] == p.act);
  return (
    <div className="cols c-even">
      <div className="col">
        <div className="card">
          <div className="row" style={{ alignItems: "center" }}>
            <b>Mifflin–St Jeor formula</b>
            <button className="g s" style={{ flex: "none" }} aria-label="Set calorie and macro goals manually" onClick={() => openSheet({ t: "goals" })}>
              <Ico k="flame" s={16} /> Manual <Ico k="pen" s={14} />
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
          <div className="row" style={{ marginTop: 8 }}>{F("Height cm", "h")}{F("Weight kg", "w")}</div>
          <div style={{ marginTop: 8 }}>
            <span className="mu">Activity level</span>
            <select aria-label="Activity level" value={isC ? "c" : String(p.act)} onChange={e => {
              if (e.target.value != "c") {
                S.prof.act = +e.target.value;
                commit();
              }
            }}>
              {AC.map(([x, l]) => <option key={x} value={String(x)}>{l}</option>)}
              <option value="c">Custom</option>
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <NumField label="Multiplier (calories burned vs. at rest)" value={p.act} step="0.01" min={1} max={2.4} onChange={v => {
              S.prof.act = Math.min(2.4, Math.max(1, v || 1.2));
              commit();
            }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <span className="mu">Goal</span>
            <button className="fldb" aria-haspopup="dialog" onClick={() => openSheet({ t: "gp" })}>
              <span>{gTxt(c.t, p.g)}</span><span aria-hidden="true">▾</span>
            </button>
          </div>
          <div className="row" style={{ marginTop: 8 }}>{F("Protein g/kg", "pk")}</div>
          <p className="mu">
            BMR {c.bmr} kcal → maintenance {c.t} kcal.<br />
            Protein {p.pk} g/kg sits in the 1.6–2.2 range shown to support training gains; fat is 25% of calories (guideline 20–35%); carbs fill the rest.
          </p>
          <div className="row">
            <div><b>{c.k}</b><br /><span className="mu">kcal</span></div>
            <div><b>{c.p} g</b><br /><span className="mu">protein</span></div>
            <div><b>{c.c} g</b><br /><span className="mu">carbs</span></div>
            <div><b>{c.f} g</b><br /><span className="mu">fat</span></div>
          </div>
          <button style={{ width: "100%", marginTop: 10 }} onClick={() => {
            S.goal = { k: c.k, p: c.p, c: c.c, f: c.f };
            commit();
            r.push("/food/log", "none", "replace");
          }}>Use these as my daily goals</button>
        </div>
      </div>
      <div className="col">
        <BodyFat F={F} />
        <details className="card">
          <summary><b>Nutrition tips for lifters</b></summary>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {TIPS.map(([a, b]) => <li key={a} style={{ marginBottom: 6 }}><b>{a}.</b> {b.replace(/&amp;/g, "&")}</li>)}
          </ul>
        </details>
        <PhotosCard />
      </div>
    </div>
  );
}

function BodyFat({ F }: { F: (l: string, k: keyof Profile, step?: string) => JSX.Element }) {
  const p = S.prof, c = calc(), bf = navy(), def = Math.max(0, c.t - c.k);
  let body: JSX.Element;
  if (bf != null && bf > 0 && bf < 70) {
    const lean = p.w * (1 - bf / 100), fat = p.w - lean;
    let goal: JSX.Element | null = null;
    if (p.gbf > 0 && p.gbf < bf) {
      const gw = lean / (1 - p.gbf / 100), lose = p.w - gw;
      goal = (
        <p className="mu" style={{ marginBottom: 0 }}>
          Goal {p.gbf}% body fat ≈ {gw.toFixed(1)} kg, so about {lose.toFixed(1)} kg of fat to lose (lean mass kept).
          {def > 0
            ? ` At your current ${Math.round(p.g * -100)}% deficit (${def} kcal/day ≈ ${((def * 7) / 7700).toFixed(2)} kg/week) that takes about ${Math.ceil(lose / ((def * 7) / 7700))} weeks.`
            : " Pick a fat-loss goal above to see a timeline."}
        </p>
      );
    } else if (p.gbf > 0) goal = <p className="mu" style={{ marginBottom: 0 }}>You are already at or below your goal body fat.</p>;
    body = (
      <>
        <div className="row" style={{ marginTop: 8 }}>
          <div><b>{bf.toFixed(1)}%</b><br /><span className="mu">body fat · {bfCat(bf)}</span></div>
          <div><b>{fat.toFixed(1)} kg</b><br /><span className="mu">fat mass</span></div>
          <div><b>{lean.toFixed(1)} kg</b><br /><span className="mu">lean mass</span></div>
        </div>
        {goal}
      </>
    );
  } else body = <p className="mu" style={{ marginBottom: 0 }}>Enter neck, waist{p.sex == "f" ? " and hip" : ""} to calculate body fat.</p>;
  return (
    <div className="card">
      <b>Body fat (US Navy method)</b>
      <p className="mu" style={{ margin: "4px 0 8px" }}>
        Measure in cm: neck below the larynx, waist at the navel{p.sex == "f" ? ", hips at the widest point" : ""}.
      </p>
      <div className="row">{F("Neck cm", "neck")}{F("Waist cm", "waist")}{p.sex == "f" && F("Hip cm", "hip")}</div>
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
      <p className="mu" style={{ margin: "4px 0 8px" }}>
        <Ico k="lock" s={14} /> Stored only on this device. They are never uploaded or sent to AI.
      </p>
      <div className="pg">
        {PHOTOS.map(p => (
          <button key={p.id} className="pt" aria-label={`${p.d} ${p.lab || ""}`} onClick={() => openSheet({ t: "pho", id: p.id })}>
            <img alt="" src={p.img} />
            <span>{p.d.slice(5)} · {p.lab || ""}</span>
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
