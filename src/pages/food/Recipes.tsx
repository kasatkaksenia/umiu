import { useState } from "react";
import { useIonAlert, useIonRouter } from "@ionic/react";
import { REC, Recipe } from "../../data/foods";
import { ai } from "../../lib/ai";
import { allRecipes, favTog, inShop, logRecipe, toShop } from "../../lib/food";
import { dish } from "../../lib/figures";
import { S, commit, openSheet } from "../../lib/store";
import { Chip, Ico, Svg } from "../../components/ui";

type Opt = [number, string];
const FILTERS: [string, string, Opt[]][] = [
  ["rt", "Time", [[0, "Any"], [15, "≤15"], [30, "≤30"], [45, "≤45 min"]]],
  ["rk", "Calories", [[0, "Any"], [450, "≤450"], [600, "≤600"], [750, "≤750"]]],
  ["rp", "Protein", [[0, "Any"], [45, "45 g+"], [50, "50 g+"], [55, "55 g+"]]],
  ["ri", "Ingredients", [[0, "Any"], [4, "≤4"], [6, "≤6"], [8, "≤8"]]],
];

export function Recipes() {
  const st = S.set, mt = st.rt || 0, mk = st.rk || 0, mp = st.rp || 0, mi = st.ri || 0, fv = !!st.rf, fo = !!st.fo, fav = S.fav || [];
  const [msg, setMsg] = useState("");
  const all = allRecipes()
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => (!mt || (r.m || 99) <= mt) && (!mk || r.k <= mk) && (!mp || r.p >= mp) && (!mi || r.ing.length <= mi) && (!fv || fav.includes(r.t)));
  const act = (mt ? 1 : 0) + (mk ? 1 : 0) + (mp ? 1 : 0) + (mi ? 1 : 0) + (fv ? 1 : 0);
  const set = (k: string, v: any) => {
    S.set[k] = v;
    commit();
  };

  const moreIdeas = async () => {
    if (!ai) return;
    setMsg("Cooking up ideas…");
    try {
      const r = await ai.json(
        "Give 3 new simple recipes with at least 40 g protein per serving, different from: " + allRecipes().map(x => x.t).join(", ") +
          '. Reply ONLY JSON array: [{"t":title,"p":protein g,"k":kcal,"c":carbs g,"f":fat g,"m":cooking minutes,"ing":["quantity + ingredient"],"st":["step","step"]}] (numbers for p,k,c,f,m).',
      );
      S.rec.push(...r.filter((x: Recipe) => x.t && x.ing));
      commit();
      setMsg("");
    } catch (e: any) {
      setMsg("Couldn’t generate (" + (e?.code || "error") + ").");
    }
  };

  return (
    <>
      <div className="card slim">
        <button className="fbtn" aria-expanded={fo} onClick={() => set("fo", fo ? 0 : 1)}>
          <span><Ico k="sliders" s={18} /> Filter{act ? ` · ${act} active` : ""}</span>
          <span>{fo ? "▴" : "▾"}</span>
        </button>
        {fo && (
          <div className="fgrp">
            {FILTERS.map(([k, l, opts]) => (
              <div key={k}>
                <span className="mu">{l}</span>
                <div className="hs">{opts.map(([v, t]) => <Chip key={v} on={(st[k] || 0) == v} onClick={() => set(k, v)}>{t}</Chip>)}</div>
              </div>
            ))}
            <span className="mu">Favourites</span>
            <div className="hs"><Chip on={fv} onClick={() => set("rf", fv ? 0 : 1)}>Favourites only</Chip></div>
            {act > 0 && (
              <button className="g s" style={{ alignSelf: "flex-start" }} onClick={() => {
                S.set.rt = S.set.rk = S.set.rp = S.set.ri = S.set.rf = 0;
                commit();
              }}>Clear filters</button>
            )}
          </div>
        )}
        <div className="row" style={{ marginTop: 8 }}>
          <button className="s" onClick={() => openSheet({ t: "cm" })}>+ Add meal</button>
          {ai && <button className="g s" onClick={moreIdeas}><Ico k="spark" s={16} /> New ideas</button>}
        </div>
        {msg && <p className="mu" role="status" style={{ margin: "4px 0 0" }}>{msg}</p>}
      </div>
      <div className="grid-cards">
        {all.length ? all.map(({ r, i }) => <RecipeCard key={i} r={r} i={i} fav={fav.includes(r.t)} />) : <p className="mu">No recipes match these filters.</p>}
      </div>
    </>
  );
}

function RecipeCard({ r, i, fav }: { r: Recipe; i: number; fav: boolean }) {
  const ir = useIonRouter();
  const [alert] = useIonAlert();
  const sv = inShop(r.t);
  return (
    <div className="card">
      <div className="row" style={{ alignItems: "flex-start" }}>
        {r.img ? <img className="dsh" alt={r.t} src={r.img} /> : <Svg className="dsh" html={dish(r)} />}
        <div>
          <b>{r.t}</b>{r.cu ? <> <span className="pill">yours</span></> : null}
          <br /><span className="pill">{r.p} g protein</span>
          <div className="mu" style={{ marginTop: 6 }}>
            {r.k} kcal · {r.m || "?"} min<br />carbs {r.c} g · fat {r.f} g · {r.ing.length} ingredients
          </div>
        </div>
        <button className={"hrt" + (fav ? " on" : "")} aria-label={fav ? "Remove from favourites" : "Add to favourites"} aria-pressed={fav} onClick={() => favTog(r)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
            <path d="M12 20.500C5 15.500 3 12 3 9a4.500 4.500 0 0 1 9-1.500A4.500 4.500 0 0 1 21 9c0 3-2 6.500-9 11.500z" />
          </svg>
        </button>
      </div>
      <details>
        <summary>Ingredients &amp; how to cook</summary>
        <ul>{r.ing.map((x, k) => <li key={k}>{x}</li>)}</ul>
        <ol>{(r.st || []).map((x, k) => <li key={k}>{x}</li>)}</ol>
      </details>
      <div className="row">
        <button className={sv ? "g" : ""} onClick={() => toShop(r)}>{sv ? "In shopping list ✓" : "+ Shopping list"}</button>
        <button className="g" onClick={() => {
          logRecipe(r);
          ir.push("/food/log", "none", "replace");
        }}>Log meal</button>
        {r.cu ? (
          <button className="g ic" aria-label="Delete meal" onClick={() => alert({
            header: "Delete this meal?",
            buttons: [{ text: "Cancel", role: "cancel" }, {
              text: "Delete", role: "destructive", handler: () => {
                S.rec.splice(i - REC.length, 1);
                commit();
              },
            }],
          })}>✕</button>
        ) : null}
      </div>
    </div>
  );
}
