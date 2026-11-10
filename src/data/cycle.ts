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
// Quotes: short, warm, motivating; wisdom lines from psychology, philosophy and science (with source). e|type|quote|author|tradition
export const QX: Quote[] = `sun|i|You’re absolutely capable of creating the life you can’t stop thinking about.
goddess|i|Decisions are portals.
petal|c|I am not afraid to be seen trying.
moss|i|You can do hard things.
sun|i|What if it all works out?
grass|i|The more you do it, the easier it becomes.
ribbon|w|The things we do do things to us.
grass|i|Dream big, start small, act daily.
moss|c|Take your time.
petal|c|I love myself.
sun|c|I do epic shit.
moss|w|We are what we repeatedly do. Excellence, then, is not an act but a habit.|Will Durant, on Aristotle|Philosophy
goddess|c|I am proud of myself.
petal|c|You are worthy of all good things.
grass|i|It’s not hard, it’s just new.
wind|i|Nothing changes if nothing changes.
wind|c|Taking a different path is very brave of you.
water|i|Just keep moving.
sun|c|You can and you will.
moon|i|But did you die?
sun|i|The loudest flex? Results.
ribbon|c|You’re doing better than your thoughts say.
ribbon|w|Don’t believe all your thoughts.
sun|c|I always end up in cool places, doing cool things.
grass|i|If you fail, congratulations: most people don’t even try.
wind|i|Do what scares you until it doesn’t.
goddess|i|Success is a decision.
moss|i|Discipline beats motivation every time.
grass|i|A winner is just a loser who tried one more time.
goddess|c|My potential has no limits.
water|c|I forgive myself for everything.
moss|w|Discipline is choosing your future over your impulses.
petal|c|People like you are rare.
moss|i|Show up every day and the results won’t have a choice.
petal|c|Be too much!
wind|i|Starve your distractions, feed your focus.
wind|i|Either the fear goes away or the opportunity does.
moon|w|Do you like the reason why you’re tired?
sun|i|You only live once.
goddess|c|Trust your vision.
grass|i|1% better every day.
sun|i|Energy is contagious.
moss|i|Results require routine.
water|i|I wanna see what happens if I don’t give up.
wind|i|Who cares?
water|w|Action cures anxiety.
ribbon|w|You don’t have to react to everything you notice.
sun|i|Keep doing, fear nothin’.
goddess|w|Reality is created by the mind.
petal|c|I’m too sexy for all this stress.
ribbon|c|Messy authenticity over fake perfection.
grass|i|Every try matters.
moss|w|Discipline is self-love in action.
water|c|It’s okay to be scared.
water|c|It’s okay to be anxious.
wind|c|It’s okay to be angry.
ribbon|c|All emotions are okay.
goddess|c|Be a people unpleaser.
sun|i|Enjoy the now.
wind|w|Worry is a misuse of your imagination.|Dan Zadra|Wisdom
goddess|c|Be yourself so the people looking for you can find you.
moon|c|Due to not wanting to, I will not. Thanks.
ribbon|i|Life got so serious, I forgot I love dancing.
sun|c|I’ve got my spark back.
moon|c|May all your delulu become trululu.
petal|c|Woke up sexy as hell again.
moon|i|Tonight, rest is the most productive thing you can do.
water|i|Rest. Breathe. Begin again.
grass|i|Tiny steps still count as steps.
petal|i|You don’t have to be perfect to be wonderful.
goddess|i|Grace and strength belong together.
sun|i|Radiate, then rest. Both are power.
water|i|Flow around what you can’t move.
petal|i|Bloom in your own time.
sun|i|Let today be a good day to start again.
goddess|i|Walk like you already trust yourself.
moon|c|You are doing great, sweetheart.
moon|c|Be proud of how far you have come.
water|c|You are softer and stronger than you give yourself credit for.
water|c|There’s no one quite like you.
grass|c|Keep going, you’re closer than you think.
grass|c|Look at you, growing every single day.
moss|c|You’re stronger than you feel right now.
ribbon|c|Your pace is the right pace.
ribbon|c|Your intuition is sharper than you think. Trust it.
petal|c|You light up a room without trying.
sun|c|You’ve got this, and I believe in you.
goddess|c|You are enough, exactly as you are.
goddess|c|You are allowed to be soft and powerful at the same time.
wind|c|You handle more than anyone sees, and you do it with grace.
moon|c|You deserve the same kindness you give others.
grass|w|Act as if what you do makes a difference. It does.|William James|Psychology
ribbon|w|The curious paradox is that when I accept myself just as I am, then I can change.|Carl Rogers|Psychology
ribbon|w|You have power over your mind, not outside events. Realise this, and you will find strength.|Marcus Aurelius (paraphrase)|Stoicism
wind|w|We suffer more often in imagination than in reality.|Seneca|Stoicism
water|w|Fall seven times, stand up eight.|Japanese proverb|Zen
water|w|Nothing in the world is softer than water, yet nothing is better at wearing down the hard.|Lao Tzu, Tao Te Ching 78|Taoism
grass|w|A journey of a thousand miles begins with a single step.|Lao Tzu|Taoism
moss|w|Nature does not hurry, yet everything is accomplished.|Lao Tzu|Taoism
moss|w|The obstacle is the path.|Zen proverb|Zen
wind|w|You are the sky. Everything else is just the weather.|Pema Chödrön|Buddhism
sun|w|In the midst of chaos, there is also opportunity.|Sun Tzu (attributed)|Martial arts
goddess|w|Knowing yourself is the beginning of all wisdom.|Aristotle (attributed)|Philosophy
goddess|w|Who looks outside, dreams; who looks inside, awakes.|Carl Jung|Psychology
sun|w|The privilege of a lifetime is to become who you truly are.|Carl Jung (attributed)|Psychology
wind|w|Between stimulus and response there is a space. In that space is our power to choose.|Viktor Frankl (attributed)|Psychology
goddess|w|He who has a why to live can bear almost any how.|Friedrich Nietzsche|Philosophy
petal|w|The happiness of your life depends on the quality of your thoughts.|Marcus Aurelius|Stoicism
moss|w|Waste no more time arguing what a good person should be. Be one.|Marcus Aurelius|Stoicism
grass|w|It does not matter how slowly you go, as long as you do not stop.|Confucius (attributed)|Philosophy
grass|w|The best time to plant a tree was 20 years ago. The second best time is now.|Proverb|Wisdom
wind|w|The cave you fear to enter holds the treasure you seek.|Joseph Campbell|Philosophy
water|w|Motivation often comes after you start, not before. Begin, and the feeling follows.|Behavioural activation research|Psychology
ribbon|w|Name it to tame it: putting a feeling into words calms the brain’s alarm.|Lieberman et al. 2007|Neuroscience
grass|w|Neurons that fire together wire together. Every repeat makes it easier.|Donald Hebb 1949|Neuroscience
moss|w|New habits take about 66 days on average to feel automatic. Be patient with day 12.|Lally et al. 2010|Psychology
petal|w|Being kind to yourself after a mistake makes you more likely to try again.|Breines & Chen 2012|Psychology
sun|w|Nervous? Say “I’m excited.” Your body can’t tell the two apart, and it helps.|Brooks 2014|Psychology
grass|w|Abilities grow with effort and good strategies. That’s a growth mindset.|Carol Dweck|Psychology
water|w|One workout can lift your mood and lower anxiety for hours afterwards.|Exercise psychology research|Science
moon|w|Sleep turns today’s practice into tomorrow’s skill.|Walker et al. 2002|Neuroscience
sun|w|An object in motion stays in motion. Start, and keep rolling.|Newton’s first law|Physics
wind|w|Energy is never lost, only changed. Turn stress into fuel.|First law of thermodynamics|Physics
grass|w|1.01 to the power of 365 is about 37. Small daily gains add up to big change.|Maths of compounding|Maths
moon|g|Thank you, body, for carrying me through today.
moon|g|I am grateful for this quiet moment.
water|g|Gratitude turns what we have into enough.
grass|g|Three good things today. Start with the smallest one.
grass|g|I’m grateful for the person I’m becoming.
moss|g|He who knows he has enough is rich.|Lao Tzu, Tao Te Ching 33 (paraphrase)|Taoism
moss|g|Thank you, legs and lungs, for showing up.
ribbon|g|Today, I’m thankful for a little more ease.
petal|g|Gratitude is not only the greatest of virtues, but the parent of all the others.|Cicero|Philosophy
petal|g|Notice one beautiful thing right now, and say thank you.
sun|g|Thank you, sunshine, for the energy.
sun|g|He is wise who does not grieve for what he lacks, but rejoices in what he has.|Epictetus (paraphrase)|Stoicism
goddess|g|I thank my body for all it can do.
goddess|g|Thank you to everyone who made today a little brighter.
wind|g|Take a breath and thank it for being here.
sun|g|Writing down three good things a day can lift your mood. Try it tonight.|Seligman et al. 2005|Psychology
water|g|I am grateful for this body, this breath, this day.`.split("\n").map(l=>{const[e,t,q,a,s]=l.split("|");return{e,t,q,a:a||"",s:s||""}});
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
["Expressive writing","Writing about a stressful event for 15–20 minutes on a few days modestly improves wellbeing (Pennebaker).","Write freely for 10 minutes, then close the page."],
// Short practices from psychotherapy (CBT, DBT, ACT and others), each with the finding behind it.
["Defusion · ACT","Adding “I’m having the thought that…” in front of a harsh thought makes it feel less believable and less upsetting (Masuda et al., 2004).","Pick one harsh thought and say it with “I’m having the thought that…” in front."],
["Worry time · CBT","Postponing worries to one set 15-minute slot reduces how much time you spend worrying during the day (Borkovec et al., 1983).","Write today’s worry down and save it for a 15-minute worry slot this evening."],
["Thought record · CBT","Writing a thought down and checking the evidence for and against it is a core CBT tool with strong evidence for anxiety and low mood.","Write one upsetting thought, then one fact that supports it and one that doesn’t."],
["Opposite action · DBT","Doing the opposite of what an unhelpful emotion urges (hiding, snapping) can turn the emotion down (Linehan, DBT).","Feel like hiding? Send one message or step outside for 5 minutes."],
["Cold water · DBT","Cool water on the face triggers the diving reflex, which slows the heart within seconds; DBT uses it to ride out intense distress. Skip it with heart conditions.","Hold a cool, wet cloth on your face for 30 seconds while holding your breath gently."],
["Half-smile · DBT","Softening the face into a slight smile can nudge mood (facial feedback); a large 2022 study found a small but real effect (Coles et al.).","Relax your forehead and jaw and let a half-smile sit there for one minute."],
["Values · ACT","Small actions in line with what matters to you raise wellbeing even when mood stays low (ACT research).","Name one value (kindness, health, curiosity) and do a 2-minute act for it today."],
["Problem solving · PST","Breaking a problem into options and one first step reduces stress and low mood (problem-solving therapy, Bell & D’Zurilla, 2009).","Write the problem in one line, list 3 options, then do the smallest first step."],
["Muscle relaxation · PMR","Tensing and then releasing muscle groups lowers anxiety (Manzoni et al., 2008).","Clench your fists for 5 seconds, release for 10; repeat with shoulders and jaw."],
["Best possible self","Writing for a few minutes about your life going well in the future lifts optimism and mood (King, 2001; Meevissen et al., 2011).","Write for 5 minutes about a good day one year from now."],
["Savouring","Pausing to fully notice a good moment strengthens positive feelings (Bryant & Veroff).","Next nice moment today, stop for 20 seconds and take in every detail."],
["Leaves on a stream · ACT","Watching thoughts come and go without engaging with them reduces their pull (a classic ACT mindfulness exercise).","Close your eyes for 2 minutes and place each thought on a leaf floating away."],
["Self-talk in 3rd person","Talking to yourself by your own name creates distance and calms emotional reactions quickly (Kross et al., 2014).","Ask: “What does [your name] need right now?”"],
["Butterfly hug","Crossing your arms and tapping your shoulders left-right is used in trauma therapy (EMDR) as a quick self-soothing tool.","Cross your arms, hands on shoulders, and tap slowly left-right for one minute."]];
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
export const WID: [string, string][] = [["per","Period tracker"],["horm","Hormone levels"],["quote","Quotes"],["today","Today"],["tips","Tips"],["fact","Daily practice"],["reset","Breathing & meditation"]];

