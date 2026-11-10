// Measurement units. Everything is stored metric (kg, cm); these helpers convert for display and input.
// Chosen in Profile: S.set.uw = "kg" | "lb", S.set.ul = "cm" | "in".
import { S } from "./store";
import { tr } from "./i18n";

const LB = 2.20462262, IN = 2.54;
const r = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;
export const isLb = () => S.set.uw == "lb";
export const isIn = () => S.set.ul == "in";
/** Unit labels, translated ("kg" → "кг"). */
export const WU = () => tr(isLb() ? "lb" : "kg");
export const LU = () => tr(isIn() ? "in" : "cm");
/** kg → number in the chosen unit. */
export const wOut = (kg: number, d = 1) => r(isLb() ? kg * LB : kg, d);
/** number in the chosen unit → kg. */
export const wIn = (v: number) => (isLb() ? v / LB : v);
export const lOut = (cm: number, d = 1) => r(isIn() ? cm / IN : cm, d);
export const lIn = (v: number) => (isIn() ? v * IN : v);
/** "60 kg" / "132.3 lb". */
export const W = (kg: number, d = 1) => wOut(kg, d) + " " + WU();
