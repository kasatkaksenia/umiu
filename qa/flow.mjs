// End-to-end user flows on an iPhone-sized screen. Starts from empty data.
import { URL, launch, deviceOpts, newPage, active } from "./lib.mjs";

const b = await launch();
const { page, errors } = await newPage(b, deviceOpts("iPhone 15"), { seed: false });
const $ = sel => page.locator(active(sel)).filter({ visible: true });
const checks = [];
const expect = (name, ok, got) => { checks.push(ok); console.log((ok ? "ok  " : "FAIL") + " " + name + (ok ? "" : "  → got: " + got)); };

await page.goto(URL + "#/train"); await page.waitForTimeout(1200);
await $(".cx").first().click(); await page.waitForTimeout(700);
await $('input[aria-label="Reps set 1"]').fill("12abc");
expect("reps keep digits only", (await $('input[aria-label="Reps set 1"]').inputValue()) == "12", await $('input[aria-label="Reps set 1"]').inputValue());
await $('input[aria-label="Weight set 1"]').fill("55.5.5");
expect("weight allows one decimal point", (await $('input[aria-label="Weight set 1"]').inputValue()) == "55.55", await $('input[aria-label="Weight set 1"]').inputValue());
await $('input[aria-label="Set 1 done"]').check();
await $('button[aria-label="Add set"]').click();
expect("add set adds a row", (await $(".tb tbody tr").count()) == 4, await $(".tb tbody tr").count());
await $("button:has-text('‹ Back')").click(); await page.waitForTimeout(700);
expect("row shows ticked set", /1\/4 sets/.test(await $(".cx .nm").first().innerText()), await $(".cx .nm").first().innerText());
await $("button:has-text('+ Add exercise')").click(); await page.waitForTimeout(300);
await page.locator('.sh input[aria-label="Search exercises"]').fill("curl");
expect("exercise search filters", (await page.locator(".sh .opt.ox").count()) > 3, await page.locator(".sh .opt.ox").count());
await page.locator(".sh .opt.ox").first().click(); await page.waitForTimeout(300);
expect("sheet closes after pick", (await page.locator(".sh").count()) == 0, "sheet still open");
await $("button:has-text('Finish workout')").click(); await page.waitForTimeout(500);
expect("finish opens history", (await $(".tabs button.on").innerText()) == "History", await $(".tabs button.on").innerText());

await page.goto(URL + "#/food/log"); await page.waitForTimeout(900);
await $('input[aria-label="Food name"]').fill("кур");
expect("Russian food search", /Chicken/.test(await $(".sg button").first().innerText()), await $(".sg button").first().innerText());
await $(".sg button").first().click();
await $('input[aria-label="Amount in grams"]').fill("150");
expect("macros scale with grams", (await $('input[aria-label="kcal"]').inputValue()) == "180", await $('input[aria-label="kcal"]').inputValue());
await $("button:has-text('Add')").last().click(); await page.waitForTimeout(300);
expect("food appears in today list", /Chicken breast/.test((await $(".li").allInnerTexts()).join(" ")), "missing");
await $(".tabs button:has-text('Recipes')").click(); await page.waitForTimeout(800);
await $("button:has-text('+ Shopping list')").first().click();
await $(".tabs button:has-text('Shopping')").click(); await page.waitForTimeout(800);
expect("recipe fills shopping list", (await $(".li").count()) >= 3, await $(".li").count());

await page.waitForTimeout(400);
await $('button[aria-label="Style and data"]').click(); await page.waitForTimeout(300);
await page.locator(".sh button:has-text('Bright pop')").click();
expect("style switch", (await page.evaluate(() => document.documentElement.dataset.look)) == "p", "look not set");
await page.keyboard.press("Escape");

await page.goto(URL + "#/cycle"); await page.waitForTimeout(1200);
await $("button:has-text('My period started today')").click(); await page.waitForTimeout(300);
expect("period start sets phase", /Menstrual/.test(await $(".pill").first().innerText()), await $(".pill").first().innerText());
await $("button:has-text('Start')").click(); await page.waitForTimeout(1500);
expect("breathing timer runs", /0:5\d/.test(await $('[role="timer"]').innerText()), await $('[role="timer"]').innerText());
expect("data saved", await page.evaluate(() => !!JSON.parse(localStorage.getItem("bloom2")).hist.length), "no history saved");

await b.close();
if (errors.length) console.log(errors.join("\n"));
const failed = checks.filter(x => !x).length;
console.log(failed || errors.length ? `\n${failed} failed checks, ${errors.length} errors` : `\nall ${checks.length} flow checks passed`);
process.exit(failed || errors.length ? 1 : 0);
