// Exercise library, animation poses, equipment and cardio definitions.
// EX: id -> [name, primary muscles, secondary muscles, rep range, cues separated by |]
/* eslint-disable */
export type Ex = [string, string, string, string, string];
// name, primary, secondary, rep range, cues  (gl glutes qd quads ha hamstrings ca calves ad abductors lb low back ba back de delts ch chest bi biceps tr triceps)
export const EX: Record<string, Ex> = {
mht:["Machine hip thrust","gl","ha,qd","8-12","Upper back on the pad, feet hip-width, shins near vertical at the top.|Chin tucked, ribs down; drive through the heels.|Full lockout, squeeze glutes 1 s, lower slowly."],
hyp:["45° hyperextension","gl,ha","lb","10-15","Pad at the hip crease so you hinge at the hips, not the waist.|Lower with a flat back to about 90°, then squeeze glutes until body is a straight line.|Don’t hyper-arch the lower back; hold a plate to progress."],
bss:["Bulgarian split squat","qd,gl","ha","8-12","Rear foot on a bench, front foot about 60–70 cm ahead.|Lean torso slightly forward to load glutes more; keep front heel planted.|Lower until the front thigh is parallel; do equal reps each leg."],
sht:["Single-leg hip thrust","gl","ha","8-12","Shoulder blades on a bench, one foot flat, other knee up or leg extended.|Keep pelvis level, ribs down.|Drive through the heel, squeeze glute at the top, lower under control."],
lp:["Leg press (high stance)","gl,qd","ha","8-12","Feet high and shoulder-width or slightly wider on the platform.|Lower until knees are ~90° without the tailbone lifting off the seat.|Push through mid-heel; don’t slam-lock the knees."],
abd:["Hip abduction machine","ad,gl","","12-20","Lean slightly forward to bias the glutes.|Push knees out through the full range, pause 1 s.|Return slowly; don’t bounce off the stack."],
crow:["Close-grip cable row","ba","bi","8-12","Chest tall, small lean back, neutral spine.|Pull the handle to lower ribs with elbows close to the body.|Squeeze shoulder blades, return slowly, don’t rock."],
lr:["Lateral raise machine","de","","10-20","Align shoulder joints with the machine pivot.|Raise with elbows leading to shoulder height.|Don’t shrug; lower slowly."],
bcm:["Biceps curl machine","bi","","10-15","Elbows on the pad, aligned with the pivot.|Curl to a full squeeze, lower over 2–3 s.|Keep shoulders down, no body swing."],
wrow:["Wide-grip row machine","ba,de","bi","8-12","Chest on the pad, shoulders down.|Pull elbows out wide to the sides to hit upper back and rear delts.|Pause and squeeze, control the return."],
lpd:["Lat pulldown machine","ba","bi","8-12","Thighs locked under the pad, slight lean back, chest up.|Pull to the upper chest, driving elbows down and back.|Control the way up; don’t swing."],
pd:["Triceps pushdown","tr","","10-15","Elbows pinned to your ribs.|Push to full extension and squeeze.|Return until forearms are ~90°; keep torso still."],
kb:["Dumbbell triceps kickback","tr","","10-15","Hinge forward, upper arm parallel to the floor.|Extend only at the elbow; upper arm stays still.|Use light weight and strict form."],
ote:["Overhead triceps extension machine","tr","","10-15","Upper arms fixed, elbows pointing forward.|Extend fully; get a deep stretch on the way back.|Don’t let elbows flare."],
otd:["Dumbbell overhead triceps extension","tr","","10-15","Hold one dumbbell with both hands, elbows by your ears.|Lower behind the head to a deep stretch, then extend.|Ribs down; don’t arch."],
ez:["EZ-bar curl","bi","","8-12","Elbows at your sides, shoulders back.|Curl without swinging; no hip drive.|Lower fully over 2–3 s."],
sbc:["Seated dumbbell curl","bi","","8-12","Sit with back supported on the bench.|Rotate palms up as you curl.|Full stretch at the bottom; alternate or both arms."],
calf:["Leg press calf raise","ca","","12-20","Balls of feet on the lower platform edge, knees soft.|Lower heels for a full stretch, press up as high as possible.|Pause 1 s at the top; no bouncing."],
slc:["Seated leg curl","ha","","10-15","Pad just above the heels, back flat on the seat.|Curl fully and squeeze.|Return over 2–3 s; keep hips down."],
le:["Leg extension","qd","","10-15","Knee joint aligned with the machine pivot.|Extend fully and squeeze the quads.|Lower slowly; avoid jerking."],
sq:["Back squat","qd,gl","ha","6-10","Bar on upper back, feet shoulder-width, brace your core.|Sit down and back, knees track over toes.|Hips to parallel or below, drive through mid-foot."],
rdl:["Romanian deadlift","ha,gl","lb","6-10","Soft knees, bar close to the legs.|Push hips back with a neutral spine until hamstrings stretch.|Squeeze glutes to stand tall."],
bp:["Bench press","ch","tr,de","6-10","Shoulder blades pinched, feet planted.|Lower to mid-chest, elbows ~45–60°.|Press up and slightly back."]};
export const MN: Record<string, string> = {gl:"Glutes",qd:"Quads",ha:"Hamstrings",ca:"Calves",ad:"Abductors",lb:"Lower back",ba:"Back",de:"Delts",ch:"Chest",bi:"Biceps",tr:"Triceps"};
export const SPL: Record<string, { n: string; d: string; seq: string[]; f: number }> = {ul:{n:"Upper / Lower",d:"Alternates lower-body and upper-body days.",seq:["Lower Body A","Upper Body A","Lower Body B","Upper Body B"],f:2},fb:{n:"Full body",d:"Train the whole body every session.",seq:["Full Body A","Full Body B","Full Body C"],f:1},ppl:{n:"Push / Pull / Legs",d:"Pressing, pulling and leg days.",seq:["Push","Pull","Legs"],f:3}};
export const PL: Record<string, string[]> = {"Lower Body A":["mht","bss","lp","hyp","abd","calf"],"Lower Body B":["sht","rdl","slc","le","abd","calf"],"Upper Body A":["lpd","crow","wrow","lr","bcm","pd"],"Upper Body B":["bp","wrow","lr","ez","ote","kb"],"Full Body A":["lp","bp","lpd","slc","lr","pd"],"Full Body B":["mht","wrow","bss","lr","ez","ote"],"Full Body C":["sq","bp","lpd","hyp","calf","kb"],"Push":["bp","lr","pd","ote","kb","otd"],"Pull":["lpd","crow","wrow","ez","sbc","bcm"],"Legs":["mht","bss","lp","slc","le","calf","abd"],"Custom workout":[]};
// animated schematic figures: key points per pose (shoulder, hip, ankle, wrist …), kh/eh = knee/elbow bend direction
const BN=[[19,65,38,65],[22,65,22,74],[35,65,35,74]],SEAT=[[28,60,54,60],[40,60,40,74],[24,34,30,60]],LPS=[[10,36,25,60],[25,62,36,62]],CH=[[38,59,54,59],[46,59,46,74],[40,36,40,58]];
export const AN: Record<string, any> = {
mht:{st:BN,kh:[.4,-1],eh:[0,1],a:{sh:[30,62],hip:[49,68],ank:[65,74],wr:[46,62]},b:{sh:[29,61],hip:[49,56],ank:[65,74],wr:[46,56]},pr:[["hip","o"]]},
hyp:{st:[[40,52,40,74],[33.6,54.4,43.8,47.9]],kh:[0,1],eh:[0,1],a:{sh:[58,58],hip:[46,42],ank:[17,60],wr:[60,54]},b:{sh:[63,31],hip:[46,42],ank:[17,60],wr:[64,36]}},
bss:{st:[[12,60,30,60],[16,60,16,74],[27,60,27,74]],kh:[1,0],kh2:[0,1],eh:[0,1],a:{sh:[50,22],hip:[46,42],ank:[58,74],a2:[24,58],wr:[51,43]},b:{sh:[45,37],hip:[41,57],ank:[58,74],a2:[24,58],wr:[47,58]},pr:[["wr","d"]]},
sht:{st:BN,kh:[.4,-1],eh:[0,1],a:{sh:[30,62],hip:[49,68],ank:[65,74],a2:[66,56],wr:[46,62]},b:{sh:[29,61],hip:[49,56],ank:[65,74],a2:[80,45],wr:[46,56]},pr:[["hip","o"]]},
lp:{st:LPS,kh:[.3,-1],eh:[0,1],a:{sh:[15,43],hip:[28,58],ank:[56,40],wr:[28,52]},b:{sh:[15,43],hip:[28,58],ank:[44,46],wr:[28,52]},pr:[["ank","p"]]},
abd:{F:1,st:[[40,58,60,58],[50,58,50,74]],eh:[1,.4],eh2:[-1,.4],a:{sh:[58,26],sh2:[42,26],hip:[50,52],kn:[54,58],kn2:[46,58],ank:[54,73],ank2:[46,73],wr:[64,46],wr2:[36,46]},b:{sh:[58,26],sh2:[42,26],hip:[50,52],kn:[66,58],kn2:[34,58],ank:[68,73],ank2:[32,73],wr:[64,46],wr2:[36,46]},pr:[["kn","q"],["kn2","q"]]},
crow:{st:[[28,67,46,67],[68,60,68,74]],kh:[0,-1],eh:[-1,.5],a:{sh:[46,47],hip:[40,66],ank:[68,70],wr:[62,56]},b:{sh:[38,46],hip:[40,66],ank:[68,70],wr:[46,60]},pr:[["wr","c",[92,60]]]},
wrow:{st:[[36,58,50,58],[43,58,43,74],[50,30,50,46]],kh:[1,-.2],eh:[-1,-.3],a:{sh:[46,37],hip:[44,57],ank:[58,74],wr:[66,40]},b:{sh:[46,37],hip:[44,57],ank:[58,74],wr:[54,40]},pr:[["wr","c",[84,40]]]},
lr:{F:1,st:[[40,58,60,58],[50,58,50,74]],eh:[1,.5],eh2:[-1,.5],a:{sh:[58,26],sh2:[42,26],hip:[50,52],kn:[56,58],kn2:[44,58],ank:[56,73],ank2:[44,73],wr:[60,48],wr2:[40,48]},b:{sh:[58,26],sh2:[42,26],hip:[50,52],kn:[56,58],kn2:[44,58],ank:[56,73],ank2:[44,73],wr:[80,27],wr2:[20,27]},pr:[["wr","q"],["wr2","q"]]},
bcm:{st:[[47,42,58,52],[38,56,54,56],[46,56,46,74]],kh:[1,-.2],eh:[.3,1],a:{sh:[44,32],hip:[46,54],ank:[54,74],wr:[59,48]},b:{sh:[44,32],hip:[46,54],ank:[54,74],wr:[54,29]},pr:[["wr","o"]]},
lpd:{st:[[36,63,56,63],[46,63,46,74],[52,54,64,54]],kh:[.5,-1],eh:[-.5,1],a:{sh:[43,42],hip:[46,62],ank:[60,74],wr:[50,21]},b:{sh:[43,42],hip:[46,62],ank:[60,74],wr:[51,38]},pr:[["wr","c",[62,-2]]]},
pd:{st:[],kh:[1,0],eh:[-.3,1],a:{sh:[46,20],hip:[46,40],ank:[46,74],wr:[57,28]},b:{sh:[46,20],hip:[46,40],ank:[46,74],wr:[50,41]},pr:[["wr","c",[62,-2]]]},
kb:{st:[],kh:[1,0],eh:[-1,-.5],a:{sh:[53,34],hip:[36,44],ank:[48,74],wr:[43,47]},b:{sh:[53,34],hip:[36,44],ank:[48,74],wr:[31,38]},pr:[["wr","d"]]},
ote:{st:CH,kh:[1,-.2],eh:[.3,-1],a:{sh:[44,38],hip:[46,58],ank:[56,74],wr:[37,32]},b:{sh:[44,38],hip:[46,58],ank:[56,74],wr:[52,17]},pr:[["wr","c",[86,10]]]},
otd:{st:CH,kh:[1,-.2],eh:[.3,-1],a:{sh:[44,38],hip:[46,58],ank:[56,74],wr:[37,32]},b:{sh:[44,38],hip:[46,58],ank:[56,74],wr:[52,17]},pr:[["wr","d"]]},
ez:{st:[],kh:[1,0],eh:[0,1],a:{sh:[46,20],hip:[46,40],ank:[46,74],wr:[50,41]},b:{sh:[46,20],hip:[46,40],ank:[46,74],wr:[55,21]},pr:[["wr","o"]]},
sbc:{st:[[38,59,54,59],[40,59,40,74],[52,59,52,74],[38,36,42,59]],kh:[1,-.2],eh:[0,1],a:{sh:[45,38],hip:[46,58],ank:[56,74],wr:[49,59]},b:{sh:[45,38],hip:[46,58],ank:[56,74],wr:[54,39]},pr:[["wr","d"]]},
calf:{st:LPS,kh:[.3,-1],eh:[0,1],a:{sh:[15,43],hip:[26,60],ank:[56,42],toe:[60,35],wr:[28,52]},b:{sh:[15,43],hip:[26,60],ank:[58,40],toe:[64,36],wr:[28,52]},pr:[["toe","p"]]},
slc:{st:SEAT,kh:[1,-.2],eh:[0,1],a:{sh:[30,38],hip:[34,58],ank:[68,60],wr:[40,56]},b:{sh:[30,38],hip:[34,58],ank:[48,73],wr:[40,56]},pr:[["ank","q"]]},
le:{st:SEAT,kh:[1,-.2],eh:[0,1],a:{sh:[30,38],hip:[34,58],ank:[50,74],wr:[40,56]},b:{sh:[30,38],hip:[34,58],ank:[68,56],wr:[40,56]},pr:[["ank","q"]]},
bp:{st:[[16,62,48,62],[20,62,20,74],[44,62,44,74]],kh:[.5,-1],eh:[1,.3],a:{sh:[22,60],hip:[42,60],ank:[58,74],wr:[24,38]},b:{sh:[22,60],hip:[42,60],ank:[58,74],wr:[24,52]},pr:[["wr","o"]]},
sq:{st:[],kh:[1,0],eh:[-.5,1],a:{sh:[50,20],hip:[50,40],ank:[50,74],wr:[52,26]},b:{sh:[46,40],hip:[36,58],ank:[50,74],wr:[49,44]},pr:[["sh","o"]]},
rdl:{st:[],kh:[1,0],eh:[0,1],a:{sh:[50,20],hip:[50,40],ank:[50,74],wr:[52,42]},b:{sh:[54,38],hip:[34,46],ank:[50,74],wr:[54,58]},pr:[["wr","o"]]}};
Object.assign(EX,{
dbp:["Dumbbell bench press","ch","tr,de","8-12","Lie with feet planted and shoulder blades pinched together.|Lower the dumbbells to chest level, elbows ~45–60° from the torso.|Press up and slightly in; don’t clank the weights."],
dsp:["Seated dumbbell shoulder press","de","tr","8-12","Sit with your back supported, dumbbells at ear level, forearms vertical.|Press straight up without arching your lower back.|Lower under control until elbows reach about 90°."],
smp:["Shoulder press machine","de","tr","8-12","Adjust the seat so the handles start at shoulder height.|Press up without shrugging or arching.|Lower slowly to a comfortable stretch."],
dro:["One-arm dumbbell row","ba","bi","8-12","Hand and knee on a bench, back flat.|Pull the dumbbell toward your hip, elbow close to the body.|Pause, then lower fully without twisting."],
dlr:["Dumbbell lateral raise","de","","12-20","Slight bend in the elbows, dumbbells at your sides.|Raise out to shoulder height, leading with the elbows.|Lower slowly; don’t swing or shrug."],
gsq:["Goblet squat","qd,gl","ha","10-15","Hold one dumbbell vertically at your chest.|Sit between your hips, chest tall, knees tracking over toes.|Drive up through the mid-foot."],
ddl:["Dumbbell Romanian deadlift","ha,gl","lb","8-12","Dumbbells close to your legs, soft knees.|Push hips back with a flat back until hamstrings stretch.|Squeeze glutes to stand tall."],
rlg:["Dumbbell reverse lunge","gl,qd","ha","8-12","Hold dumbbells at your sides and stand tall.|Step back and lower until both knees are ~90°.|Push through the front heel to return."],
dht:["Dumbbell hip thrust","gl","ha","10-15","Upper back on a bench, dumbbell resting on your hips.|Drive through your heels until shins are vertical.|Squeeze glutes, ribs down, lower slowly."],
hmc:["Dumbbell hammer curl","bi","","8-12","Palms facing each other, elbows at your sides.|Curl without swinging the torso.|Lower slowly over 2–3 seconds."],
cp:["Chest press machine","ch","tr,de","8-12","Set the seat so the handles line up with mid-chest.|Press forward without hard lockout.|Return slowly with shoulder blades pinched back."],
fp:["Cable face pull","de,ba","","12-20","Rope at upper-chest height, step back, arms extended.|Pull to your face, elbows high and wide.|Squeeze the rear delts, return slowly."],
gkc:["Cable glute kickback","gl","ha","10-15","Ankle strap on, hold the frame, slight forward lean.|Kick straight back and squeeze the glute without arching your back.|Return under control."],
hadd:["Hip adduction machine","ad","","12-20","Sit upright with pads on the inner thighs.|Squeeze your legs together and pause 1 s.|Open slowly; don’t slam the stack."],
scr:["Standing calf raise machine","ca","","12-20","Balls of the feet on the platform, shoulders under the pads.|Rise as high as possible and pause 1 s.|Lower for a full stretch."],
sms:["Smith machine squat","qd,gl","ha","8-12","Feet slightly forward of the bar, bar on the upper back.|Sit down to parallel or lower, chest tall.|Drive up through the mid-foot."],
ccl:["Cable biceps curl","bi","","10-15","Stand close to the low pulley, elbows at your sides.|Curl to a full squeeze.|Lower slowly; the cable keeps tension throughout."],
apu:["Assisted pull-up machine","ba","bi","6-12","Kneel on the pad, grip slightly wider than shoulders.|Pull your chest toward the bar, elbows down.|Lower with control to a full hang."],
tbr:["T-bar row","ba","bi","8-12","Hinge to ~45°, chest up, neutral spine.|Pull the handles to your lower ribs, elbows close.|Squeeze, then lower under control."],
cpt:["Cable pull-through","gl,ha","lb","10-15","Face away from the cable with the rope between your legs.|Push hips back with a flat spine.|Drive hips forward and squeeze the glutes."],
skc:["Dumbbell skull crusher","tr","","10-15","Lie on a bench, dumbbells over chest, elbows pointing up.|Lower toward your temples bending only at the elbows.|Extend back to the top."],
prc:["EZ-bar preacher curl","bi","","8-12","Armpits on the pad, grip shoulder-width.|Curl up and squeeze at the top.|Lower to near full extension slowly."]});
const cln = (id: string, o: any) => Object.assign({}, AN[id], o);
Object.assign(AN, {
dbp:cln("bp",{pr:[["wr","d"]]}),
dsp:{st:CH,kh:[1,-.2],eh:[0,1],a:{sh:[44,38],hip:[46,58],ank:[56,74],wr:[49,28]},b:{wr:[47,17]},pr:[["wr","d"]]},
smp:{st:CH,kh:[1,-.2],eh:[0,1],a:{sh:[44,38],hip:[46,58],ank:[56,74],wr:[49,28]},b:{wr:[47,17]},pr:[["wr","o"]]},
dro:{st:[[48,62,78,62],[51,62,51,74],[75,62,75,74]],kh:[1,0],eh:[-1,-.3],a:{sh:[54,36],hip:[36,46],ank:[48,74],wr:[55,58]},b:{wr:[47,41]},pr:[["wr","d"]]},
dlr:{F:1,st:[],eh:[1,.5],eh2:[-1,.5],a:{sh:[58,24],sh2:[42,24],hip:[50,44],kn:[54,59],kn2:[46,59],ank:[54,74],ank2:[46,74],wr:[60,45],wr2:[40,45]},b:{wr:[80,25],wr2:[20,25]},pr:[["wr","d"],["wr2","d"]]},
gsq:cln("sq",{eh:[0,1],a:{sh:[50,20],hip:[50,40],ank:[50,74],wr:[53,30]},b:{sh:[46,40],hip:[36,58],ank:[50,74],wr:[52,48]},pr:[["wr","d"]]}),
ddl:cln("rdl",{pr:[["wr","d"]]}),
rlg:{st:[],kh:[1,0],kh2:[0,1],eh:[0,1],a:{sh:[50,20],hip:[50,40],ank:[50,74],a2:[48,74],wr:[51,42]},b:{sh:[46,38],hip:[44,58],ank:[56,74],a2:[26,70],wr:[47,58]},pr:[["wr","d"]]},
dht:cln("mht",{pr:[["hip","d"]]}),
hmc:cln("ez",{pr:[["wr","d"]]}),
cp:{st:CH,kh:[1,-.2],eh:[-1,.3],a:{sh:[44,38],hip:[46,58],ank:[56,74],wr:[54,40]},b:{wr:[66,38]},pr:[["wr","c",[86,38]]]},
fp:{st:[],kh:[1,0],eh:[-.3,-1],a:{sh:[46,20],hip:[46,40],ank:[46,74],wr:[64,22]},b:{wr:[50,19]},pr:[["wr","c",[92,20]]]},
gkc:{st:[[66,18,66,74]],kh:[1,0],kh2:[0,1],eh:[1,.3],a:{sh:[52,24],hip:[48,44],ank:[48,74],a2:[46,73],wr:[62,36]},b:{a2:[22,58]},pr:[["a2","q"]]},
hadd:{F:1,st:AN.abd.st,eh:[1,.4],eh2:[-1,.4],a:AN.abd.b,b:AN.abd.a,pr:AN.abd.pr},
scr:{st:[[36,70,58,70],[36,70,36,74],[58,70,58,74]],kh:[1,0],eh:[0,1],a:{sh:[46,15],hip:[46,35],ank:[46,69],wr:[48,35]},b:{sh:[46,9],hip:[46,29],ank:[46,63],wr:[48,29]},pr:[["sh","o"]]},
sms:cln("sq",{st:[[30,2,30,74],[70,2,70,74]]}),
ccl:cln("ez",{pr:[["wr","c",[88,72]]]}),
apu:cln("lpd",{}),
cpt:cln("rdl",{pr:[["wr","c",[72,72]]]}),
skc:{st:AN.bp.st,kh:[.5,-1],eh:[0,-1],a:{sh:[22,60],hip:[42,60],ank:[58,74],wr:[24,38]},b:{wr:[14,48]},pr:[["wr","d"]]},
prc:cln("bcm",{pr:[["wr","o"]]})});
AN.tbr = cln("dro",{st:[],pr:[["wr","o"]]});
Object.assign(EX,{
gbr:["Dumbbell glute bridge","gl","ha","10-15","Lie on your back, feet hip-width, dumbbell on your hips.|Tuck the ribs, press through the heels.|Squeeze glutes at the top for 1 s, lower slowly."],
dnk:["Cable donkey kick","gl","ha","10-15","On hands and knees, ankle strap on, back flat.|Kick the heel up and back until the thigh is in line with the torso.|Squeeze, then return without arching your back."],
sum:["Dumbbell sumo squat","gl,qd","ad","10-15","Wide stance, toes turned out, one dumbbell held low.|Sit straight down, knees tracking over toes.|Stand by squeezing the glutes and inner thighs."],
stu:["Dumbbell step-up","gl,qd","ha","8-12","Place the whole foot on a knee-high box, dumbbells at your sides.|Drive through the heel of the top leg to stand.|Lower slowly; keep the top-leg work, not a push from the back foot."],
cur:["Dumbbell curtsy lunge","gl","qd,ad","8-12","Step one leg back and across behind the other.|Lower until the front thigh is about parallel.|Drive through the front heel to return."],
ggm:["Glute kickback machine","gl","ha","10-15","Chest on the pad, working foot on the plate.|Press back until the hip is fully extended, squeeze.|Return slowly; don’t arch the lower back."],
hpm:["Smith machine hip thrust","gl","ha","8-12","Upper back on a bench, bar over the hips with a pad.|Feet hip-width, shins vertical at the top.|Lock out, squeeze glutes 1 s, lower under control."],
fhy:["Cable fire hydrant","gl,ad","","12-20","On all fours, strap on the working ankle.|Lift the knee out to the side, hips square.|Pause at the top and lower slowly."],
sap:["Straight-arm cable pulldown","ba","tr","10-15","Stand facing the high pulley, slight hip hinge, arms straight.|Sweep the bar down to your thighs, led by the lats.|Return slowly to a full stretch."],
cdr:["Chest-supported dumbbell row","ba,de","bi","8-12","Chest on an incline bench, dumbbells hanging.|Row elbows back toward your hips and squeeze.|Lower fully without lifting your chest."],
dpo:["Dumbbell pullover","ba","ch,tr","10-15","Lie across a bench holding one dumbbell over your chest.|Lower it back behind your head with soft elbows.|Pull it over with your lats until arms are vertical."],
rfm:["Reverse fly machine","de,ba","","12-20","Chest on the pad, handles at shoulder height.|Open arms wide, leading with the elbows.|Squeeze shoulder blades, return slowly."],
dsh:["Dumbbell shrug","ba","","10-15","Stand tall holding dumbbells at your sides.|Lift the shoulders straight up toward your ears.|Pause, then lower slowly; no rolling."],
scp:["Single-arm cable pulldown","ba","bi","10-15","Kneel or sit facing the high pulley.|Pull the handle toward your hip, elbow down and back.|Control the stretch on the way up."],
srw:["Seated cable row (V-grip)","ba","bi","8-12","Sit tall, feet braced, slight knee bend.|Pull the handle to your belly, elbows close.|Squeeze, then let the shoulders stretch forward."],
ccu:["Concentration curl","bi","","10-15","Sit with the elbow braced against the inner thigh.|Curl up and squeeze the biceps.|Lower slowly to a full stretch."],
icu:["Incline dumbbell curl","bi","","8-12","Sit back on a 45–60° bench, arms hanging behind the torso.|Curl without swinging the shoulders forward.|Lower fully for a deep biceps stretch."],
rcu:["Reverse EZ-bar curl","bi","","10-15","Overhand grip on the EZ bar, elbows by your sides.|Curl up with wrists straight.|Lower under control; use lighter weight."],
dip:["Triceps dip machine","tr","ch","8-12","Adjust the seat so the handles are at your sides.|Press down until arms are straight, shoulders away from ears.|Return slowly to about 90° at the elbow."],
rpe:["Cable overhead triceps extension","tr","","10-15","Face away from the cable, rope held behind your head.|Extend your arms forward and up, elbows close to your ears.|Return slowly to a deep stretch."],
crh:["Cable rope hammer curl","bi","","10-15","Rope on the low pulley, palms facing each other.|Curl up, elbows pinned to your sides.|Squeeze and lower slowly."]});
Object.assign(AN, {gbr:cln("mht",{}),dnk:cln("gkc",{}),sum:cln("gsq",{}),stu:cln("rlg",{}),cur:cln("rlg",{}),ggm:cln("gkc",{}),hpm:cln("mht",{}),fhy:cln("abd",{}),sap:cln("pd",{}),cdr:cln("dro",{}),dpo:cln("bp",{}),rfm:cln("lr",{}),dsh:cln("hmc",{}),scp:cln("lpd",{}),srw:cln("crow",{}),ccu:cln("bcm",{}),icu:cln("sbc",{}),rcu:cln("ez",{}),dip:cln("pd",{}),rpe:cln("ote",{}),crh:cln("ccl",{})});
MN.ab = "Abs / core";
const NXD = `dfl|Dumbbell fly|ch|de|10-15|fb|dbp|Lie on a bench with dumbbells over your chest and a soft elbow bend.;Open your arms in a wide arc to a deep chest stretch.;Squeeze the dumbbells back together over your chest.
idp|Incline dumbbell press|ch|de,tr|8-12|ab|dsp|Set the bench to about 30° with dumbbells at upper-chest level.;Press up and slightly in until your arms are straight.;Lower slowly with elbows about 45–60° from your torso.
idf|Incline dumbbell fly|ch|de|10-15|ab|dbp|Bench at about 30°, dumbbells over your upper chest.;Open your arms with a soft elbow bend until you feel a stretch.;Bring them back together in a wide arc.
arn|Arnold press|de|tr|8-12|ab|dsp|Sit tall with dumbbells in front of your shoulders, palms facing you.;Rotate your palms outward as you press overhead.;Reverse the rotation as you lower under control.
dfr|Dumbbell front raise|de|ch|10-15|db|dlr|Hold dumbbells in front of your thighs.;Raise your arms to shoulder height without swinging.;Lower slowly.
rdf|Dumbbell rear delt fly|de|ba|12-20|db|dlr|Hinge forward with a flat back and dumbbells hanging.;Lift your arms out to the sides, leading with the elbows.;Squeeze the rear delts, then lower slowly.
bdr|Bent-over dumbbell row|ba|bi|8-12|db|dro|Hinge to about 45° with a flat back, dumbbells hanging.;Pull both dumbbells to your lower ribs.;Squeeze your shoulder blades, then lower under control.
dwl|Dumbbell walking lunge|qd,gl|ha|10-14|db|rlg|Hold dumbbells at your sides and stand tall.;Step forward and lower until both knees are about 90°.;Push through the front heel into the next step.
dcr|Dumbbell calf raise|ca||12-20|db|scr|Hold dumbbells at your sides, balls of the feet on a step or floor.;Rise as high as you can and pause for a second.;Lower for a full stretch.
adc|Alternating dumbbell curl|bi||10-15|db|hmc|Stand tall with dumbbells, palms facing forward.;Curl one arm at a time without swinging.;Lower slowly and alternate sides.
bdp|Bench dip|tr|ch,de|8-15|fb|kb|Put your hands on the edge of a bench, legs straight or bent.;Lower until your elbows reach about 90°.;Press back up without shrugging.
cgb|Close-grip bench press|tr|ch,de|6-10|bk|bp|Lie on the bench with a grip just inside shoulder width.;Lower to your lower chest with elbows tucked.;Press up to full extension.
bht|Barbell hip thrust|gl|ha|8-12|bk|mht|Upper back on the bench, padded barbell over your hips.;Drive through your heels until your shins are vertical.;Pause with glutes squeezed, then lower.
ibp|Incline barbell press|ch|de,tr|6-10|ib|bp|Set the bench to about 30° and grip slightly wider than your shoulders.;Lower the bar to your upper chest.;Press up without bouncing.
sbo|Seated barbell shoulder press|de|tr|6-10|ib|dsp|Set the bench upright, bar at collarbone height.;Press straight overhead, head moving slightly forward at the top.;Lower under control to your collarbone.
pul|Pull-up|ba|bi|5-10|pu|lpd|Hang with hands just wider than your shoulders.;Pull your chest toward the bar, elbows driving down.;Lower to a full hang under control.
chu|Chin-up|ba,bi||5-10|pu|lpd|Hang with a shoulder-width underhand grip.;Pull until your chin clears the bar.;Lower slowly to a full hang.
hkr|Hanging knee raise|ab||10-15|pu|lpd|Hang from the bar with shoulders engaged.;Curl your knees toward your chest without swinging.;Lower slowly.
hlr|Hanging leg raise|ab||8-15|pu|lpd|Hang from the bar and brace your core.;Raise straight legs to hip height or higher.;Lower under control.
rbe|Roman chair back extension|lb|gl,ha|10-15|rc|hyp|Set the pad at hip level with feet locked in.;Lower with a flat back, then rise until your body is in a straight line.;Squeeze glutes at the top; don’t over-arch.
rsb|Roman chair side bend|ab|lb|12-20|rc|hyp|Lock in sideways with your hips on the pad.;Lower sideways with control.;Lift back to a straight line using your obliques.
ghr|Glute-ham raise|ha|gl|6-12|rc|hyp|Lock your ankles and set your knees on the pad.;Lower your torso with a straight body line.;Curl back up using hamstrings and glutes.
rsu|Roman chair sit-up|ab||10-20|rc|hyp|Lock your feet in and cross your arms on your chest.;Lower your torso back without arching.;Curl up until your torso is upright.
cfl|Cable fly|ch|de|10-15|cm|fp|Set the pulleys at chest height and stand in a split stance.;Bring the handles together in a wide arc with soft elbows.;Return slowly to a chest stretch.
clr|Cable lateral raise|de||12-20|cm|dlr|Stand side-on to the low pulley, handle in the far hand.;Raise your arm out to shoulder height.;Lower slowly; the cable keeps tension.
ccr|Cable crunch|ab||10-15|cm|pd|Kneel facing the high pulley with the rope at your forehead.;Crunch your ribs toward your hips.;Return slowly without moving your hips.
cwc|Cable woodchop|ab|de|10-15|cm|fp|Set the cable high, stand side-on with both hands on the handle.;Rotate and pull diagonally down across your body.;Return under control.
crf|Cable rear delt fly|de|ba|12-20|cm|fp|Cross the cables at shoulder height.;Pull the handles out and back with soft elbows.;Squeeze the rear delts and return slowly.
cup|Cable upright row|de|ba|10-15|cm|fp|Stand at a low pulley with a straight bar.;Pull to chest height with elbows leading.;Lower slowly.
wcr|Wide-grip seated cable row|ba|de,bi|8-12|rcb|crow|Sit tall, feet braced, wide bar in hand.;Pull the bar to your upper abdomen with elbows out.;Squeeze, then return with a stretch.
sar|Single-arm seated cable row|ba|bi|8-12|rcb|crow|Sit tall with a single handle, feet braced.;Pull to your ribs, elbow close to the body.;Return slowly without twisting.
lpw|Wide-grip lat pulldown|ba|bi|8-12|lpc|lpd|Grip the bar wider than your shoulders, thighs under the pads.;Pull to your upper chest, elbows down.;Return to a full stretch.
lpg|Close-grip lat pulldown|ba|bi|8-12|lpc|lpd|Use a V-handle or narrow bar.;Pull to your upper chest, elbows close.;Return under control.
lpr|Reverse-grip lat pulldown|ba|bi|8-12|lpc|lpd|Underhand shoulder-width grip.;Pull to your upper chest, squeezing the lats.;Return slowly.
abc|Ab crunch machine|ab||10-15|abm|bcm|Adjust the seat so the pads sit at chest level.;Crunch forward, curling your ribs toward your pelvis.;Return slowly without letting the stack drop.
abr|Rotary torso machine|ab||10-15|abm|bcm|Sit tall with hips fixed and the pads against your arms.;Rotate your torso through a comfortable range.;Return slowly and repeat on the other side.
pdf|Pec deck fly (butterfly)|ch|de|10-15|bf|lr|Adjust the seat so the handles are at chest height.;Bring the handles together in front of your chest.;Return slowly to a gentle stretch.
sle|Single-leg extension|qd||10-15|lem|le|Sit with one ankle behind the pad.;Extend the knee fully and squeeze the quad.;Lower slowly and swap legs.
llc|Lying leg curl|ha||10-15|lcm|slc|Lie face down with the pad just above your heels.;Curl your heels toward your glutes.;Lower slowly to near full extension.
slg|Single-leg curl|ha||10-15|lcm|slc|Set up on the leg curl machine and use one leg.;Curl up and squeeze the hamstring.;Lower slowly, then swap legs.
icm|Incline chest press machine|ch|de,tr|8-12|cpm|cp|Set the seat so the handles line up with the upper chest.;Press forward without hard lockout.;Return slowly with shoulder blades pinched back.
sac|Single-arm chest press machine|ch|tr|8-12|cpm|cp|Sit tall and brace against the seat.;Press one handle forward until the arm is straight.;Return slowly and swap sides.
lpl|Leg press (low stance)|qd|gl|8-12|lpm|lp|Feet low and shoulder-width on the platform.;Lower until your knees are about 90° without your hips lifting.;Press up without locking out your knees.
lps|Single-leg press|qd,gl||8-12|lpm|lp|Place one foot in the centre of the platform.;Lower under control until the knee is about 90°.;Press up, then swap legs.
pcm|Preacher curl machine|bi||10-15|bm|bcm|Set the seat so your armpits touch the pad.;Curl up and squeeze at the top.;Lower slowly to near full extension.
sbp|Smith machine bench press|ch|tr,de|8-12|sm|bp|Position the bench so the bar lines up with your mid-chest.;Lower with elbows about 45–60° from your torso.;Press up and re-rack when finished.
sip|Smith machine incline press|ch|de,tr|8-12|sm|dsp|Set the bench to about 30° under the bar.;Lower to your upper chest.;Press up to full extension.
srd|Smith machine Romanian deadlift|ha|gl|8-12|sm|rdl|Stand with the bar at hip height, soft knees.;Push your hips back, sliding the bar down your thighs.;Drive your hips forward to stand.
ssp|Smith machine shoulder press|de|tr|8-12|sm|dsp|Sit with the bar starting at chin height.;Press straight overhead.;Lower under control to chin level.
scs|Smith machine calf raise|ca||12-20|sm|scr|Stand with the balls of your feet on a plate under the bar.;Rise as high as possible and pause.;Lower for a full stretch.
slu|Smith machine split squat|qd|gl|8-12|sm|sms|Place one foot forward under the bar and the other behind.;Lower until the front thigh is about parallel.;Drive up through the front foot.
shr|Smith machine bent-over row|ba|bi|8-12|sm|dro|Hinge to about 45° and take an overhand grip.;Pull the bar to your lower ribs.;Lower under control.
srm|Single-arm row machine|ba|bi|8-12|r1|dro|Set the chest pad so you can reach the handle fully.;Pull the handle toward your hip.;Return slowly and swap arms.
hrs|Single-arm high row machine|ba|de|8-12|r1|wrow|Sit tall with the chest pad supporting you.;Pull the handle down and back, elbow leading.;Return slowly and swap sides.
rwm|Seated row machine|ba|bi|8-12|r2|wrow|Adjust the chest pad and grab both handles.;Pull your elbows back and squeeze the shoulder blades.;Return slowly to a full stretch.
csr|Chest-supported row machine|ba|de|8-12|r2|wrow|Lean your chest on the pad with a neutral spine.;Row the handles to your lower ribs.;Return under control.
dlm|Deadlift machine|ha,gl|lb|6-10|dm|rdl|Set the handles at a height that lets you keep a flat back.;Push through your feet and stand tall.;Lower with control, hips back.
sdm|Sumo deadlift machine|gl,qd|ha|6-10|dm|rdl|Take a wide stance with toes turned out.;Drive through your feet and extend your hips.;Lower slowly with your chest up.
bex|Back extension machine|lb|gl|10-15|bem|hyp|Set the pad at your upper back and keep your feet planted.;Extend your torso until it is in line with your hips.;Return slowly without over-arching.
sps|Shoulder press machine (neutral grip)|de|tr|8-12|spm|smp|Set the seat so the handles start at shoulder height.;Press up with a neutral grip.;Lower slowly to a comfortable stretch.
slr|Single-arm lateral raise machine|de||12-20|lrm|lr|Sit with your arm against the pad.;Raise the arm out to shoulder height.;Lower slowly and swap sides.
tem|Triceps extension machine|tr||10-15|tm|ote|Set the seat so your elbows rest on the pad.;Extend your arms fully.;Return slowly under control.
sct|Seated calf raise machine|ca||12-20|crm|scr|Sit with your knees under the pad and the balls of your feet on the platform.;Rise as high as possible and pause.;Lower for a full stretch.
gsl|Single-leg glute press machine|gl|qd|10-15|gm|ggm|Set your foot high on the platform.;Press through the heel and squeeze the glute.;Return slowly and swap legs.
gdm|Glute drive machine|gl|ha|8-12|gm|mht|Sit with the belt across your hips and feet planted.;Drive your hips up and squeeze the glutes.;Lower slowly.
cge|Standing cable hip extension|gl|ha|10-15|gc|gkc|Attach the ankle strap to the low pulley and hold the frame.;Extend your leg back, squeezing the glute.;Return slowly without arching your back.
cha|Cable hip abduction|ad,gl||12-20|gc|abd|Ankle strap on the leg closest to the machine.;Lift your leg out to the side with a tall torso.;Lower slowly.
tmi|Treadmill walk or run|ca|qd,ha|cardio|tr|0|Start at an easy walking pace for 3–5 minutes.;Raise speed or incline to a steady effort you can sustain.;Finish with a few minutes of slow walking.
stc|Stair climber|qd,gl|ca|cardio|cl|0|Stand tall and keep light hands on the rails.;Step at a steady pace through the full range.;Keep your weight on your legs, not your arms.
orb|Elliptical trainer (Orbitrack)|qd|gl,ha|cardio|or|0|Stand tall and grip the handles lightly.;Push and pull smoothly through the full stride.;Keep a steady rhythm and breathe easily.
ubk|Upright bike|qd|gl,ca|cardio|ub|0|Set the saddle so your knee is slightly bent at the bottom.;Pedal at a steady cadence of about 70–90 rpm.;Add resistance gradually.
exb|Exercise bike|qd|gl,ca|cardio|eb|0|Adjust the saddle and handlebars to a comfortable position.;Warm up for 3–5 minutes at low resistance.;Hold a steady effort, then cool down.`;
export const EQ: Record<string, string> = {};
NXD.split("\n").forEach(l=>{const[id,n,p,q,r,eq,from,st]=l.split("|");EX[id]=[n,p,q,r,st.split(";").join("|")];EQ[id]=eq;if(from!="0")AN[id]=cln(from,{})});
Object.assign(EQ,{mht:"gm",hyp:"bem",bss:"db",sht:"fb",lp:"lpm",abd:"hm",crow:"rcb",lr:"lrm",bcm:"bm",wrow:"r2",lpd:"lpc",pd:"cm",kb:"db",ote:"tm",otd:"db",ez:"bb",sbc:"db",calf:"lpm",slc:"lcm",le:"lem",sq:"bb",rdl:"bb",bp:"bk",dbp:"fb",dsp:"ab",smp:"spm",dro:"fb",dlr:"db",gsq:"db",ddl:"db",rlg:"db",dht:"fb",hmc:"db",cp:"cpm",fp:"cm",gkc:"gc",hadd:"hm",scr:"crm",sms:"sm",ccl:"cm",apu:"apm",tbr:"r2",cpt:"cm",skc:"fb",prc:"bb",gbr:"db",dnk:"gc",sum:"db",stu:"db",cur:"db",ggm:"gm",hpm:"sm",fhy:"gc",sap:"cm",cdr:"ab",dpo:"fb",rfm:"bf",dsh:"db",scp:"lpc",srw:"rcb",ccu:"db",icu:"ab",rcu:"bb",dip:"tm",rpe:"cm",crh:"cm"});
export const CD: Record<string, [string, string][]> = {tmi:[["r","Time (min)"],["w","Speed (km/h)"],["i","Incline (%)"]],stc:[["r","Time (min)"],["w","Speed (level)"]],orb:[["r","Time (min)"],["w","Speed (km/h)"]],ubk:[["r","Time (min)"],["w","Speed (km/h)"]],exb:[["r","Time (min)"],["w","Speed (km/h)"]]};
const WK = (st: any, kh: any, a: any, b: any, x?: any) => Object.assign({ st, kh, eh: [-1, .5], a, b }, x || {});
AN.tmi=WK([[6,74,94,74]],[1,0],{sh:[48,22],hip:[46,42],ank:[36,74],a2:[56,66],wr:[52,36]},{sh:[48,22],hip:[46,42],ank:[56,66],a2:[36,74],wr:[42,36]});
AN.stc=WK([[30,60,70,60],[30,67,70,67]],[1,0],{sh:[48,22],hip:[48,42],ank:[42,60],a2:[54,54],wr:[56,34]},{sh:[48,22],hip:[48,42],ank:[42,54],a2:[54,60],wr:[56,34]});
AN.orb=WK([[28,74,72,74]],[1,0],{sh:[48,22],hip:[48,42],ank:[36,72],a2:[60,72],wr:[58,32]},{sh:[48,22],hip:[48,42],ank:[60,72],a2:[36,72],wr:[38,32]});
AN.ubk=WK([[40,48,40,74],[40,50,26,50],[40,74,66,74],[56,44,66,44],[66,44,66,74]],[1,0],{sh:[42,30],hip:[40,48],ank:[58,70],a2:[44,74],wr:[62,42]},{sh:[42,30],hip:[40,48],ank:[44,74],a2:[58,70],wr:[62,42]});
AN.exb=WK([[40,50,40,74],[40,52,24,52],[40,74,68,74],[58,46,68,46],[68,46,68,74]],[1,0],{sh:[40,32],hip:[40,50],ank:[56,70],a2:[44,74],wr:[62,44]},{sh:[40,32],hip:[40,50],ank:[44,74],a2:[56,70],wr:[62,44]});
export const EQL: [string, [string, string][]][] = [["Free weights and benches",[["db","Dumbbells"],["fb","Flat bench"],["ab","Adjustable bench"],["bk","Flat bench with rack"],["ib","Incline bench with rack"],["bb","Barbell / EZ bar"],["pu","Pull-up bar"],["rc","Roman chair"]]],["Cable machines",[["cm","Cable machine"],["rcb","Row cable"],["lpc","Lat pulldown cable"],["gc","Glute extension with cable"]]],["Machines",[["abm","Ab machine"],["bf","Butterfly (pec deck)"],["lem","Leg extension machine"],["lcm","Leg curl machine"],["cpm","Chest press machine"],["lpm","Leg press machine"],["bm","Biceps machine"],["sm","Smith machine"],["r1","Row machine, single hand"],["r2","Rowing machine, both hands"],["dm","Deadlift machine"],["bem","Back extension machine"],["spm","Shoulder press machine"],["lrm","Lateral raise machine"],["tm","Triceps machine"],["crm","Calf raise machine"],["gm","Glute machine, single leg"],["hm","Hip abduction / adduction machine"],["apm","Assisted pull-up machine"]]],["Cardio",[["tr","Treadmill"],["cl","Climber machine"],["or","Orbitrack"],["ub","Upright lifecycle bike"],["eb","Exercise bike"]]]];
export const EQN: Record<string, string> = {};
EQL.forEach(([, a]) => a.forEach(([k, l]) => (EQN[k] = l)));
export const FOC: string[] = ["Lower body","Glutes","Hamstrings","Quads","Calves","Upper body","Back","Chest","Shoulders","Arms","Full body"];
export const FM: Record<string, string[]> = {"Lower body":["gl","qd","ha","ca","ad"],Glutes:["gl"],Hamstrings:["ha"],Quads:["qd"],Calves:["ca"],"Upper body":["ba","ch","de","bi","tr"],Back:["ba"],Chest:["ch"],Shoulders:["de"],Arms:["bi","tr"],"Full body":["gl","qd","ha","ba","ch","de","bi","tr"]};

