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
await page.locator('.sh input[aria-label="Search exercises"]').fill("hip thrust machine");
expect("search matches words in any order", /Smith machine/.test((await page.locator(".sh .opt.ox").allInnerTexts()).join(" ")), (await page.locator(".sh .opt.ox").allInnerTexts()).join(" | "));
expect("exercise already in workout shows as added", await page.locator(".sh .opt.ox:disabled", { hasText: "Machine hip thrust" }).count() == 1, "not shown");
await page.locator('.sh input[aria-label="Search exercises"]').fill("curl");
await page.locator(".sh .opt.ox:not([disabled])").nth(0).click(); await page.locator(".sh .opt.ox:not([disabled])").nth(1).click();
await page.locator(".sh button:has-text('Add 2 exercises')").click(); await page.waitForTimeout(300);
expect("sheet closes after adding several", (await page.locator(".sh").count()) == 0, "sheet still open");
await $("button:has-text('Finish workout')").click(); await page.waitForTimeout(500);
expect("finish opens history", (await $(".tabs button.on").innerText()) == "History", await $(".tabs button.on").innerText());
await $(".tabs button:has-text('Workout')").click(); await page.waitForTimeout(400);
// Edit workout: changes save at once, Undo brings the last one back, "Do next" picks the workout.
await $("button:has-text('Change workout')").click(); await page.waitForTimeout(300);
const wk2 = page.locator(".sh .row.wr:has(button.nxt)").first();
const wk2name = await wk2.locator(".opt b").innerText();
await wk2.locator(".opt").click(); await page.waitForTimeout(300);
const exBefore = await page.locator(".sh .row.wr").count();
await page.locator(".sh button[aria-label^='Remove']").first().click(); await page.waitForTimeout(300);
await page.locator("ion-alert button:has-text('Remove')").click(); await page.waitForTimeout(400);
expect("edit: remove saves at once", (await page.locator(".sh .row.wr").count()) == exBefore - 1, await page.locator(".sh .row.wr").count());
await page.locator(".sh .undo button:has-text('Undo')").click(); await page.waitForTimeout(200);
expect("edit: undo puts it back", (await page.locator(".sh .row.wr").count()) == exBefore, await page.locator(".sh .row.wr").count());
expect("edit: one header button, no Done", (await page.locator(".sh button:has-text('Done'), .sh button:has-text('Save')").count()) == 0 && (await page.locator(".sh-head button").innerText()) == "‹ Back", await page.locator(".sh-head button").innerText());
await page.locator(".sh-head button").click(); await page.waitForTimeout(300);
await page.locator(".sh .row.wr", { hasText: wk2name }).locator("button.nxt").click(); await page.waitForTimeout(400);
const nextName = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("bloom2")); return s.lib.find(x => x.k == s.draft.n).n; });
expect("do next picks the workout", nextName == wk2name, nextName);
await $("button:has-text('Change workout')").click(); await page.waitForTimeout(300);
await page.locator(".sh button:has-text('+ New workout')").click(); await page.waitForTimeout(300);
await page.locator(".sh-head button").click(); await page.waitForTimeout(300);
expect("empty new workout is dropped on Back", (await page.locator(".sh .opt b", { hasText: "New workout" }).count()) == 0, "still listed");
await page.keyboard.press("Escape"); await page.waitForTimeout(300);

// Training plan: any whole number of workouts per week.
await page.goto(URL + "#/train/plan"); await page.reload(); await page.waitForTimeout(1000);
await $('button[aria-label="Custom number of workouts"]').click();
await $("#cust-n").fill("21"); await $(".cust button:has-text('Set')").click(); await page.waitForTimeout(300);
expect("custom workouts per week above 14", await page.evaluate(() => JSON.parse(localStorage.getItem("bloom2")).plan.days) == 21, await page.evaluate(() => JSON.parse(localStorage.getItem("bloom2")).plan.days));

