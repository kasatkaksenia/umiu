// Navigation check: after every step exactly one screen must be visible.
import { URL, launch, deviceOpts, newPage, active, screens } from "./lib.mjs";

const b = await launch();
const { page, errors } = await newPage(b, deviceOpts("iPhone 15"));
let fail = 0;
const step = async (name, fn) => {
  await fn();
  await page.waitForTimeout(900);
  const s = await screens(page), vis = s.filter(x => x[0] == "+");
  if (vis.length != 1) fail++;
  console.log((vis.length == 1 ? "ok  " : "FAIL") + " " + name.padEnd(22) + vis.join(" "));
};
const nav = i => page.locator(".bnav button").nth(i).click();
await step("open train", () => page.goto(URL + "#/train"));
await step("open exercise", () => page.locator(active(".cx")).first().click());
await step("back button", () => page.locator(active("button.bk")).click());
await step("tab food", () => nav(1));
await step("food sub-tab recipes", () => page.locator(active(".tabs button")).nth(2).click());
await step("tab cycle", () => nav(2));
await step("tab train", () => nav(0));
await step("exercise again", () => page.locator(active(".cx")).first().click());
await step("tab food from exercise", () => nav(1));
await step("tab train", () => nav(0));
await step("typed url cycle", () => page.goto(URL + "#/cycle"));
await step("browser back", () => page.goBack());
await step("browser back", () => page.goBack());
await step("browser forward", () => page.goForward());
await step("deep link exercise", () => page.goto(URL + "#/train/ex/bss"));
await step("tab cycle", () => nav(2));
await b.close();
if (errors.length) console.log(errors.join("\n"));
console.log(fail || errors.length ? `\n${fail} navigation failures, ${errors.length} errors` : "\nall navigation checks passed");
process.exit(fail || errors.length ? 1 : 0);
