// Food database (per 100 g), aliases for Russian / Bulgarian search, recipes.
/* eslint-disable */
export interface Food { n: string; k: number; p: number; c: number; f: number; b?: number }
export interface Recipe { t: string; p: number; k: number; c: number; f: number; m?: number; ing: string[]; st: string[]; cu?: number; img?: string }
export const FD: Record<string, Food> = {};
`chicken|Chicken breast|120|22.5|0|2.6
thigh|Chicken thigh (skinless)|121|19.7|0|4.1
turkeyb|Turkey breast|114|23.7|0|1.5
turkey|Turkey mince|150|18.7|0|8.3
beef|Lean beef mince|137|21.4|0|5
steak|Beef sirloin steak|145|22|0|6
pork|Pork tenderloin|120|20.9|0|3.5
salmon|Salmon fillet|208|20.4|0|13.4
cod|Cod fillet|82|18|0|0.7
tuna|Tuna (canned in water)|116|26|0|0.8
shrimp|Shrimp|85|20.1|0.2|0.5
smoked|Smoked salmon|117|18|0|4.3
egg|Egg|143|12.6|0.7|9.5
eggw|Egg whites|52|10.9|0.7|0.2
gyog|Greek yogurt 0%|59|10.2|3.6|0.4
cott|Cottage cheese|72|12.4|2.7|1
skyr|Skyr|63|11|4|0.2
whey|Whey protein powder|380|80|6|6
tofu|Firm tofu|144|17.3|2.8|8.7
tempeh|Tempeh|192|20.3|7.6|10.8
edam|Edamame|121|11.9|8.9|5.2
lent|Red lentils (dry)|358|23.9|59|1.1
chick|Chickpeas (canned)|139|7.1|22.5|2.8
bblack|Black beans (canned)|91|6|16.6|0.3
kidney|Kidney beans (canned)|84|5.2|15.3|0.5
mozz|Mozzarella (part-skim)|254|24.3|2.8|15.9
feta|Feta|264|14|4|21
parm|Parmesan|431|38|4.1|29
cheddar|Cheddar|403|25|1.3|33
rice|White rice (dry)|365|7.1|80|0.7
brice|Brown rice (dry)|370|7.9|77|2.9
quin|Quinoa (dry)|368|14|64|6.1
oats|Rolled oats|379|13.2|67.7|6.5
pasta|Pasta (dry)|371|13|75|1.5
wpasta|Wholewheat pasta (dry)|348|14|72|2.5
cous|Couscous (dry)|376|12.8|77|0.6
potato|Potato|77|2|17|0.1
sweet|Sweet potato|86|1.6|20|0.1
bread|Wholegrain bread|252|12.5|42.7|3.5
wrap|Wholewheat wrap|306|8.7|50|7.5
banana|Banana|89|1.1|23|0.3
apple|Apple|52|0.3|14|0.2
orange|Orange|47|0.9|12|0.1
berry|Mixed berries|57|0.7|14.5|0.3
mango|Mango|60|0.8|15|0.4
broc|Broccoli|34|2.8|7|0.4
spin|Spinach|23|2.9|3.6|0.4
zuc|Zucchini|17|1.2|3.1|0.3
pep|Bell pepper|31|1|6|0.3
tom|Tomato|18|0.9|3.9|0.2
cuc|Cucumber|15|0.7|3.6|0.1
onion|Onion|40|1.1|9.3|0.1
carrot|Carrot|41|0.9|10|0.2
mush|Mushrooms|22|3.1|3.3|0.3
caul|Cauliflower|25|1.9|5|0.3
asp|Asparagus|20|2.2|3.9|0.1
gbean|Green beans|31|1.8|7|0.2
kale|Kale|49|4.3|8.8|0.9
avo|Avocado|160|2|8.5|14.7
corn|Sweetcorn|86|3.3|19|1.4
peas|Green peas|77|5.2|14|0.4
cab|Cabbage|25|1.3|5.8|0.1
lett|Lettuce|15|1.4|2.9|0.2
garlic|Garlic|149|6.4|33|0.5
oil|Olive oil|884|0|0|100
butter|Butter|717|0.9|0.1|81
pb|Peanut butter|588|25|20|50
alm|Almonds|579|21|22|50
wal|Walnuts|654|15|14|65
chia|Chia seeds|486|16.5|42|31
pump|Pumpkin seeds|559|30|11|49
tahini|Tahini|595|17|21|54
honey|Honey|304|0.3|82|0
soy|Soy sauce|53|8|4.9|0.6
hummus|Hummus|166|8|14|9.6
milk|Milk (semi-skimmed)|46|3.4|4.8|1.5
almilk|Almond milk (unsweetened)|15|0.6|0.3|1.2
pass|Chopped tomatoes|24|1.2|4.5|0.1
lemon|Lemon juice|22|0.4|6.9|0.2
dchoc|Dark chocolate 70%|598|7.8|46|43
cocoa|Cocoa powder|228|19.6|58|13.7
x1|Chicken breast, cooked|165|31|0|3.6
x2|Rice, cooked|130|2.7|28|0.3
x3|Pasta, cooked|158|5.8|31|0.9
x4|Beef steak, cooked|217|26|0|12
x5|Plain yogurt (whole)|61|3.5|4.7|3.3
x6|White bread|265|9|49|3.2
x7|Pizza (margherita)|266|11|33|10
x8|Protein bar|360|33|35|10
x9|Oatmeal, cooked|71|2.5|12|1.5
x10|Boiled egg|155|12.6|1.1|10.6
x11|Salmon, baked|206|22|0|12
x12|Cheese (Edam)|357|25|1.4|28`.split("\n").forEach(l=>{const[k,n,kc,p,c,f]=l.split("|");FD[k]={n,k:+kc,p:+p,c:+c,f:+f}});
const UN: Record<string, [number, string, string]> = {egg:[50,"egg","eggs"],bread:[40,"slice wholegrain bread","slices wholegrain bread"],wrap:[60,"wholewheat wrap","wholewheat wraps"]};
const RW=`Chicken fajita bowl|chicken:180,pep:150,onion:60,rice:60,avo:40,oil:8|Cook the rice.;Slice chicken, pepper and onion. Fry the chicken in oil with paprika and cumin for 6–7 min.;Add the vegetables for 4 min.;Serve over rice with sliced avocado.
Turkey meatballs & courgetti|turkey:200,egg:50,parm:15,pass:200,zuc:250,oil:5|Mix turkey, egg and parmesan; roll into 8 balls.;Brown in oil 5 min, add tomatoes and simmer 12 min.;Spiralise zucchini, toss in the hot sauce for 2 min.
Tuna & chickpea salad|tuna:150,chick:120,cuc:100,tom:100,onion:30,oil:10,lemon:15|Drain tuna and chickpeas.;Chop cucumber, tomato and onion.;Toss everything with oil, lemon, salt and pepper.
Shrimp & broccoli stir-fry|shrimp:200,rice:60,broc:100,carrot:60,soy:15,garlic:5,oil:5|Cook the rice.;Stir-fry garlic, carrot and broccoli 4 min.;Add shrimp and soy sauce for 3 min until pink. Serve on rice.
Beef & sweet potato hash|beef:180,sweet:200,onion:50,pep:80,egg:50,oil:8|Dice sweet potato and microwave 4 min.;Brown beef with onion and pepper in oil, add the potato and crisp for 6 min.;Top with a fried egg.
Overnight protein oats|oats:50,whey:35,milk:200,chia:10,berry:80|Stir oats, whey, chia and milk in a jar.;Chill overnight.;Top with berries in the morning.
Protein banana pancakes|oats:50,egg:100,cott:100,whey:25,banana:60,butter:5|Blend oats, eggs, cottage cheese, whey and banana.;Cook small pancakes in butter, 2–3 min per side.;Serve with extra banana slices.
Skyr berry parfait|skyr:300,whey:10,alm:20,berry:100,honey:10|Stir whey into skyr.;Layer skyr and berries in a glass.;Top with chopped almonds and honey.
Sheet-pan salmon & asparagus|salmon:180,asp:200,potato:200,oil:8,lemon:15|Cube potatoes, toss in oil, roast at 200°C for 15 min.;Add salmon and asparagus, roast 12 min.;Squeeze lemon over.
Lemon cod with quinoa|cod:250,quin:50,gbean:150,oil:8,lemon:10|Cook quinoa 12–15 min.;Pan-sear cod in oil 3–4 min per side.;Steam green beans 5 min; serve with lemon.
Veggie egg-white omelette|eggw:200,egg:50,spin:80,mush:80,feta:30,bread:80|Sauté mushrooms and spinach 3 min.;Pour in whisked eggs and whites; cook until set.;Crumble feta on top; serve with toast.
Tofu scramble burrito|tofu:200,bblack:80,wrap:60,pep:60,avo:30|Crumble tofu and fry with diced pepper and turmeric 6 min.;Warm the beans and wrap.;Fill the wrap with tofu, beans and avocado.
Tempeh Buddha bowl|tempeh:150,quin:50,edam:60,carrot:60,cab:60,tahini:15,soy:10|Cook quinoa.;Pan-fry sliced tempeh until golden; boil edamame 4 min.;Assemble the bowl; drizzle tahini mixed with soy and water.
Chicken & chickpea curry|chicken:150,chick:100,pass:150,onion:60,rice:50,spin:60,oil:8|Fry onion in oil, add curry spices and chicken pieces for 5 min.;Add tomatoes and chickpeas, simmer 15 min.;Stir in spinach and serve with rice.
Pork tenderloin & roast veg|pork:200,potato:200,broc:150,oil:10|Roast diced potatoes at 200°C for 15 min.;Sear pork 2 min per side, add to the tray with broccoli; roast 15 min.;Rest the pork 5 min and slice.
Chicken avocado wrap|chicken:150,wrap:60,avo:50,lett:40,tom:60,gyog:40|Grill or pan-cook chicken and slice.;Spread yogurt on the wrap.;Add lettuce, tomato, avocado and chicken; roll up.
Greek chicken souvlaki plate|thigh:200,gyog:80,cuc:80,tom:100,cous:50,oil:8,lemon:10|Marinate chicken in oil, lemon and oregano if time allows.;Grill 6 min per side.;Make tzatziki from yogurt and cucumber; serve with couscous and tomato.
Smoked salmon scramble|smoked:100,egg:150,cott:100,bread:60|Scramble eggs low and slow.;Fold in cottage cheese at the end.;Top with smoked salmon; serve with toast.
Beef & broccoli rice bowl|steak:180,broc:150,rice:60,soy:15,garlic:5,oil:8|Cook the rice.;Sear sliced steak 2 min and set aside.;Stir-fry broccoli and garlic 4 min, return the steak with soy sauce.
Lentil turkey bolognese|lent:70,turkey:150,pass:200,onion:50,carrot:50,wpasta:60,parm:10|Simmer lentils in water 15 min.;Brown turkey with onion and carrot, add tomatoes and lentils for 10 min.;Serve over pasta with parmesan.
Banana berry protein bowl|whey:30,gyog:150,banana:100,berry:80,pb:15|Blend whey, yogurt and half the banana.;Pour into a bowl.;Top with berries, banana slices and peanut butter.
Turkey-stuffed peppers|pep:250,cott:200,turkey:100,rice:40,pass:100|Brown turkey; mix with cooked rice, cottage cheese and tomatoes.;Halve peppers and fill.;Bake at 190°C for 25 min.
Spicy shrimp quinoa salad|shrimp:220,quin:50,avo:50,cuc:100,tom:100,lemon:15,oil:8|Cook quinoa and cool.;Sauté shrimp with chili 3 min.;Toss with vegetables, lemon and oil; top with avocado.
Lemon-parmesan chicken pasta|chicken:170,pasta:70,zuc:120,tom:100,parm:15,oil:10|Boil pasta.;Pan-fry chicken strips and zucchini in oil 7 min.;Toss with pasta, tomato, lemon zest and parmesan.
Egg & feta shakshuka|egg:200,pass:250,pep:80,onion:50,feta:40,bread:60,chick:60|Soften onion and pepper; add tomatoes, chickpeas and spices; simmer 8 min.;Make wells and crack in the eggs; cover for 6 min.;Crumble feta on top; serve with bread.
Teriyaki salmon & rice|salmon:170,rice:60,broc:120,soy:20,honey:10|Cook the rice; steam broccoli.;Pan-sear salmon 4 min per side.;Glaze with soy and honey for the last minute.
Turkey burger & wedges|turkey:200,sweet:200,lett:40,tom:60,cheddar:20,oil:8|Cut sweet potato into wedges; roast with oil at 200°C for 25 min.;Shape and grill the turkey patty 5 min per side.;Top with cheddar; serve with lettuce and tomato.
Tuna poke bowl|tuna:140,rice:60,edam:80,cuc:80,avo:40,soy:15|Cook the rice.;Mix tuna with soy sauce.;Assemble over rice with edamame, cucumber and avocado.
Mushroom egg-white frittata|eggw:250,egg:100,mush:120,spin:60,mozz:40|Sauté mushrooms and spinach.;Pour in whisked eggs; add mozzarella.;Cook 4 min, then grill 3 min until set.
Beef & bean chili|beef:180,kidney:120,pass:200,onion:60,pep:80|Brown beef with onion and pepper.;Add tomatoes, beans and chili spices.;Simmer 25 min.
Chicken & vegetable soup|chicken:200,potato:100,carrot:80,onion:50,gbean:100|Simmer chicken in 600 ml water 15 min; shred.;Add diced vegetables and cook 15 min.;Return the chicken and season.
Chocolate chia protein pudding|whey:30,milk:200,chia:25,pb:15,skyr:100,cocoa:8|Whisk whey, cocoa and milk.;Stir in chia and skyr; chill 4 h.;Top with peanut butter.
Turkey zucchini boats|zuc:300,turkey:180,quin:40,pass:100,mozz:30|Halve zucchini and scoop out the centres.;Cook turkey with quinoa and tomatoes; fill the boats.;Top with mozzarella; bake at 200°C for 20 min.
Open tuna melt|tuna:150,bread:80,gyog:30,cheddar:25,tom:80|Mix tuna with yogurt.;Spread on toast, add tomato and cheddar.;Grill 3–4 min until melted.
Chicken hummus pita plate|chicken:170,hummus:60,cuc:100,tom:100,wrap:60|Grill chicken and slice.;Warm the wrap.;Serve with hummus, cucumber and tomato.`;
const TIMES35=[25,30,10,20,30,5,15,5,30,25,15,15,25,35,40,15,30,10,25,35,5,40,20,25,25,25,35,15,20,40,40,10,35,10,20];
const RW2=`Turkey & egg-white wrap|eggw:200,turkeyb:100,wrap:60,spin:50,cheddar:15|Whisk egg whites and cook as a thin omelette.;Pan-sear sliced turkey 3 min.;Fill the wrap with omelette, turkey, spinach and cheddar.|12
Greek yogurt chicken salad|chicken:170,gyog:100,cuc:100,lett:60,apple:80,wal:10|Poach or grill chicken, cool and shred.;Mix with yogurt, diced apple and cucumber.;Serve on lettuce with chopped walnuts.|20
Crispy cod tacos|cod:220,wrap:120,cab:80,avo:40,lemon:10,gyog:40|Pan-fry seasoned cod 3 min per side; flake.;Mix yogurt with lemon for the sauce.;Fill warm wraps with cod, cabbage, avocado and sauce.|20
Shrimp fried rice|shrimp:200,egg:100,rice:70,peas:60,carrot:50,soy:15,oil:6|Cook rice and cool.;Scramble egg; set aside.;Stir-fry shrimp, carrot and peas 4 min, add rice, egg and soy sauce.|20
Pork & cabbage stir-fry|pork:200,cab:200,carrot:60,rice:60,soy:15,garlic:5,oil:6|Cook the rice.;Stir-fry sliced pork 4 min, add garlic, carrot and cabbage.;Season with soy and serve over rice.|20
Chicken & feta stuffed sweet potato|sweet:300,chicken:150,feta:40,spin:60|Bake sweet potato at 200°C for 40 min (or microwave 8 min).;Sear diced chicken 6 min; wilt spinach.;Split the potato and fill with chicken, spinach and feta.|40
Steak & eggs breakfast plate|steak:150,egg:100,potato:150,spin:60,oil:6|Dice potato and pan-fry in oil 12 min.;Sear steak 3 min per side; rest and slice.;Fry the eggs and wilt spinach; plate everything.|25
Turkey hummus lettuce wraps|turkey:180,hummus:60,lett:80,cuc:80,tom:80,pep:60|Brown turkey with spices 7 min.;Spread hummus on lettuce leaves.;Add turkey and chopped vegetables.|20
Tuna pasta bake|tuna:150,wpasta:70,pass:200,mozz:40,onion:40,zuc:80|Boil pasta 8 min.;Simmer onion, zucchini and tomatoes 8 min; stir in tuna and pasta.;Top with mozzarella and bake at 200°C for 12 min.|35
Spicy chickpea & egg bowl|egg:150,chick:150,kale:80,pass:100,cott:60,feta:30|Simmer chickpeas, tomatoes and kale 8 min with chili.;Soft-boil or poach the eggs.;Serve with cottage cheese and crumbled feta.|20
Smoked salmon avocado toast|smoked:90,bread:80,avo:60,egg:100,lemon:5|Toast the bread and mash the avocado with lemon.;Poach the eggs 3 min.;Layer avocado, salmon and egg on toast.|10
Chicken Caesar-style salad|chicken:180,lett:150,parm:20,gyog:50,bread:40,lemon:10,oil:5|Grill chicken and slice; toast bread into croutons.;Whisk yogurt, lemon, parmesan and a splash of water for the dressing.;Toss lettuce with dressing, top with chicken and croutons.|20
Beef kofta with tzatziki|beef:200,onion:40,gyog:100,cuc:80,wrap:60,tom:60|Mix beef with grated onion and spices; shape into 6 fingers.;Grill or pan-fry 8 min, turning.;Mix yogurt with cucumber; serve in the wrap with tomato.|30
Tofu & spinach curry|tofu:250,pass:150,spin:80,onion:50,rice:60,oil:8|Fry onion with curry spices in oil 4 min.;Add cubed tofu and tomatoes, simmer 12 min.;Stir in spinach; serve on rice.|30
Tempeh noodle stir-fry|tempeh:180,wpasta:60,broc:120,carrot:50,soy:20,garlic:5,oil:6|Boil noodles.;Pan-fry sliced tempeh until golden, 6 min.;Add garlic and vegetables 4 min, toss with noodles and soy.|25
Chocolate protein oats|oats:50,whey:30,milk:200,cocoa:10,banana:80,alm:10|Cook oats in milk 4 min.;Stir in whey and cocoa off the heat.;Top with banana and almonds.|8
Cottage cheese berry toast|cott:250,bread:80,berry:100,honey:10,pump:15|Toast the bread.;Pile on cottage cheese.;Top with berries, seeds and honey.|8
Banana peanut protein shake|skyr:250,whey:30,banana:100,milk:200,pb:15|Add everything to a blender.;Blend 40 seconds until smooth.;Serve cold.|5
Turkey & lentil soup|turkey:180,potato:150,carrot:80,onion:50,gbean:100,lent:30|Brown turkey with onion 5 min.;Add diced vegetables, lentils and 700 ml water.;Simmer 25 min.|40
Shrimp & avocado salad|shrimp:230,avo:70,tom:100,cuc:100,lett:60,lemon:15,oil:8|Sauté shrimp 3 min.;Chop vegetables and avocado.;Toss with lemon and oil; top with warm shrimp.|15
Cod & potato chowder|cod:250,potato:200,corn:80,onion:50,milk:200,butter:8|Soften onion in butter; add diced potato and milk; simmer 12 min.;Add corn and cod chunks; cook 6 min.;Season with pepper and herbs.|35
Salmon & quinoa bowl|salmon:170,quin:60,edam:60,cuc:80,avo:30,soy:10|Cook quinoa.;Pan-sear salmon 4 min per side.;Assemble with edamame, cucumber and avocado; drizzle soy.|25
Chicken tikka skewers with raita|chicken:200,gyog:120,cuc:60,rice:50,onion:40,lemon:10|Marinate chicken in half the yogurt with spices for 15+ min.;Grill skewers 10 min, turning.;Mix remaining yogurt with cucumber; serve with rice.|30
Protein French toast|bread:100,egg:100,gyog:100,milk:100,berry:80,whey:15|Whisk eggs, milk and whey; soak the bread.;Pan-fry 3 min per side.;Serve with yogurt and berries.|12
Black bean & egg breakfast tacos|egg:150,bblack:100,wrap:120,cheddar:20,avo:40|Scramble the eggs.;Warm beans and wraps.;Fill wraps with egg, beans, cheddar and avocado.|15
Turkey sweet potato skillet|turkey:200,sweet:200,pep:100,spin:80,onion:50,oil:6|Pan-fry diced sweet potato 10 min.;Add turkey, pepper and onion for 8 min.;Fold in spinach until wilted.|30
Lemon herb chicken thighs & potatoes|thigh:220,potato:250,asp:120,oil:8,lemon:15,garlic:5|Toss potatoes and thighs with oil, lemon, garlic and herbs.;Roast at 200°C for 30 min.;Add asparagus for the last 8 min.|40
Smoked salmon rice bowl|smoked:120,rice:60,edam:70,cuc:70,avo:40,egg:50,soy:10|Cook rice; boil the egg 7 min.;Boil edamame 4 min.;Assemble with salmon, cucumber, avocado and soy.|20
Spinach-feta stuffed chicken|chicken:200,spin:100,feta:40,tom:60,quin:50|Cook quinoa.;Cut a pocket in the chicken and stuff with spinach and feta.;Bake at 190°C for 25 min; serve with tomato and quinoa.|35
Beef & lentil stew|beef:180,lent:50,pass:200,carrot:80,onion:60|Brown beef with onion and carrot.;Add lentils, tomatoes and 400 ml water.;Simmer 35 min.|45
Egg muffin cups|egg:150,eggw:100,x1:80,pep:60,spin:50,cheddar:20|Whisk eggs and whites; chop chicken, pepper and spinach.;Fill a muffin tin, add cheddar.;Bake at 190°C for 18 min.|25
Shrimp & cottage cheese pasta|pasta:70,shrimp:150,cott:100,spin:60,garlic:5,oil:5,lemon:10|Boil pasta.;Sauté garlic and shrimp 3 min, add spinach.;Toss with pasta, cottage cheese and lemon.|20
Greek baked cod with feta|cod:250,pass:200,feta:40,onion:50,cous:50,oil:8|Soften onion in oil; add tomatoes and simmer 6 min.;Nestle in the cod, top with feta; bake at 200°C for 15 min.;Serve with couscous.|30
Chicken & edamame noodle bowl|chicken:150,edam:80,wpasta:60,egg:50,broc:80,soy:20|Boil noodles and a soft egg (7 min).;Poach sliced chicken in simmering water 8 min.;Assemble with broccoli, edamame, egg and soy.|25
Yogurt turkey kebabs|turkeyb:220,gyog:100,pep:100,onion:60,cous:50,lemon:10|Marinate turkey cubes in yogurt and lemon.;Thread with pepper and onion; grill 10 min.;Serve with couscous.|30`;
const RW3=`High-protein chicken rice bowl|chicken:200,brice:150,broc:120,oil:8,soy:10|Cook the rice.;Pan-sear sliced chicken for 6 minutes.;Steam the broccoli.;Combine in a bowl and toss with soy sauce.|25
Tuna, egg and cottage cheese plate|tuna:150,egg:100,cott:150,cuc:100,tom:100,oil:5|Boil the eggs for 8 minutes.;Flake the tuna onto a plate.;Add cottage cheese, sliced cucumber and tomato.;Drizzle with oil.|12
Turkey chilli|turkey:200,kidney:150,tom:200,onion:80,pep:80,garlic:5|Soften onion, pepper and garlic.;Brown the turkey mince.;Add tomato and beans; simmer 20 minutes.|35
Salmon and quinoa with asparagus|salmon:180,quin:150,asp:120,lemon:15,oil:5|Cook the quinoa.;Roast salmon and asparagus at 200 °C for 12 minutes.;Serve with lemon.|25
Shrimp and broccoli stir-fry|shrimp:220,broc:150,brice:120,garlic:5,soy:15,oil:8|Cook the rice.;Stir-fry shrimp and garlic for 3 minutes.;Add broccoli and soy; cook 4 minutes.;Serve over rice.|20
Protein oats with banana|oats:60,whey:30,milk:200,banana:100,pb:15|Cook the oats in milk.;Stir in the whey off the heat.;Top with banana and peanut butter.|8
Greek yogurt power bowl|gyog:300,whey:25,berry:100,oats:30,chia:10|Stir whey into the yogurt.;Top with berries, oats and chia.|5
Tofu and spinach scramble|tofu:250,spin:100,mush:100,onion:50,oil:8,egg:100|Crumble tofu into a hot pan with oil.;Add onion and mushrooms; cook 5 minutes.;Add spinach and beaten eggs; stir until set.|15
Steak with sweet potato and green beans|steak:200,sweet:200,gbean:150,oil:8|Roast sweet potato wedges at 200 °C for 25 minutes.;Sear the steak 3 minutes a side and rest.;Steam the green beans.|30
Cod and lentil stew|cod:220,lent:60,tom:200,spin:80,onion:50|Simmer lentils with onion and tomato for 15 minutes.;Add the cod and cook 6 minutes.;Stir in spinach.|30
Egg white omelette with feta|eggw:250,egg:100,feta:40,spin:80,tom:80|Whisk the eggs and whites.;Cook in a non-stick pan.;Add spinach, tomato and feta; fold.|10
Chicken burrito wrap|chicken:180,wrap:120,bblack:100,avo:50,tom:80|Sear sliced chicken.;Warm the wraps.;Fill with chicken, beans, avocado and tomato and roll.|20
Pork tenderloin with potatoes|pork:220,potato:250,gbean:150,oil:8|Roast potatoes at 200 °C for 30 minutes.;Sear the pork, then roast 12 minutes.;Rest, slice and serve with green beans.|40
Tempeh and edamame bowl|tempeh:150,edam:100,brice:120,carrot:80,soy:10|Pan-fry sliced tempeh until golden.;Cook the rice and edamame.;Combine with grated carrot and soy.|20
Skyr berry cheesecake bowl|skyr:300,whey:25,berry:100,alm:15|Mix skyr and whey until smooth.;Top with berries and chopped almonds.|5
Turkey meatballs with wholewheat pasta|turkeyb:200,wpasta:80,tom:200,parm:15,garlic:5|Mix turkey with garlic and shape into balls.;Bake at 200 °C for 15 minutes.;Cook the pasta and warm the tomato.;Combine and top with parmesan.|35
Chicken thigh traybake|thigh:220,potato:200,zuc:150,pep:100,oil:8|Chop everything into chunks.;Toss with oil.;Roast at 200 °C for 35 minutes.|45
Tuna pasta salad|tuna:150,wpasta:80,tom:100,cuc:80,oil:8,feta:30|Cook and cool the pasta.;Mix with tuna, tomato, cucumber and feta.;Dress with oil.|15
Beef and broccoli with rice|beef:200,broc:200,brice:120,soy:15,garlic:5|Cook the rice.;Brown the beef with garlic.;Add broccoli and soy; cook 5 minutes.|25
Cottage cheese protein pancakes|cott:200,egg:100,oats:60,banana:80|Blend all the ingredients.;Cook small pancakes 2 minutes a side.|15`;
function mkR(l: string, tm?: number): Recipe {const[t,ing,st,m]=l.split("|");let k=0,p=0,c=0,f=0;const I=ing.split(",").map(x=>{const[key,g]=x.split(":"),d=FD[key],n=+g;k+=d.k*n/100;p+=d.p*n/100;c+=d.c*n/100;f+=d.f*n/100;const u=UN[key];return u?`${n/u[0]} ${n/u[0]>1?u[2]:u[1]}`:`${n} g ${d.n}`});
 return{t,p:Math.round(p),k:Math.round(k),c:Math.round(c),f:Math.round(f),ing:I,st:st.split(";"),m:+m||tm||20}}
