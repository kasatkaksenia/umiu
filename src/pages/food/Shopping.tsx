import { shopMig, shopTxt } from "../../lib/food";
import { S, commit } from "../../lib/store";

export function Shopping() {
  shopMig();
  return (
    <div className="narrow">
      <div className="card">
        {S.shop.length ? S.shop.map((x, i) => {
          const rs = [...new Set(x.parts.map(p => p.r))];
          return (
            <div className="li" key={i}>
              <label className={x.done ? "done" : ""}>
                <input type="checkbox" style={{ width: "auto" }} checked={x.done} onChange={e => {
                  S.shop[i].done = e.target.checked;
                  commit();
                }} /> {shopTxt(x)} <span className="mu">· {rs.join(", ")}</span>
              </label>
            </div>
          );
        }) : <span className="mu">Add recipes from the Recipes tab.</span>}
      </div>
      {S.shop.length > 0 && (
        <div className="row">
          <button className="q" onClick={() => {
            S.shop = S.shop.filter(x => !x.done);
            commit();
          }}>Clear ticked</button>
          <button className="q" onClick={() => {
            S.shop = [];
            commit();
          }}>Clear all</button>
        </div>
      )}
    </div>
  );
}