// Redrawn animations (Nov 2026) for exercises that had borrowed another exercise's movement.
// Side view: sh/hip/ank/wr points, ground at y 74.5; F:1 = front view. st = equipment lines.
const BAR: number[][] = [[30, 3, 70, 3]], SEAT2: number[][] = [[34, 54, 54, 54], [44, 54, 44, 74]];
const hang = (b: any) => ({ st: BAR, kh: [1, 0], eh: [1, 0], a: { sh: [50, 24], hip: [50, 44], ank: [46, 73], wr: [50, 3] }, b, pr: [["wr", "d"]] });
const fours = { sh: [58, 51], hip: [36, 51], wr: [58, 74], a2: [20, 74] };
const stand = { sh: [58, 26], sh2: [42, 26], hip: [50, 46], kn: [54, 60], kn2: [46, 60], ank: [55, 74], ank2: [45, 74] };
const seatF = { sh: [58, 26], sh2: [42, 26], hip: [50, 52], kn: [56, 58], kn2: [44, 58], ank: [56, 73], ank2: [44, 73] };
Object.assign(AN, {
  pul: hang({ sh: [50, 11], hip: [50, 31], ank: [44, 60], wr: [50, 3] }),
  chu: hang({ sh: [50, 11], hip: [50, 31], ank: [44, 60], wr: [50, 3] }),
  apu: { ...hang({ sh: [50, 11], hip: [50, 31], ank: [36, 50], wr: [50, 3] }), a: { sh: [50, 24], hip: [50, 44], ank: [36, 62], wr: [50, 3] }, kh: [1, .6] },
  hkr: { ...hang({ sh: [50, 24], hip: [50, 44], ank: [58, 60], wr: [50, 3] }), kh: [1, -.6] },
  hlr: { ...hang({ sh: [51, 24], hip: [48, 44], ank: [80, 46], wr: [50, 3] }), kh: [-.2, 1] },
  ccr: { st: [], kh: [.3, 1], eh: [-1, .6], a: { sh: [47, 38], hip: [46, 58], ank: [20, 74], wr: [53, 33] }, b: { sh: [60, 45], hip: [45, 57], ank: [20, 74], wr: [62, 50] }, pr: [["wr", "c", [60, -2]]] },
  cwc: { F: 1, st: [], eh: [1, -.2], eh2: [-1, -.2], a: { ...stand, wr: [68, 12], wr2: [63, 14] }, b: { ...stand, wr: [40, 54], wr2: [35, 52] }, pr: [["wr", "c", [84, 2]]] },
  cup: { st: [], kh: [1, 0], eh: [-1, -1], a: { sh: [46, 20], hip: [46, 40], ank: [46, 74], wr: [53, 42] }, b: { sh: [46, 20], hip: [46, 40], ank: [46, 74], wr: [53, 24] }, pr: [["wr", "c", [62, 74]]] },
  abc: { st: [[38, 56, 54, 56], [46, 56, 46, 74], [36, 56, 38, 34]], kh: [1, -.2], eh: [1, 1], a: { sh: [44, 33], hip: [46, 55], ank: [56, 74], wr: [52, 37] }, b: { sh: [57, 39], hip: [46, 55], ank: [56, 74], wr: [62, 46] }, pr: [["wr", "d"]] },
  abr: { F: 1, st: [[40, 58, 60, 58], [50, 58, 50, 74]], eh: [1, .5], eh2: [-1, .5], a: { ...seatF, wr: [52, 36], wr2: [48, 36] }, b: { ...seatF, sh: [54, 26], sh2: [45, 27], wr: [46, 36], wr2: [42, 36] } },
  bex: { st: SEAT2, kh: [1, -.2], eh: [1, 1], a: { sh: [60, 40], hip: [46, 54], ank: [56, 74], wr: [58, 46] }, b: { sh: [41, 35], hip: [46, 54], ank: [56, 74], wr: [46, 42] } },
  srm: cln("rwm", { pr: [["wr", "c", [84, 40]]] }),
  dip: { st: SEAT2, kh: [1, -.2], eh: [-1, -.2], a: { sh: [45, 33], hip: [46, 54], ank: [56, 74], wr: [49, 36] }, b: { sh: [45, 33], hip: [46, 54], ank: [56, 74], wr: [47, 54] }, pr: [["wr", "d"]] },
  cha: { F: 1, st: [], eh: [1, .3], eh2: [-1, .3], a: { ...stand, wr: [62, 46], wr2: [34, 40] }, b: { ...stand, kn: [60, 59], ank: [68, 71], wr: [62, 46], wr2: [34, 40] }, pr: [["ank", "c", [16, 74]]] },
  fhy: { st: [], kh: [.3, 1], kh2: [.3, 1], eh: [1, 0], a: { ...fours, ank: [20, 74] }, b: { ...fours, ank: [22, 56] }, pr: [["ank", "c", [4, 74]]] },
  dnk: { st: [], kh: [.3, 1], kh2: [.3, 1], eh: [1, 0], a: { ...fours, ank: [20, 74] }, b: { ...fours, ank: [20, 33] }, pr: [["ank", "c", [4, 74]]] },
  sct: { st: [[30, 52, 48, 52], [40, 52, 40, 74], [55, 72, 70, 72], [54, 47, 68, 47]], kh: [1, -1], eh: [1, 1], a: { sh: [44, 32], hip: [44, 52], ank: [61, 70], wr: [60, 46] }, b: { sh: [44, 31], hip: [44, 51], ank: [61, 65], wr: [60, 42] } },
  rsu: { st: [[40, 52, 40, 74], [33.6, 54.4, 43.8, 47.9]], kh: [0, 1], eh: [1, -1], a: { sh: [64, 52], hip: [46, 42], ank: [17, 60], wr: [58, 48] }, b: { sh: [38, 23], hip: [46, 42], ank: [17, 60], wr: [42, 30] } },
  cdr: { st: [[26, 72, 58, 42], [32, 66, 32, 74]], kh: [1, 1], eh: [-1, 0], a: { sh: [53, 43], hip: [37, 56], ank: [24, 74], wr: [55, 64] }, b: { sh: [53, 43], hip: [37, 56], ank: [24, 74], wr: [46, 52] }, pr: [["wr", "d"]] },
});