/** Titles for the phase tips (same order as PH[...].eat / sport / do and MIND[...].tips). */
const CTH: Record<PhaseKey, { eat: string[]; sport: string[]; do: string[]; mind: string[] }> = {
menstrual:{eat:["Refill iron","Omega-3 and magnesium","Warm and hydrated"],sport:["Gentle movement helps","Lift if you feel well","Let symptoms guide you"],do:["Ease the cramps","Sleep 7–9 hours","When to see a doctor"],mind:["Why it can feel flatter","Lower the bar","Warmth and light","Be kind to yourself"]},
follicular:{eat:["Protein for progress","Carbs around training","Keep iron in"],sport:["Go harder this week","Add a little load","Small, personal effects"],do:["Plan focused work","Check in with yourself"],mind:["Drive and curiosity","Use the momentum","Make an if–then plan","Reward new habits"]},
ovulation:{eat:["Colour and fibre","No need to restrict","Calcium"],sport:["Power feels good","Warm up your knees"],do:["A mid-cycle twinge","Not for contraception"],mind:["Confident and social","Be social if you like","Channel the energy","Three good things"]},
luteal:{eat:["Hungrier is normal","Carbs and protein steady you","Calcium and vitamin D","Go easy on alcohol and salt"],sport:["Moderate and steady","Ease off late in the phase"],do:["Protect your sleep","Severe mood? Get support"],mind:["Why stress hits harder","Try cyclic sighing","Fewer decisions","Name the feeling","Steady routines"]}};
/** Body and brain facts (biology, physics, chemistry), shown under Mind & brain in every phase. [title, text] */
export const BODYF: [string, string][] = [
["Your brain runs on about 20 watts","The brain is about 2% of your weight but uses about 20% of your energy, like a dim light bulb. Skipping meals can blunt focus for that reason."],
["A little water, a lot of focus","Losing just 1–2% of body water (about 1 litre for a 60 kg person) can lower attention and mood. Sip through the day, not all at once."],
["Breathe out to calm down","A long exhale slows the heart through the vagus nerve. Breathe out longer than you breathe in, for example in for 4, out for 6."],
["Muscles make mood chemicals","Working muscles release myokines and raise BDNF, a protein that helps brain cells grow and connect. One reason a workout lifts your mood."],
["Light sets your body clock","Morning light reaches special cells in your eyes that set your inner clock: more alert by day, sleepier at night. Ten minutes outside helps."],
["Sleep cleans the brain","In deep sleep, fluid flow through the brain rises and washes out waste. That foggy feeling after a short night has a real cause."],
["Nerves faster than a race car","Fast nerve signals travel up to about 120 m/s, over 400 km/h. That’s how your hand pulls back from heat before you even feel the pain."],
["Your morning cortisol boost","Cortisol peaks 30–45 minutes after waking to get you going. It’s not the enemy; it’s your built-in morning coffee."],
["Bones are alive","About 10% of your skeleton is rebuilt each year. Lifting and jumping tell bone to grow denser, which matters more with age."],
["Your gut talks to your brain","About 90% of the body’s serotonin is made in the gut. Fibre feeds the bacteria that help keep that system healthy."],
["Iron carries your oxygen","Each red blood cell holds about 270 million haemoglobin molecules, and each grabs oxygen with iron. Low iron means less oxygen, and you feel it as tiredness."],
["Practice rewires you","When you repeat a skill, the nerve paths you use get insulated with myelin, so signals run faster. Practice literally speeds you up."],
];
export const CT_TOPICS: [string, string][] = [["eat","Eat"],["sport","Sports"],["do","Do"],["mind","Mind & brain"]];
export interface CTip { t: string; h: string; b: string }
/** Tips for a phase (Eat, Sports, Do, Mind & brain), optionally only some topics. */
export function ctList(k: PhaseKey, only: string[] = []): CTip[] {
  const x = PH[k], m = MIND[k], h = CTH[k];
  const all: CTip[] = [
    ...x.eat.map((b, i) => ({ t: "eat", h: h.eat[i], b })),
    ...x.sport.map((b, i) => ({ t: "sport", h: h.sport[i], b })),
    ...x.do.map((b, i) => ({ t: "do", h: h.do[i], b })),
    ...[m.fact, ...m.tips].map((b, i) => ({ t: "mind", h: h.mind[i], b })),
    ...BODYF.map(([h, b]) => ({ t: "mind", h, b })),
  ];
  const L = only.length ? all.filter(y => only.includes(y.t)) : all;
  return L.length ? L : all;
}

/**
 * What the hormone chart means today, per phase. {E} {P} {T} are estrogen, progesterone and testosterone,
 * shown in their line colours, so the sentence doubles as the legend's explanation.
 */
export const HX: Record<PhaseKey, string> = {
menstrual:"Low {E} and {P} can make energy and mood dip, mostly on days 1–2. Rest is productive now.",
follicular:"Rising {E} is linked to more energy, a better mood and motivation, a good time to start things.",
ovulation:"Peak {E} and a small rise in {T} help many people feel more confident, social and strong.",
luteal:"{P} is calming but can bring tiredness and cravings; when it falls with {E} before your period, PMS symptoms can show up."};