await page.goto(URL + "#/food/log"); await page.waitForTimeout(900);
await $('input[aria-label="Food name"]').fill("кур");
expect("Russian food search", /Chicken/.test(await $(".sg button").first().innerText()), await $(".sg button").first().innerText());
await $(".sg button").first().click();
await $('input[aria-label="Amount in grams"]').fill("150");
expect("macros scale with grams", (await $('input[aria-label="kcal"]').inputValue()) == "180", await $('input[aria-label="kcal"]').inputValue());
await $("button:has-text('Add')").last().click(); await page.waitForTimeout(300);
expect("food appears in today list", /Chicken breast/.test((await $(".li").allInnerTexts()).join(" ")), "missing");
// Meal from photo (no AI connected): add ingredients, halve the whole meal, add it to today.
const png = await page.evaluate(() => { const c = document.createElement("canvas"); c.width = 300; c.height = 200; const x = c.getContext("2d"); x.fillStyle = "#e9d8a6"; x.fillRect(0, 0, 300, 200); return c.toDataURL("image/png").split(",")[1]; });
const [fc] = await Promise.all([page.waitForEvent("filechooser"), $(".mpb").click()]);
await fc.setFiles({ name: "meal.png", mimeType: "image/png", buffer: Buffer.from(png, "base64") }); await page.waitForTimeout(400);
for (const q of ["rice", "chicken"]) { await page.fill('.sh input[aria-label="Add ingredient"]', q); await page.waitForTimeout(150); await page.locator(".sh .sg button").first().click(); }
await page.fill('.sh input[aria-label="Meal name"]', "Photo bowl");
await page.locator('.sh button[aria-label="Scale whole meal by 0.5"]').click(); await page.waitForTimeout(150);
expect("photo meal: whole meal scales all ingredients", (await page.inputValue('.sh input[aria-label="Whole meal in grams"]')) == "100", await page.inputValue('.sh input[aria-label="Whole meal in grams"]'));
await page.locator(".sh button:has-text('Add to today')").click(); await page.waitForTimeout(300);
expect("photo meal is logged", /Photo bowl/.test((await $(".li").allInnerTexts()).join(" ")), "missing");
await $(".tabs button:has-text('Recipes')").click(); await page.waitForTimeout(800);
const allN = parseInt(await $(".rcount").innerText());
await $(".fic").click(); await page.waitForTimeout(300);
await page.locator(".sh .chip:has-text('Dinner')").click();
await page.locator(".sh .seg button:has-text('≤30')").click(); await page.waitForTimeout(200);
const shown = await page.locator(".sh button:has-text('Show')").innerText();
await page.locator(".sh button:has-text('Show')").click(); await page.waitForTimeout(300);
const fN = parseInt(await $(".rcount").innerText());
expect("recipe filter pop-up filters", fN < allN && shown.includes(String(fN)) && (await $(".rchip").count()) == 2, `${allN} → ${fN}, ${shown}`);
await $(".rchip").first().click(); await $(".rchip").first().click(); await page.waitForTimeout(200);
expect("removing filter chips shows all", parseInt(await $(".rcount").innerText()) == allN, await $(".rcount").innerText());
await $("button:has-text('+ Shopping list')").first().click();
await $(".tabs button:has-text('Shopping')").click(); await page.waitForTimeout(800);
expect("recipe fills shopping list", (await $(".li").count()) >= 3, await $(".li").count());

await page.waitForTimeout(400);
await $('button[aria-label="Style"]').click(); await page.waitForTimeout(300);
await page.locator(".sh button:has-text('Mist')").click();
expect("style switch", (await page.evaluate(() => document.documentElement.dataset.look)) == "mi", "look not set");
expect("selected style is marked", (await page.locator(".sh .opt.on .lkc").count()) == 1 && /Mist/.test(await page.locator(".sh .opt.on").innerText()), "no mark");
await page.keyboard.press("Escape");

await page.goto(URL + "#/cycle"); await page.waitForTimeout(1200);
await $(".pday.today").click(); await $(".seg button:has-text('Medium')").click(); await page.waitForTimeout(300);
expect("flow logged on today", (await $(".pday.today").getAttribute("class")).includes("f2"), await $(".pday.today").getAttribute("class"));
expect("period start sets phase", /Menstrual/.test(await $(".pill").first().innerText()), await $(".pill").first().innerText());
await $(".pday.today").click(); await page.waitForTimeout(300);
expect("second tap unmarks the day", !(await $(".pday.today").getAttribute("class")).includes(" fl"), await $(".pday.today").getAttribute("class"));
await $(".pday.today").click(); await page.waitForTimeout(300);
await $("button:has-text('Start')").click(); await page.waitForTimeout(1500);
expect("breathing timer runs", /0:5\d/.test(await $('[role="timer"]').innerText()), await $('[role="timer"]').innerText());
expect("data saved", await page.evaluate(() => !!JSON.parse(localStorage.getItem("bloom2")).hist.length), "no history saved");

await b.close();
if (errors.length) console.log(errors.join("\n"));
const failed = checks.filter(x => !x).length;
console.log(failed || errors.length ? `\n${failed} failed checks, ${errors.length} errors` : `\nall ${checks.length} flow checks passed`);
process.exit(failed || errors.length ? 1 : 0);
