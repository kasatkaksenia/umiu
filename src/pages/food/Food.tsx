import { useIonRouter } from "@ionic/react";
import { useParams } from "react-router-dom";
import { useStore } from "../../lib/store";
import { Hero, Tabs } from "../../components/ui";
import { Page } from "../../components/layout";
import { FoodLog } from "./Log";
import { Targets } from "./Targets";
import { Recipes } from "./Recipes";
import { Shopping } from "./Shopping";

const SUBS = [["log", "Log"], ["targets", "My targets"], ["recipes", "Recipes"], ["shopping", "Shopping"]] as [Sub, string][];
export type Sub = "log" | "targets" | "recipes" | "shopping";

export default function Food() {
  useStore();
  const r = useIonRouter();
  const p = useParams<{ sub?: string }>();
  const sub = (SUBS.some(s => s[0] == p.sub) ? p.sub : "log") as Sub;
  return (
    <Page title="Food" wide={sub == "recipes"}>
      <Hero kind="food" seed={2} a="Fuel for" b="your body" tag="essence" />
      <Tabs items={SUBS} cur={sub} on={k => r.push("/food/" + k, "none", "replace")} />
      {sub == "log" ? <FoodLog /> : sub == "targets" ? <Targets /> : sub == "recipes" ? <Recipes /> : <Shopping />}
    </Page>
  );
}
