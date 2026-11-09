// Cycle phases, symptoms, quotes, mind facts and breathing practices.
/* eslint-disable */
export type PhaseKey = "menstrual" | "follicular" | "ovulation" | "luteal";
export const PH: Record<PhaseKey, { n: string; d: string; eat: string[]; sport: string[]; do: string[] }> = {
menstrual:{n:"Menstrual",d:"Hormones are at baseline; energy is often lowest on days 1–2.",eat:["Iron: lean red meat, lentils, tofu, spinach – pair plant iron with vitamin C (RDA ≈18 mg/day for women 19–50).","Omega-3 fish or walnuts and magnesium-rich foods (seeds, dark chocolate); small trials link them to less period pain.","Keep hydrated; warm meals if appetite is low."],sport:["Walking, yoga, swimming or easy cycling – a Cochrane review found exercise reduces period pain.","Strength training is fine if you feel well; lower the volume if tired.","Evidence for phase-specific training is weak – let symptoms guide you."],do:["A heat pad helps cramps; NSAIDs (ibuprofen) per label if you can take them.","Aim for 7–9 h sleep.","See a doctor for bleeding that soaks a pad/tampon every hour, large clots, or pain that stops you functioning."]},
follicular:{n:"Follicular",d:"Estrogen rises; mood and energy usually improve.",eat:["Protein 1.6–2.2 g/kg/day supports training adaptation.","Carbs around workouts (oats, fruit, rice) and plenty of fibre-rich veg.","Keep iron-rich foods in after your period."],sport:["A good window for hard strength or interval sessions if you feel strong.","Try progressing loads.","Cycle effects on performance are small and individual (Elliott-Sale 2020 meta-analysis)."],do:["Schedule demanding or creative work when focus is high.","Track how you actually feel rather than assuming."]},
ovulation:{n:"Ovulation",d:"Estrogen peaks around mid-cycle.",eat:["Fibre, colourful veg and fruit; stay hydrated.","Enough carbs and protein – no need to restrict.","Calcium: dairy or fortified alternatives."],sport:["Power and heavy lifts often feel good.","Warm up thoroughly with landing and single-leg control drills – some studies suggest slightly higher knee laxity around ovulation; evidence is mixed."],do:["Brief one-sided mid-cycle pain can be normal.","Estimates from an app are not reliable contraception or conception timing."]},
luteal:{n:"Luteal",d:"Progesterone rises; PMS symptoms are common in the late phase.",eat:["Resting energy use rises a little (~100–300 kcal/day), so extra hunger is normal – don’t under-eat.","Complex carbs (oats, potato, rice) and protein at each meal to steady mood and cravings.","Calcium (~1,000–1,200 mg/day) and vitamin D are linked to fewer PMS symptoms.","Limit alcohol, caffeine and excess salt if bloated or sleeping badly."],sport:["Moderate strength training, Pilates, brisk walking; regular aerobic exercise is associated with milder PMS.","Late luteal: cut intensity or volume if fatigued; heat can feel harder."],do:["Protect sleep with a wind-down routine.","Severe mood symptoms (possible PMDD) deserve a conversation with a clinician – treatment exists."]}};
export const SYM = ["Cramps","Headache","Bloating","Fatigue","Cravings","Acne","Breast tenderness","Back pain","Nausea","Low mood","Irritability","Anxiety","Insomnia","Spotting","Brain fog","Low libido"];
export interface Quote { e: string; t: string; q: string; a: string; s: string }
export const QX: Quote[] = `moon|i|Even the moon takes dark nights to become full.||
moon|c|You carry a quiet glow that never needs switching on.||
moon|w|Nature does not hurry, yet everything is accomplished.|Lao Tzu|Taoism
moon|w|The mind is like the moon: calm water shows it clearly.|Zen saying|Zen
water|i|Rest is not falling behind. It is how the tide returns.||
water|c|You are softer and stronger than you give yourself credit for.||
water|w|Nothing in the world is softer than water, yet nothing is better at wearing down the hard.|Lao Tzu, Tao Te Ching 78|Taoism
water|w|Do nothing that is of no use.|Miyamoto Musashi, Dokkodo|Martial arts
grass|i|Something in you is sprouting. Water it with small steps.||
grass|c|Your effort is quietly beautiful, and it shows.||
grass|w|A journey of a thousand miles begins beneath one’s feet.|Lao Tzu|Taoism
grass|w|Act as if what you do makes a difference. It does.|William James|Psychology
moss|i|Roots first, then reach. You are doing both.||
moss|c|You are steady in a way people feel when they’re near you.||
moss|w|Yoga is the stilling of the fluctuations of the mind.|Patanjali, Yoga Sutras 1.2|Yoga
moss|w|Today is victory over yourself of yesterday.|Miyamoto Musashi (attributed)|Martial arts
ribbon|i|You don’t need to fix every feeling. Notice it, and breathe.||
ribbon|c|Your intuition is sharper than you think. Trust it.||
ribbon|w|You have power over your mind, not outside events. Realise this, and you will find strength.|Marcus Aurelius (paraphrase)|Stoicism
ribbon|w|The curious paradox is that when I accept myself just as I am, then I can change.|Carl Rogers|Psychology
petal|i|You are in full bloom. Take up space.||
petal|c|You light up a room without trying.||
petal|w|All that we are is the result of what we have thought.|Dhammapada (paraphrase)|Buddhism
petal|w|Be kind to yourself first; ahimsa starts at home.|Yoga teaching|Yoga
sun|i|Radiate, then rest. Both are power.||
sun|c|Your energy is magnetic today. Others feel it.||
sun|w|You have a right to your actions, but never to the fruits of action.|Bhagavad Gita 2.47 (paraphrase)|Yoga
sun|w|In the midst of chaos, there is also opportunity.|Sun Tzu (attributed)|Martial arts
goddess|i|Grace and strength belong together.||
goddess|c|You are allowed to be soft and powerful at the same time.||
goddess|w|Who looks outside, dreams; who looks inside, awakes.|Carl Jung|Psychology
goddess|w|Peace comes from within. Do not seek it without.|Attributed to the Buddha|Buddhism
wind|i|Let the wind carry what you can’t hold today.||
wind|c|You handle more than anyone sees, and you do it with grace.||
wind|w|You are the sky. Everything else is just the weather.|Zen teaching (paraphrase)|Zen
wind|w|Breathe in, breathe out: the breath is the bridge between body and mind.|Thich Nhat Hanh (paraphrase)|Buddhism
sun|i|Small, steady effort is a kind of fire.||
water|i|Flow around what you can’t move.||
petal|c|Your kindness is one of your strongest features.||
moon|c|Your calm is a gift to the people around you.||`.split("\n").map(l=>{const[e,t,q,a,s]=l.split("|");return{e,t,q,a,s}});
`moon|c|You are doing great, sweetheart.
moon|c|Be proud of how far you have come.
moon|i|Tonight, rest is the most productive thing you can do.
water|c|You’re on your own path, and it’s a beautiful one.
water|c|There’s no one quite like you.
water|i|You can be gentle and still go far.
water|w|Fall seven times, stand up eight.|Japanese proverb|Zen
grass|c|Keep going, you’re closer than you think.
grass|c|Look at you, growing every single day.
grass|i|Tiny steps still count as steps.
grass|w|Chop wood, carry water. Do the next small thing with full attention.|Zen proverb|Zen
moss|c|You’re allowed to take your time.
moss|c|You’re stronger than you feel right now.
moss|i|Slow and steady is still moving.
moss|w|The posture should be steady and comfortable.|Patanjali, Yoga Sutras 2.46|Yoga
ribbon|c|You’re doing better than you think, love.
ribbon|c|Your pace is the right pace.
ribbon|i|Go with the flow, then choose your direction.
ribbon|w|We suffer more often in imagination than in reality.|Seneca|Stoicism
petal|c|You are doing so well, honestly.
petal|c|You make the world a little softer.
petal|i|Bloom in your own time.
petal|w|Better than a thousand hollow words is one word that brings peace.|Dhammapada (paraphrase)|Buddhism
sun|c|You’ve got this, and I believe in you.
sun|c|You’re shining, even on the quiet days.
sun|i|Let today be a good day to start again.
sun|w|The privilege of a lifetime is to become who you truly are.|Carl Jung (attributed)|Psychology
goddess|c|You are enough, exactly as you are.
goddess|c|Proud of you, always.
goddess|i|Walk like you already trust yourself.
goddess|w|Perceive that which cannot be seen with the eye.|Miyamoto Musashi, Book of Five Rings (paraphrase)|Martial arts
wind|c|Take a deep breath. You’re doing just fine.
wind|c|Be kind to yourself today, you deserve it.
wind|i|This feeling will pass. You will still be here.
wind|w|The mind is restless, but it can be trained by practice.|Bhagavad Gita 6.35 (paraphrase)|Yoga
sun|c|You’re a good one, and you’re doing great.
moon|c|You deserve the same kindness you give others.
water|i|Rest. Breathe. Begin again.
petal|i|You don’t have to be perfect to be wonderful.
grass|c|Keep going, sweetheart. Every step counts.
moss|w|The obstacle is the path.|Zen proverb|Zen
goddess|w|Knowing yourself is the beginning of all wisdom.|Aristotle (attributed)|Philosophy`.split("\n").forEach(l=>{const[e,t,q,a,s]=l.split("|");QX.push({e,t,q,a:a||"",s:s||""})});
`moon|g|Thank you, body, for carrying me through today.
moon|g|I am grateful for this quiet moment.
water|g|Gratitude turns what we have into enough.
water|g|Thank you for every glass of water, every deep breath.
grass|g|Three good things today. Start with the smallest one.
grass|g|I’m grateful for the person I’m becoming.
moss|g|He who knows he has enough is rich.|Lao Tzu, Tao Te Ching 33 (paraphrase)|Taoism
moss|g|Thank you, legs and lungs, for showing up.
ribbon|g|Receive without conceit, release without struggle.|Marcus Aurelius (paraphrase)|Stoicism
ribbon|g|Today, I’m thankful for a little more ease.
petal|g|Gratitude is not only the greatest of virtues, but the parent of all the others.|Cicero|Philosophy
petal|g|Notice one beautiful thing right now, and say thank you.
sun|g|Thank you, sunshine, for the energy.
sun|g|He is wise who does not grieve for what he lacks, but rejoices in what he has.|Epictetus (paraphrase)|Stoicism
goddess|g|I thank my body for all it can do.
goddess|g|Thank you to everyone who made today a little brighter.
wind|g|Take a breath and thank it for being here.
wind|g|It is not the one who has too little, but the one who craves more, who is poor.|Seneca (paraphrase)|Stoicism
sun|g|Writing down three good things a day can lift your mood. Try it tonight.|Positive psychology (Seligman, 2005)|Psychology
water|g|I am grateful for this body, this breath, this day.`.split("\n").forEach(l=>{const[e,t,q,a,s]=l.split("|");QX.push({e,t,q,a:a||"",s:s||""})});
export const EL: Record<string, string> = {moon:"Moon",water:"Water",grass:"Sprout",moss:"Earth",ribbon:"Flow",petal:"Bloom",sun:"Sun",goddess:"Goddess",wind:"Air"};
export const TL: Record<string, string> = { i: "Inspiration", c: "Compliments", w: "Wisdom", g: "Gratitude" };
export const PE: Record<PhaseKey, string[]> = {menstrual:["moon","water","ribbon"],follicular:["grass","moss","ribbon"],ovulation:["petal","sun","goddess"],luteal:["wind","ribbon","water","moon"]};
export const HM: Record<PhaseKey, string> = {menstrual:"Estrogen and progesterone are at their lowest and testosterone is low and steady. Energy and mood can dip, mostly on days 1–2.",follicular:"Estrogen climbs steadily, which is linked to rising energy, mood and motivation.",ovulation:"Estrogen peaks and LH triggers ovulation; testosterone has a small, variable rise. Many people feel more confident and social.",luteal:"Progesterone rises, then falls with estrogen if there’s no pregnancy. A sharp drop before the period is linked to PMS symptoms in sensitive people."};
export const MIND: Record<PhaseKey, { chem: string; fact: string; tips: string[] }> = {menstrual:{chem:"Low estrogen & progesterone",fact:"Estrogen supports serotonin and dopamine signalling, so low-estrogen days can feel flatter for some people. Prostaglandins drive cramps and tiredness.",tips:["Lower the bar: pick 1–3 must-do tasks and call that a win.","Warmth, sunlight and gentle movement help both pain and mood.","Self-compassion break: hand on chest, “This is hard, and it’s okay to rest.”"]},
follicular:{chem:"Rising estrogen → serotonin & dopamine",fact:"Rising estrogen is associated with more dopamine and serotonin activity, often felt as drive, curiosity and optimism.",tips:["Use the momentum: start or plan something new.","Make an if–then plan: “If it’s 7 pm Tuesday, then I train.”","Pair new habits with a small reward to feed dopamine’s learning loop."]},
ovulation:{chem:"Peak estrogen, LH & testosterone bump",fact:"Many people report more confidence, verbal fluency and sociability around ovulation; the effect varies a lot between individuals.",tips:["Schedule conversations or social plans if you feel like it.","Channel energy into a challenging session, and protect your sleep.","Write 3 specific good things from today (a gratitude practice that lifts positive mood)."]},
luteal:{chem:"Progesterone ↑ then ↓ (allopregnanolone, GABA)",fact:"Allopregnanolone, a progesterone metabolite, acts on calming GABA-A receptors. The drop before your period can make some people more stress-sensitive or irritable (PMS/PMDD).",tips:["When tension rises, try cyclic sighing for 2–5 minutes (below).","Cut decisions and overcommitting; routines and lists lower mental load.","Name it: “I feel irritable, and the timing is likely hormonal.” Labelling feelings dampens their intensity.","Regular meals, less caffeine, steady bedtime."]}};
export const MF: [string, string, string][] = [["Dopamine","Dopamine is about anticipating reward more than enjoying it. Break goals into small visible steps and tick them off to give your brain frequent progress signals.","Write the next 3 tiny steps for one goal."],
["Serotonin & light","Morning daylight and regular exercise support body-clock regulation and are linked to better mood.","Get 10–20 minutes outside within an hour of waking."],
["Cortisol & breathing","In a 2023 Stanford trial (Balban et al.), 5 min/day of cyclic sighing improved mood more than mindfulness meditation.","Try the 1-minute breathing guide below."],
["Affect labelling","Putting feelings into words reduces amygdala activity (Lieberman et al., 2007).","Say it: “I feel ___, about 6/10.”"],
["Reappraisal","Reframing a situation (“what else could this mean?”) reduces negative emotion more durably than suppressing it (Gross).","Write one alternative explanation for what’s bothering you."],
["If–then plans","Implementation intentions meaningfully improve follow-through (Gollwitzer & Sheeran 2006, d≈0.65).","Finish: “If ___ happens, then I will ___.”"],
["Gratitude","Writing down specific good things has small-to-moderate effects on wellbeing (Emmons & McCullough, 2003).","List 3 specific good things from today."],
["Nature & stress","About 20 minutes in a green space lowers cortisol (Hunter et al., 2019).","Take a 20-minute walk without your phone."],
["Sleep & emotion","Sleep loss amplifies amygdala reactivity to negative stimuli (Yoo et al., 2007).","Keep a fixed wake-up time for 3 days."],
["Self-compassion","Treating yourself like a friend is linked to lower anxiety and more resilience (Neff).","Ask: what would I tell a friend here?"],
["Behavioural activation","When mood is low, doing a small valued activity first often brings motivation afterwards, not before.","Do one 5-minute activity you usually enjoy."],
["Connection & oxytocin","Warm touch and social contact are associated with oxytocin release and lower stress.","Message someone you trust, or hug someone."],
["Expressive writing","Writing about a stressful event for 15–20 minutes on a few days modestly improves wellbeing (Pennebaker).","Write freely for 10 minutes, then close the page."]];
export const fmt = (s: number) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
const slow=(t: number)=>.62+.2*(.5-.5*Math.cos(t/8*2*Math.PI)),scrp=(P: [number, string][])=>(t: number): [string, number]=>{let x=P[0][1];for(const[s,l]of P)if(t>=s)x=l;return[x,slow(t)]};
export interface Practice { n: string; dur: number; d: string; w?: string; f: (t: number) => [string, number] }
export const PR: Record<string, Practice> = {cyc:{n:"1-minute reset",dur:60,d:"Cyclic sighing: two inhales through the nose, then one long exhale through the mouth.",f:t=>{const c=t%11;return c<4?["Inhale through the nose",.55+.3*(c/4)]:c<5?["Inhale again, a little more",.85+.15*(c-4)]:["Long, slow exhale through the mouth",1-.45*((c-5)/6)]}},
box:{n:"Quadrant breathing",dur:120,d:"Box breathing: inhale 4 · hold 4 · exhale 4 · hold 4, through the nose.",f:t=>{const c=t%16;return c<4?["Inhale · 4",.55+.45*(c/4)]:c<8?["Hold · 4",1]:c<12?["Exhale · 4",1-.45*((c-8)/4)]:["Hold · 4",.55]}},
kap:{n:"Kapalabhati",dur:90,d:"“Skull-shining” breath: short, sharp exhales through the nose with a passive inhale. 3 rounds of 20 s, with 10 s rests.",w:"Skip if pregnant, or with high blood pressure, heart or lung conditions, hernia, recent abdominal surgery or epilepsy. Stop if you feel dizzy. Learn it from a qualified teacher first.",f:t=>{const c=t%30,r=Math.floor(t/30)+1;return c<20?[`Round ${r}/3 · sharp exhale, soft inhale`,.78+.2*Math.cos(c/.7*2*Math.PI)]:[`Round ${r}/3 · rest and breathe normally`,slow(c)]}},
mb:{n:"Mindful breathing",dur:180,d:"A 3-minute mindfulness practice: follow the breath and gently return when the mind wanders.",f:scrp([[0,"Sit comfortably. Let your eyes soften."],[20,"Notice where you feel the breath most: nose, chest or belly."],[60,"When the mind wanders, notice it, and gently return to the breath."],[120,"Let the breath breathe itself. Rest in the sensation."],[165,"Take one deeper breath, then open your eyes."]])},
bs:{n:"Body scan",dur:300,d:"A 5-minute scan from feet to head, noticing sensations without trying to change them.",f:scrp([[0,"Settle. Feel the weight of your body being supported."],[25,"Bring attention to your feet and toes."],[60,"Move up through the calves and knees."],[100,"Thighs, hips and lower back."],[140,"Belly and chest: feel them rise and fall."],[180,"Hands, arms and shoulders. Let them soften."],[225,"Neck, jaw and face. Unclench."],[270,"Feel the whole body at once, then open your eyes."]])},
gr:{n:"5-4-3-2-1 grounding",dur:120,d:"A sensory grounding practice that anchors you in the present moment.",f:scrp([[0,"Name 5 things you can see."],[25,"Name 4 things you can feel or touch."],[50,"Name 3 things you can hear."],[75,"Name 2 things you can smell."],[95,"Name 1 thing you can taste. Then take a slow breath."]])},
mt:{n:"Loving-kindness",dur:180,d:"A short metta meditation: silently offering good wishes to others and to yourself.",f:scrp([[0,"Settle and soften your face and shoulders."],[20,"Picture someone you care about. Silently: may you be happy, may you be healthy, may you be at ease."],[70,"Turn it to yourself: may I be kind to myself, may I be at ease."],[130,"Widen it to everyone: may all beings be well."],[170,"Rest, then open your eyes."]])}};
// Same order as the widgets appear on the Cycle tab.
export const WID: [string, string][] = [["per","Period tracker"],["horm","Hormone levels"],["quote","Quotes"],["today","Today"],["tips","Eat · Sports · Do"],["mind","Mind & brain"],["fact","Daily fact"],["reset","Breathing & meditation"]];
