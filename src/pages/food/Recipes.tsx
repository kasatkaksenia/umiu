import { useState } from "react";
import { useIonRouter } from "@ionic/react";
import { REC, Recipe } from "../../data/foods";
import { ai } from "../../lib/ai";
import { allRecipes, favTog, inShop, logRecipe, recipesShown, rfChips, toShop } from "../../lib/food";
import { dish } from "../../lib/figures";
import { S, commit, openSheet } from "../../lib/store";
import { Ico, Svg } from "../../components/ui";
import { pn, t as tt } from "../../lib/i18n";
import { offerUndo } from "../../lib/undo";

export function Recipes() {
  const fav = S.fav || [], all = recipesShown(), chips = rfChips();
  const [msg, setMsg] = useState("");

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
      {/* Count and the filter button; the filters themselves live in a pop-up. */}
      <div className="rbar">
        <b className="rcount">{pn(all.length, "recipe")}</b>
        {ai && <button className="g s ibtn" onClick={moreIdeas}><Ico k="spark" s={16} /> New ideas</button>}
        <button className={"g s fic" + (chips.length ? " on" : "")} aria-label={`Filters${chips.length ? `, ${chips.length} active` : ""}`} onClick={() => openSheet({ t: "rf" })}>
          <Ico k="sliders" s={18} />
          {chips.length > 0 && <span className="fbadge" aria-hidden="true">{chips.length}</span>}
        </button>
      </div>
      {/* Active filters: tap one to remove it without opening the pop-up. */}
      {chips.length > 0 && (
        <div className="rchips" role="group" aria-label="Active filters">
          {chips.map(([l, clr]) => <button key={l} className="rchip" aria-label={`Remove filter: ${l}`} onClick={clr}>{l}<span aria-hidden="true">✕</span></button>)}
        </div>
      )}
      {msg && <p className="mu" role="status" style={{ margin: "0 4px 10px" }}>{msg}</p>}
      <div className="grid-cards">
        {all.length ? all.map(({ r, i }) => <RecipeCard key={i} r={r} i={i} fav={fav.includes(r.t)} />) : <p className="mu">No recipes match these filters.</p>}
      </div>
    </>
  );
}

function RecipeCard({ r, i, fav }: { r: Recipe; i: number; fav: boolean }) {
  const ir = useIonRouter();
  const sv = inShop(r.t);
  return (
    <div className="card">
      <div className="row" style={{ alignItems: "flex-start" }}>
        {r.img ? <img className="dsh" alt={r.t} src={r.img} /> : <Svg className="dsh" html={dish(r)} />}
        <div>
          <b>{r.t}</b>{r.cu ? <> <span className="pill">yours</span></> : null}
          <br /><span className="pill">{r.p} g protein</span>
          <div className="mu" style={{ marginTop: 6 }}>
            <span className="nw">{r.k} kcal</span> · <span className="nw">{r.m || "?"} min</span><br /><span className="nw">carbs {r.c} g</span> · <span className="nw">fat {r.f} g</span> · <span className="nw">{r.ing.length} ingredients</span>
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
          <button className="g ic" aria-label="Delete meal" onClick={() => {
            const j = i - REC.length, x = S.rec[j];
            S.rec.splice(j, 1);
            commit();
            offerUndo(tt("Deleted “{n}”", { n: x.t }), () => S.rec.splice(j, 0, x));
          }}>✕</button>
        ) : null}
      </div>
    </div>
  );
}