export const REC: Recipe[] = [
{t:"Greek yogurt protein bowl",p:48,k:380,c:33,f:10,ing:["200 g Greek yogurt 0%","30 g whey protein","80 g berries","20 g oats","10 g walnuts"],st:["Stir whey into the yogurt until smooth.","Top with berries, oats and chopped walnuts."]},
{t:"Chicken & quinoa plate",p:52,k:610,c:60,f:21,ing:["170 g chicken breast","70 g quinoa (dry)","150 g broccoli","1 tbsp olive oil","1 lemon"],st:["Season chicken and pan-sear 6 min per side until 75°C inside.","Boil quinoa 12–15 min; steam broccoli 5 min.","Plate and finish with oil and lemon juice."]},
{t:"Salmon & lentil bowl",p:52,k:640,c:43,f:28,ing:["150 g salmon fillet","60 g red lentils (dry)","100 g spinach","1 tbsp tahini","1 lemon"],st:["Simmer lentils 12–15 min until soft.","Bake salmon at 200°C for 12 min.","Wilt spinach in the hot lentils, add salmon, drizzle tahini and lemon."]},
{t:"Cottage cheese egg scramble",p:41,k:590,c:32,f:30,ing:["4 eggs","150 g cottage cheese","2 slices wholegrain bread","1 tomato","Chives"],st:["Scramble eggs on low heat, stirring gently.","Fold in cottage cheese at the end.","Serve on toast with sliced tomato and chives."]},
{t:"Turkey & bean chili",p:50,k:450,c:35,f:12,ing:["200 g lean turkey mince","120 g kidney beans","200 g chopped tomatoes","1 onion","Chili, cumin, paprika"],st:["Brown onion and turkey 6–8 min.","Add spices, tomatoes and beans.","Simmer 20 min, stirring occasionally."]},
{t:"Tofu & edamame stir-fry",p:44,k:580,c:62,f:22,ing:["200 g firm tofu","150 g edamame","60 g rice (dry)","1 pepper","2 tbsp soy sauce"],st:["Cook the rice.","Fry cubed tofu until golden, 8 min.","Add edamame and pepper for 4 min, toss with soy sauce, serve on rice."]}];
[5,30,30,10,35,20].forEach((m,i)=>{REC[i].m=m});
REC.push(...RW.split("\n").map((l,i)=>mkR(l,TIMES35[i])));
REC.push(...RW2.split("\n").map(l=>mkR(l)));
Object.assign(FD,{buck:{n:"Buckwheat, cooked",k:92,p:3.4,c:20,f:.6},kef:{n:"Kefir",k:51,p:3.4,c:4.7,f:2},scr:{n:"Sour cream 15%",k:162,p:2.6,c:3.6,f:15},beet:{n:"Beetroot",k:43,p:1.6,c:10,f:.2},sir:{n:"Sirene (white brined cheese)",k:264,p:14,c:1.5,f:21},rye:{n:"Rye bread",k:259,p:8.5,c:48,f:3.3},kot:{n:"Pork cutlet, grilled",k:231,p:27,c:0,f:13},cof:{n:"Coffee with milk",k:30,p:1.6,c:2.4,f:1.4}});
export const ALI: Record<string, string> = {chicken:"курица куриная грудка филе|пиле пилешко филе гърди",thigh:"куриное бедро окорочок|пилешки бут",turkeyb:"индейка грудка|пуешко месо гърди",turkey:"индейка фарш|пуешки кайма",beef:"говядина фарш|телешка кайма говеждо",steak:"говядина стейк|телешки стек говеждо",pork:"свинина вырезка|свинско месо",salmon:"лосось семга|сьомга сьомга филе",cod:"треска|треска риба",tuna:"тунец консервированный|риба тон консерва",shrimp:"креветки|скариди",smoked:"копченый лосось|пушена сьомга",egg:"яйцо яйца|яйце яйца",eggw:"яичный белок белки|яйчен белтък белтъци",gyog:"греческий йогурт|гръцко кисело мляко йогурт",cott:"творог|извара котидж сирене",skyr:"скир|скир",whey:"протеин сывороточный|суроватъчен протеин",tofu:"тофу|тофу",tempeh:"темпе|темпе",edam:"эдамаме|едамаме",lent:"чечевица красная|леща червена",chick:"нут|нахут",bblack:"черная фасоль|черен боб",kidney:"красная фасоль|червен боб фасул",mozz:"моцарелла|моцарела",feta:"фета брынза|фета сирене",parm:"пармезан|пармезан",cheddar:"чеддер сыр|чедър кашкавал",rice:"рис белый|ориз бял",brice:"рис бурый коричневый|кафяв ориз",quin:"киноа|киноа",oats:"овсянка овсяные хлопья|овесени ядки зърнена каша",pasta:"паста макароны|паста макарони спагети",wpasta:"цельнозерновая паста|пълнозърнеста паста",cous:"кускус|кускус",potato:"картофель картошка|картоф картофи",sweet:"батат сладкий картофель|сладък картоф батат",bread:"хлеб цельнозерновой|хляб пълнозърнест",wrap:"лепешка тортилья|тортила дюнер",banana:"банан|банан",apple:"яблоко|ябълка",orange:"апельсин|портокал",berry:"ягоды лесные|горски плодове ягоди",mango:"манго|манго",broc:"брокколи|броколи",spin:"шпинат|спанак",zuc:"кабачок цукини|тиквичка",pep:"перец болгарский сладкий|чушка пипер",tom:"помидор томат|домат",cuc:"огурец|краставица",onion:"лук репчатый|лук",carrot:"морковь|морков",mush:"грибы шампиньоны|гъби печурки",caul:"цветная капуста|карфиол",asp:"спаржа|аспержи",gbean:"стручковая фасоль|зелен фасул",kale:"капуста кале|къдраво зеле кейл",avo:"авокадо|авокадо",corn:"кукуруза|царевица",peas:"горох зеленый|грах",cab:"капуста белокочанная|зеле",lett:"салат листовой|маруля салата",garlic:"чеснок|чесън",oil:"масло оливковое|зехтин маслиново масло",butter:"масло сливочное|краве масло",pb:"арахисовая паста|фъстъчено масло",alm:"миндаль|бадеми",wal:"грецкие орехи|орехи",chia:"семена чиа|чия семена",pump:"тыквенные семечки|тиквени семки",tahini:"тахини паста кунжутная|тахан",honey:"мед|мед",soy:"соевый соус|соев сос",hummus:"хумус|хумус",milk:"молоко|мляко прясно",almilk:"миндальное молоко|бадемово мляко",pass:"томаты в собственном соку пассата|домати на кубчета пасатa",lemon:"лимонный сок лимон|лимонов сок лимон",dchoc:"темный шоколад горький|тъмен шоколад",cocoa:"какао порошок|какао на прах",x1:"курица вареная жареная грудка|пилешко варено печено",x2:"рис вареный|ориз варен",x3:"макароны вареные|паста варена",x4:"стейк говяжий жареный|говеждо стек печено",x5:"йогурт натуральный|кисело мляко",x6:"белый хлеб батон|бял хляб",x7:"пицца маргарита|пица маргарита",x8:"протеиновый батончик|протеинов бар",x9:"овсяная каша|овесена каша",x10:"яйцо вареное|яйце варено",x11:"лосось запеченный|сьомга печена",x12:"сыр эдам|сирене кашкавал едам",buck:"гречка гречневая каша|елда хайвер",kef:"кефир|кефир айрян",scr:"сметана|заквасена сметана",beet:"свекла|цвекло",sir:"сыр брынза болгарский|сирене бяло саламурено",rye:"хлеб ржаной|ръжен хляб",kot:"котлета свиная|свинска пържола котлет",cof:"кофе с молоком|кафе с мляко"};
const BGP=`bg1|Vereia – Kiselo mlyako 3.6% (yogurt)|64|3.4|4.1|3.6|верея кисело мляко 3.6%|vereya vereia
bg2|Vereia – Pryasno mlyako 3% (milk)|58|3.3|4.7|3|верея прясно мляко 3%|vereya vereia
bg3|Vereia – Byalo sirene (white brined cheese)|255|15|1.5|21|верея бяло саламурено сирене|vereya vereia
bg4|Sayana – Kashkaval (yellow cheese)|350|25|1|28|саяна кашкавал|sayana
bg5|Sayana – Kiselo mlyako 2% (yogurt)|52|3.6|4|2|саяна кисело мляко 2%|sayana
bg6|Domlyan – Krave maslo 82% (butter)|745|.5|.6|82|домлян краве масло|domlian domlyan
bg7|Domlyan – Kiselo mlyako 3.6% (yogurt)|64|3.4|4.1|3.6|домлян кисело мляко|domlian domlyan
bg8|Pilko – Pileshko file (chicken fillet)|110|23|0|2|пилко пилешко филе|pilko
bg9|Kenar – Pileshko file (chicken fillet)|110|23|0|2|кенар пилешко филе|kenar
bg10|Tandem – Lukanka (dry sausage)|420|27|3|33|тандем луканка|tandem
bg11|Tandem – Pileshka shunka (chicken ham)|105|17|2|3|тандем пилешка шунка|tandem
bg12|Olympus – Greek yogurt 2%|73|5|4|3.8|олимпус гръцко кисело мляко|olimp olympus
bg13|Lactima – Izvara (quark)|90|12|3.5|3|лактима извара|laktima lactima
bg14|Madjarov – Pileshko fileta (chicken breast)|115|22|0|3|маджаров пилешко|madzharov madjarov`;
BGP.split("\n").forEach(l=>{const[k,n,kc,p,c,f,cy,lat]=l.split("|");FD[k]={n,k:+kc,p:+p,c:+c,f:+f,b:1};ALI[k]=cy+"|"+cy+" "+lat});
REC.push(...RW3.split("\n").map(l => mkR(l)));
export const nz = (s: string) => String(s).toLowerCase().replace(/ё/g, "е").replace(/й/g, "и");
export const FDK = Object.keys(FD);
export const FSRC = FDK.map(k => ({ k, h: nz(FD[k].n + " " + (ALI[k] || "").replace("|", " ")) }));
export function stem(t: string) { return /[а-я]/.test(t) && t.length > 4 ? t.slice(0, t.length > 6 ? -2 : -1) : t }
export const TIPS: [string, string][] = [["Protein","Aim for about 1.6–2.2 g per kg of body weight a day. More than that adds little (Morton 2018)."],["Spread it out","3–5 meals with roughly 0.3–0.4 g/kg of protein each works well for muscle building (Schoenfeld &amp; Aragon 2018)."],["Carbs fuel training","3–6 g/kg a day suits regular lifting, more if sessions are long or you also do cardio. Have a carb and protein meal 1–3 h before training (Burke 2011)."],["After training","Total daily intake matters most. Eating protein within a few hours after training is a good habit, not a magic window (Schoenfeld 2013)."],["Creatine","Creatine monohydrate, 3–5 g a day at any time, is one of the best-supported supplements for strength and muscle (ISSN 2017)."],["Caffeine","3–6 mg/kg about an hour before training can improve performance (Grgic 2020). Avoid it late in the day, as sleep matters more."],["Hydration","Drink about 5–7 ml/kg in the 2–4 h before training, sip during, and replace fluid afterwards (ACSM 2016)."],["When cutting","Keep protein at 2.0–2.4 g/kg and aim to lose about 0.5–1% of body weight a week to protect muscle (Helms 2014)."],["When gaining","A surplus of 5–10% is enough. Aim for 0.25–0.5% body-weight gain a week to limit fat gain (Iraki 2019)."],["Fats and fibre","Keep fat at 20–35% of calories, mostly unsaturated, and fibre at 25–35 g a day."],["Sleep","7–9 hours supports recovery and appetite control. Short sleep reduces strength gains."],["Food first","Whole foods first, supplements only to fill gaps. General information, not medical advice."]];
