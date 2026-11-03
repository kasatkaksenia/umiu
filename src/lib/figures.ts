// @ts-nocheck
// SVG drawings built as strings: muscle map, animated exercise figure, plate illustration, hormone chart.
// They contain only generated markup (user text is escaped), so they are safe to inject.
import { AN } from "../data/exercises";
import { esc } from "./util";
export function fig(P: string, Q?: string){const Pa=P.split(","),Qa=(Q||"").split(",");const a=k=>`fill="var(--ac)" fill-opacity="${Pa.includes(k)?1:Qa.includes(k)?.45:0}"`,
 E=(k,x,y,rx,ry)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${a(k)}/>`,Y=(k,c,d,y,rx,ry)=>E(k,c-d,y,rx,ry)+E(k,c+d,y,rx,ry),
 B=c=>`<g fill="var(--ln)"><circle cx="${c}" cy="8" r="6"/><rect x="${c-11}" y="16" width="22" height="35" rx="7"/><rect x="${c-20}" y="18" width="6" height="30" rx="3"/><rect x="${c+14}" y="18" width="6" height="30" rx="3"/><rect x="${c-10}" y="50" width="9" height="46" rx="4"/><rect x="${c+1}" y="50" width="9" height="46" rx="4"/></g>`;
 return`<svg viewBox="0 0 120 106">${B(30)}${B(90)}${Y("de",30,13,22,5,5)}${E("ch",30,27,10,5)}${E("ab",30,40,6,7)}${Y("bi",30,17,32,3,7)}${Y("qd",30,5.5,67,5,12)}${Y("ad",30,11,52,3,5)}${Y("ca",30,5,86,3.5,8)}${Y("de",90,13,22,5,5)}${E("ba",90,30,10,10)}${Y("tr",90,17,32,3,7)}${E("lb",90,44,6,4)}${Y("gl",90,5.5,54,6,5)}${Y("ha",90,5.5,70,5,10)}${Y("ad",90,11,52,3,5)}${Y("ca",90,5,86,3.5,8)}<text x="22" y="105">Front</text><text x="84" y="105">Back</text></svg>`}
const lp2=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];
function ik(p,q,L,h){let dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy)||1;const m=2*L*.999;if(d>m){q=[p[0]+dx/d*m,p[1]+dy/d*m];dx=q[0]-p[0];dy=q[1]-p[1];d=m}
 const hh=Math.sqrt(Math.max(0,L*L-d*d/4));let nx=-dy/d,ny=dx/d;if(nx*h[0]+ny*h[1]<0){nx=-nx;ny=-ny}return[[p[0]+dx/2+nx*hh,p[1]+dy/2+ny*hh],q]}
export function figSvg(id: string, u: number){const A=AN[id];if(!A)return"";const G=k=>A.a[k]?lp2(A.a[k],A.b[k]||A.a[k],u):null,f=v=>v.map(n=>n.toFixed(1)).join(",");
 const ln=(pts,w,o)=>`<polyline points="${pts.map(f).join(" ")}" fill="none" stroke="var(--ac)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o?` opacity="${o}"`:""}/>`;
 let o=`<line x1="4" y1="74.5" x2="96" y2="74.5" stroke="var(--ln)" stroke-width="1.5"/>`+(A.st||[]).map(s=>`<line x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}" stroke="var(--mu)" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>`).join("");
 const sh0=G("sh"),hip=G("hip"),wr=G("wr"),ank=G("ank");let P={};
 if(A.F){const sh2=G("sh2"),wr2=G("wr2"),kn=G("kn"),kn2=G("kn2"),ank2=G("ank2"),mid=[(sh0[0]+sh2[0])/2,(sh0[1]+sh2[1])/2],hr=[hip[0]+5,hip[1]],hl=[hip[0]-5,hip[1]],[e1,w1]=ik(sh0,wr,11,A.eh),[e2,w2]=ik(sh2,wr2,11,A.eh2);
  P={kn,kn2,wr:w1,wr2:w2,ank,ank2,sh:sh0,hip};
  o+=ln([hl,kn2,ank2],3.4)+ln([hr,kn,ank],3.4)+ln([mid,hip],3.6)+ln([hl,hr],3.4)+ln([sh2,sh0],3.4)+ln([sh0,e1,w1],3.2)+ln([sh2,e2,w2],3.2)+`<circle cx="${mid[0]}" cy="${mid[1]-7}" r="4.5" fill="var(--ac)"/>`}
 else{let dx=sh0[0]-hip[0],dy=sh0[1]-hip[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;const sh=[hip[0]+dx*20,hip[1]+dy*20],head=[sh[0]+dx*6.5,sh[1]+dy*6.5],[kn,an]=ik(hip,ank,17,A.kh),[el,w]=ik(sh,wr,11,A.eh);
  P={sh,hip,kn,ank:an,el,wr:w,toe:G("toe")};const a2=G("a2");
  if(a2){const[k2,an2]=ik(hip,a2,17,A.kh2||A.kh);o+=ln([hip,k2,an2],3.2,.4)}
  o+=ln([an,kn,hip,sh,el,w],3.4)+`<circle cx="${head[0].toFixed(1)}" cy="${head[1].toFixed(1)}" r="4.5" fill="var(--ac)"/>`;
  if(P.toe)o+=ln([an,P.toe],3)}
 (A.pr||[]).forEach(([n,k,x])=>{const p=P[n];if(!p)return;const c=`cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}"`;
  if(k=="o")o+=`<circle ${c} r="3.2" fill="var(--tx)"/>`;else if(k=="d")o+=`<circle ${c} r="2.4" fill="var(--tx)"/>`;
  else if(k=="q")o+=`<circle ${c} r="3.2" fill="var(--card)" stroke="var(--mu)" stroke-width="1.4"/>`;
  else if(k=="c")o+=`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${x[0]}" y2="${x[1]}" stroke="var(--mu)" stroke-width=".9"/><circle ${c} r="2.4" fill="var(--tx)"/>`;
  else if(k=="p"){let vx=p[0]-hip[0],vy=p[1]-hip[1];const d=Math.hypot(vx,vy)||1;vx/=d;vy/=d;const bx=p[0]+vx*3,by=p[1]+vy*3;o+=`<line x1="${(bx+vy*10).toFixed(1)}" y1="${(by-vx*10).toFixed(1)}" x2="${(bx-vy*10).toFixed(1)}" y2="${(by+vx*10).toFixed(1)}" stroke="var(--mu)" stroke-width="3" stroke-linecap="round"/>`}});
 return`<svg viewBox="0 0 100 80" role="img" aria-label="Exercise animation" style="width:100%;display:block">${o}</svg>`}
const CATS=[["shrimp",/shrimp|prawn/],["fish",/salmon|tuna|cod/],["beef",/beef|pork|mince|steak/],["chicken",/chicken|turkey/],["egg",/\begg/],["tofu",/tofu|tempeh|edamame/],["dairy",/yogurt|yoghurt|cottage|skyr|quark|whey|mozzarella|feta|parmesan|cheddar/],["rice",/rice|quinoa|couscous/],["pasta",/pasta|noodle/],["bread",/bread|wrap|tortilla|pita/],["potato",/potato/],["oats",/oat|chia/],["broc",/broccoli|cauliflower/],["greens",/spinach|lettuce|kale|cucumber|zucchini|courgette|asparagus|green beans|cabbage|bean sprouts/],["tomato",/tomato/],["pepper",/pepper|carrot|onion/],["avo",/avocado/],["berries",/berr|banana|apple|mango|orange/],["beans",/bean|lentil|chickpea|peas/],["nuts",/almond|walnut|peanut|seed|tahini/]];
export function dish(r: { t: string; ing: string[] }){const txt=r.ing.join(" ").toLowerCase();let h=0;for(const ch of r.t)h=(h*31+ch.charCodeAt(0))>>>0;const rnd=()=>(h=(h*1664525+1013904223)>>>0)/4294967296;
 const cats=CATS.filter(c=>c[1].test(txt)).map(c=>c[0]).slice(0,5),bowl=["dairy","oats"].includes(cats[0])&&!cats.includes("rice");
 const S5=[[40,44],[63,44],[42,66],[63,64],[52,53]],sl=cats.length>3?S5:cats.length==3?[[38,45],[64,46],[52,66]]:cats.length==2?[[40,50],[63,52]]:[[52,52]];
 const E=(n,fn)=>Array.from({length:n},(_,i)=>fn(i)).join(""),J=(a)=>(rnd()-.5)*a;
 const F={chicken:(x,y)=>E(3,i=>`<rect x="${x-9+i*7+J(3)}" y="${y-8+i*5+J(3)}" width="16" height="9" rx="4.5" fill="#e0ad70" stroke="#bd8647" stroke-width="1"/>`),
 beef:(x,y)=>E(3,i=>`<rect x="${x-9+i*6+J(3)}" y="${y-8+i*5+J(3)}" width="16" height="8" rx="4" fill="#8f4e3b" stroke="#6e3626"/>`),
 fish:(x,y)=>E(2,i=>`<rect x="${x-9+i*6}" y="${y-7+i*8}" width="20" height="10" rx="4" fill="${/salmon/.test(txt)?"#f08a62":"#f1e8d4"}" stroke="#d3744d"/><path d="M${x-5+i*6} ${y-5+i*8}l5 6M${x+1+i*6} ${y-5+i*8}l5 6" stroke="#fbd1bd" stroke-width="1.2"/>`),
 shrimp:(x,y)=>E(4,i=>`<path d="M${x-9+i*5} ${y-6+i*4}q9 -4 8 5q-1 5 -5 4" fill="none" stroke="#f2877a" stroke-width="3.5" stroke-linecap="round"/>`),
 egg:(x,y)=>E(2,i=>`<ellipse cx="${x-4+i*9}" cy="${y-3+i*7}" rx="9" ry="7" fill="#fff" stroke="#e3dccb"/><circle cx="${x-4+i*9}" cy="${y-3+i*7}" r="3.6" fill="#f6b61e"/>`),
 tofu:(x,y)=>E(4,i=>`<rect x="${x-9+(i%2)*9+J(2)}" y="${y-8+(i>>1)*9+J(2)}" width="8" height="8" rx="1.5" fill="#f3e4b6" stroke="#d6c28a"/>`),
 dairy:(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="13" ry="10" fill="#fffdf4" stroke="#e8e1cf"/><path d="M${x-6} ${y-2}q6 -5 12 0" stroke="#e8e1cf" fill="none"/>`,
 rice:(x,y)=>E(26,()=>`<ellipse cx="${x+J(24)}" cy="${y+J(18)}" rx="2.2" ry="1.2" transform="rotate(${rnd()*180} ${x} ${y})" fill="#fffaf0" stroke="#e4dcc6" stroke-width=".4"/>`),
 pasta:(x,y)=>E(7,i=>`<path d="M${x-12} ${y-8+i*3}q6 -5 12 0t12 0" fill="none" stroke="#f0c864" stroke-width="2.2" stroke-linecap="round"/>`),
 bread:(x,y)=>E(2,i=>`<rect x="${x-9+i*6}" y="${y-8+i*6}" width="15" height="13" rx="3" fill="#e0b074" stroke="#b9854a"/>`),
 potato:(x,y)=>E(6,()=>`<rect x="${x+J(22)-4}" y="${y+J(16)-4}" width="8" height="8" rx="2" transform="rotate(${rnd()*60} ${x} ${y})" fill="#ebbd5e" stroke="#c8963a" stroke-width=".8"/>`),
 oats:(x,y)=>E(22,()=>`<ellipse cx="${x+J(24)}" cy="${y+J(18)}" rx="2.4" ry="1.5" fill="#d9c08f"/>`),
 broc:(x,y)=>E(4,i=>`<circle cx="${x-9+i*6+J(3)}" cy="${y-5+(i%2)*7}" r="5.2" fill="#4f9a3f"/><circle cx="${x-9+i*6+J(3)}" cy="${y-6+(i%2)*7}" r="3.4" fill="#68b255"/>`),
 greens:(x,y)=>E(8,()=>`<ellipse cx="${x+J(24)}" cy="${y+J(18)}" rx="6.5" ry="3.4" transform="rotate(${rnd()*180} ${x} ${y})" fill="#5fae4e" stroke="#3f8a35" stroke-width=".7"/>`),
 tomato:(x,y)=>E(4,i=>`<circle cx="${x-9+i*6+J(3)}" cy="${y-5+(i%2)*8}" r="4.8" fill="#dd4a3c" stroke="#b83428"/>`),
 pepper:(x,y)=>E(6,i=>`<rect x="${x+J(22)-5}" y="${y+J(16)-1.5}" width="10" height="3.4" rx="1.7" transform="rotate(${rnd()*180} ${x} ${y})" fill="${i%2?"#f1a431":"#e9703a"}"/>`),
 avo:(x,y)=>E(3,i=>`<ellipse cx="${x-6+i*6}" cy="${y-4+i*4}" rx="7" ry="4.5" transform="rotate(${-25+i*20} ${x} ${y})" fill="#a8cf6a" stroke="#4f8a2a"/>`),
 berries:(x,y)=>E(9,i=>`<circle cx="${x+J(22)}" cy="${y+J(16)}" r="3.2" fill="${["#6a3d8f","#c4325f","#4a5bb0"][i%3]}"/>`),
 beans:(x,y)=>E(10,()=>`<ellipse cx="${x+J(22)}" cy="${y+J(16)}" rx="3.2" ry="2.1" transform="rotate(${rnd()*180} ${x} ${y})" fill="#a45d36"/>`),
 nuts:(x,y)=>E(7,()=>`<ellipse cx="${x+J(20)}" cy="${y+J(14)}" rx="3.2" ry="2.2" transform="rotate(${rnd()*180} ${x} ${y})" fill="#9a6a3e"/>`)};
 const body=cats.map((c,i)=>F[c](sl[i%sl.length][0],sl[i%sl.length][1])).join("");
 return`<svg viewBox="0 0 100 100" style="width:96px;flex:none" role="img" aria-label="Illustration of ${esc(r.t)}"><circle cx="50" cy="52" r="47" fill="#00000014"/><circle cx="50" cy="50" r="47" fill="#fbfaf7" stroke="#e2ddd2"/><circle cx="50" cy="50" r="38" fill="${bowl?"#f3ead7":"#f4f1ea"}" stroke="#e6dfd0"/>${body}</svg>`}
export function hormones(c, p) {const L=c.len||28,ov=L-14,per=c.per||5,W=340,H=150,X=d=>10+(d-1)/(L-1)*(W-20),Y=v=>H-24-v*.92*(H-44),g=(d,m,s)=>Math.exp(-Math.pow((d-m)/s,2)),
 E=d=>.14+.78*g(d,ov-1,2.1)+.38*g(d,ov+7,3.6),Pg=d=>.05+.95*g(d,ov+7,3.4),T=d=>.22+.3*g(d,ov,1.6)+.06*g(d,ov+6,3),
 sm=pts=>{let s="M"+pts[0][0].toFixed(1)+","+pts[0][1].toFixed(1);for(let i=0;i<pts.length-1;i++){const a=pts[i-1]||pts[i],b=pts[i],c2=pts[i+1],d=pts[i+2]||c2;s+=`C${(b[0]+(c2[0]-a[0])/6).toFixed(1)},${(b[1]+(c2[1]-a[1])/6).toFixed(1)} ${(c2[0]-(d[0]-b[0])/6).toFixed(1)},${(c2[1]-(d[1]-b[1])/6).toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)}`}return s},
 path=f=>{const P=[];for(let d=1;d<=L+.01;d+=1)P.push([X(d),Y(f(d))]);return sm(P)},
 B=[[1,per+.5,"Menstrual"],[per+.5,ov-1.5,"Follicular"],[ov-1.5,ov+1.5,"Ovulation"],[ov+1.5,L+.5,"Luteal"]],F3=[[E,"var(--h1)"],[Pg,"var(--h2)"],[T,"var(--h3)"]];
 let s=B.map((b,i)=>`<rect x="${X(Math.max(1,b[0]))}" y="6" width="${Math.max(0,X(Math.min(L,b[1]))-X(Math.max(1,b[0])))}" height="${H-30}" rx="8" fill="var(--ac)" fill-opacity="${i%2?.05:.12}"/><text class="ht" x="${(X(Math.max(1,b[0]))+X(Math.min(L,b[1])))/2}" y="${H-8}" text-anchor="middle">${b[2]}</text>`).join("");
 s+=F3.map(([f,c2])=>`<path d="${path(f)}" fill="none" stroke="${c2}" stroke-width="7" stroke-linecap="round" opacity=".14"/><path d="${path(f)}" fill="none" stroke="${c2}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
 if(p){const x=X(p.day);s+=`<line x1="${x}" y1="18" x2="${x}" y2="${H-26}" stroke="var(--tx)" stroke-dasharray="3 3" opacity=".6"/>`+F3.map(([f,c2])=>`<circle cx="${x}" cy="${Y(f(p.day))}" r="4" fill="${c2}" stroke="var(--tx)" stroke-width="1.2"/>`).join("")+`<rect x="${Math.min(W-44,Math.max(2,x-20))}" y="0" width="40" height="16" rx="8" fill="var(--btn)"/><text class="ht" x="${Math.min(W-24,Math.max(22,x))}" y="11.5" text-anchor="middle" style="fill:var(--btnt)">Day ${p.day}</text>`}
 return`<svg class="hc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Typical hormone pattern across the cycle with today marked">${s}</svg>`}
