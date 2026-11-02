// @ts-nocheck
// Generative artwork painted on <canvas>: hero banners and one picture per quote.
// Each painter draws into a 2D context; av() and avq() cache the result as a CSS variable.
export function mb(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mkN(seed){const R=mb(seed),P=Array.from({length:256},()=>R()),H=(a,b)=>P[(((a*57+b*131)%256)+256)%256],n=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=H(xi,yi),b=H(xi+1,yi),c=H(xi,yi+1),d=H(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};return(x,y)=>n(x,y)*.6+n(x*2,y*2)*.3+n(x*4,y*4)*.1}
function gWind(c,w,h,R,N,pal){const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,"#a5bcd6");g.addColorStop(.5,"#5d7a9c");g.addColorStop(1,"#231815");c.fillStyle=g;c.fillRect(0,0,w,h);
 const gl=c.createRadialGradient(w*.75,h*.25,0,w*.75,h*.25,w*.7);gl.addColorStop(0,"rgba(245,239,198,.55)");gl.addColorStop(1,"rgba(235,240,215,0)");c.fillStyle=gl;c.fillRect(0,0,w,h);
 const P=pal||["#f5efc6","#a5bcd6","#4a2e27","#e6d5b8","#7f9bbd"];c.lineCap="round";
 for(let i=0;i<180;i++){let x=R()*w*1.2-w*.1,y=R()*h;c.strokeStyle=P[i%P.length];c.globalAlpha=.05+R()*.2;c.lineWidth=1+R()*6;c.beginPath();c.moveTo(x,y);for(let s=0;s<70;s++){const a=N(x/w*2.2,y/h*2.2)*7+Math.sin(y/h*3)*.8;x+=Math.cos(a)*(w/90);y+=Math.sin(a)*(h/90);c.lineTo(x,y)}c.stroke()}c.globalAlpha=1}
function pn(seed){const R=mb(seed),p=new Uint8Array(512),G=[];for(let i=0;i<256;i++)p[i]=i;for(let i=255;i>0;i--){const j=Math.floor(R()*(i+1)),t=p[i];p[i]=p[j];p[j]=t}for(let i=0;i<256;i++){p[i+256]=p[i];const a=R()*6.2832;G.push([Math.cos(a),Math.sin(a)])}
 const fd=t=>t*t*t*(t*(t*6-15)+10),gr=(h,x,y)=>{const v=G[h];return v[0]*x+v[1]*y};
 return(x,y)=>{const X=Math.floor(x),Y=Math.floor(y),xf=x-X,yf=y-Y,xi=X&255,yi=Y&255,aa=p[p[xi]+yi],ab=p[p[xi]+yi+1],ba=p[p[xi+1]+yi],bb=p[p[xi+1]+yi+1],u=fd(xf),v=fd(yf),a=gr(aa,xf,yf),b=gr(ba,xf-1,yf),c=gr(ab,xf,yf-1),d=gr(bb,xf-1,yf-1),l1=a+(b-a)*u,l2=c+(d-c)*u;return(l1+(l2-l1)*v)*.9+.5}}
const fb=(n,x,y,o)=>{let s=0,a=.5,f=1,t=0;for(let i=0;i<(o||4);i++){s+=a*(n(x*f,y*f)-.5);t+=a;a*=.5;f*=2}return s/t+.5};
const cl01=x=>x<0?0:x>1?1:x,mx=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],sst=(a,b,x)=>{x=cl01((x-a)/(b-a));return x*x*(3-2*x)};
function pix(c,w,h,fn){const I=c.createImageData(w,h),d=I.data;let k=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const o=fn(x,y),n=(Math.random()-.5)*3.2;d[k++]=o[0]+n;d[k++]=o[1]+n;d[k++]=o[2]+n;d[k++]=255}c.putImageData(I,0,0)}
const WP=[[[52,26,20],[200,116,66],[128,66,42]],[[36,20,18],[160,104,70],[96,56,40]],[[120,96,76],[236,210,176],[180,150,116]],[[60,16,20],[176,64,50],[112,34,34]]];
function aWood(c,w,h,R,N0,v,p){const N=pn(R()*1e6|0),M=pn(R()*1e6|0),K=WP[(p||0)%4],A=K[0],B=K[1],C=K[2];
 pix(c,w,h,(x,y)=>{const u=x/w*2.2,v=y/h*1.5,warp=fb(N,u*.8,v*.8,3),ring=v*5.2+warp*4.6+fb(M,u*.4,v*3,2)*1.4,s=Math.sin(ring*6.2832)*.5+.5,t=Math.pow(s,1.5),gn=fb(M,u*26,v*170,2),dark=1-sst(.18,0,s)*.0;
  let col=mx(C,B,t);col=mx(col,A,sst(.2,0,s)*.7);const L=.82+.3*(1-Math.abs(x/w-.35)*1.2)+(gn-.5)*.35;return[col[0]*L,col[1]*L,col[2]*L]})}
const SP_=[[[104,100,98],[142,134,126],[176,160,140],[120,108,100],[188,138,104],[88,84,86]],[[90,100,112],[130,144,160],[168,182,196],[104,116,130],[150,160,150],[72,82,96]],[[176,150,120],[208,184,150],[230,210,180],[160,132,104],[196,160,120],[140,112,88]],[[150,80,56],[190,110,76],[214,140,100],[120,62,46],[176,120,96],[96,52,44]]];
function aStone(c,w,h,R,N0,v,p){const N=pn(R()*1e6|0),P=[];for(let i=0;i<46;i++)P.push([R()*w,R()*h,R()]);const pal=SP_[(p||0)%4];
 pix(c,w,h,(x,y)=>{let d1=1e9,d2=1e9,id=0;for(let i=0;i<46;i++){const dx=x-P[i][0],dy=y-P[i][1],dd=dx*dx+dy*dy;if(dd<d1){d2=d1;d1=dd;id=i}else if(dd<d2)d2=dd}
  const e=Math.sqrt(d2)-Math.sqrt(d1),base=pal[Math.floor(P[id][2]*pal.length)%pal.length],gn=fb(N,x/38,y/38,4),fine=fb(N,x/5,y/5,2),shade=.78+.32*P[id][2]+(gn-.5)*.5,edge=sst(0,9,e);
  const dx=x-P[id][0],dy=y-P[id][1],lit=1+(-dx*.0016-dy*.0022);return[base[0]*shade*lit*(.35+.65*edge)*(.92+fine*.16),base[1]*shade*lit*(.35+.65*edge)*(.92+fine*.16),base[2]*shade*lit*(.35+.65*edge)*(.92+fine*.16)]})}
const WA=[[[16,48,82],[92,138,176],[250,240,206]],[[10,60,64],[70,156,150],[236,248,214]],[[30,36,92],[110,120,190],[250,230,240]],[[70,40,70],[190,120,150],[255,226,200]]];
function aWater(c,w,h,R,N0,v,p){const K=WA[(p||0)%4],N=pn(R()*1e6|0),D=K[0],Mi=K[1],Hi=K[2],cx=w*(.4+R()*.2),cy=h*(.4+R()*.2);
 pix(c,w,h,(x,y)=>{const u=x/w*2.4,v=y/h*1.8,q=fb(N,u,v,3),r=fb(N,u+q*1.7+5.2,v+q*1.7+1.3,3),ca=Math.pow(cl01(1-Math.abs(r-.5)*2.4),5),dist=Math.hypot(x-cx,(y-cy)*1.4),rg=Math.sin(dist/20+q*7)*.5+.5;
  let col=mx(D,Mi,cl01(r*1.3+rg*.12));col=mx(col,Hi,cl01(ca*.9+Math.pow(rg,6)*.12));return col})}
const GP=[[[232,204,176],[250,236,216],[190,150,122]],[[238,206,200],[252,232,226],[196,150,146]],[[206,214,190],[236,242,222],[150,166,132]],[[200,180,160],[232,216,196],[140,120,100]]];
function aGills(c,w,h,R,N0,v,p){const G_=GP[(p||0)%4],N=pn(R()*1e6|0),fx=w*(.45+R()*.1),fy=h*2.2,K=70+R()*20|0;
 pix(c,w,h,(x,y)=>{const a=Math.atan2(x-fx,fy-y),dist=Math.hypot(x-fx,fy-y),wp=fb(N,x/260,y/260,3),s=Math.sin(a*K+wp*5)*.5+.5,t=Math.pow(s,.8),dk=sst(0,1,dist/(h*2.4));
  const col=mx(mx(G_[0],G_[1],t),G_[2],(1-t)*.45+dk*.15);const L=.9+.12*Math.sin(a*K*.5+wp*3);return[col[0]*L,col[1]*L,col[2]*L]})}
const SK=[["#7fa5cf","#cfdcea","#f7e6c8","#e9a98a"],["#4b4a8a","#a89cc8","#f2c9c0","#f0a083"],["#4f8fd0","#a9cdea","#e6f0f7","#f4efe0"],["#8aa3c7","#e8d5b0","#f6c27a","#e07a4a"]];
function aSky(c,w,h,R,N0,v,p){const K=SK[(p||0)%4],g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,K[0]);g.addColorStop(.5,K[1]);g.addColorStop(.78,K[2]);g.addColorStop(1,K[3]);c.fillStyle=g;c.fillRect(0,0,w,h);const sx=w*(.5+(R()-.5)*.3),sy=h*.62;
 for(let i=0;i<30;i++){const a=i/30*6.2832+R()*.1;c.fillStyle="rgba(255,244,214,.05)";c.beginPath();c.moveTo(sx,sy);c.arc(sx,sy,w,a,a+.06);c.fill()}
 const gl=c.createRadialGradient(sx,sy,0,sx,sy,h*.7);gl.addColorStop(0,"rgba(255,250,228,1)");gl.addColorStop(.12,"rgba(255,236,190,.85)");gl.addColorStop(.4,"rgba(255,200,160,.3)");gl.addColorStop(1,"rgba(255,200,160,0)");c.fillStyle=gl;c.fillRect(0,0,w,h);
 for(let i=0;i<9;i++){const x=R()*w,y=h*(.15+R()*.55),rx=w*(.12+R()*.16),ry=rx*.14,cg=c.createRadialGradient(x,y,0,x,y,rx);cg.addColorStop(0,"rgba(255,255,255,.55)");cg.addColorStop(1,"rgba(255,255,255,0)");c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillStyle=cg;c.fillRect(x-rx,y-rx,rx*2,rx*2);c.restore()}
 const d=c.getImageData(0,0,w,h),a=d.data;for(let i=0;i<a.length;i+=4){const n=(Math.random()-.5)*3;a[i]+=n;a[i+1]+=n;a[i+2]+=n}c.putImageData(d,0,0)}
function aOrb(c,w,h,R,N,v){const P=[["#dbe9f5","#f3d6cc","#ff7f66","#ffd28a"],["#eef0fa","#f7d3dc","#ff6f91","#ffcf7a"],["#f3ead9","#d4e2f0","#e9825a","#f7c978"],["#e2f0e8","#cfe3f5","#4fa3a5","#f2f0a8"],["#f3e6f7","#d9d4f7","#8f7bd6","#ffc9e0"],["#fff1d6","#ffd9c9","#f2784b","#ffe27a"]][v%6];
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,P[0]);g.addColorStop(1,P[1]);c.fillStyle=g;c.fillRect(0,0,w,h);const cx=w*(.5+(R()-.5)*.2),cy=h*.5,r=h*.52;
 let o=c.createRadialGradient(cx,cy,0,cx,cy,r*1.5);o.addColorStop(0,"rgba(255,255,255,0)");o.addColorStop(.55,P[2]+"55");o.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=o;c.fillRect(0,0,w,h);
 o=c.createRadialGradient(cx-r*.1,cy-r*.1,0,cx,cy,r);o.addColorStop(0,P[3]);o.addColorStop(.45,P[2]);o.addColorStop(.85,P[2]+"88");o.addColorStop(1,P[2]+"00");c.fillStyle=o;c.fillRect(0,0,w,h);
 const d=c.getImageData(0,0,w,h),a=d.data;for(let i=0;i<a.length;i+=4){const n=(Math.random()-.5)*9;a[i]+=n;a[i+1]+=n;a[i+2]+=n}c.putImageData(d,0,0)}
const PT=[["#f6ecd2","#e8d4a0","120,96,40","214,184,110","250,238,200","90,66,24"],["#f8e6e8","#f0c9d0","150,60,80","230,150,170","253,232,236","120,40,60"],["#ece6f8","#cfc4ee","90,70,150","170,150,220","244,238,253","70,50,120"],["#fbe9d3","#f3c79a","160,86,40","236,170,110","253,236,214","130,64,24"]];
function aPetal(c,w,h,R,N0,v,p){const K=PT[(p||0)%4],g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,K[0]);g.addColorStop(1,K[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
 for(let i=0;i<22;i++){const cx=R()*w,cy=R()*h,L=h*(.35+R()*.5),W=L*(.28+R()*.18),rot=R()*6.2832;c.save();c.translate(cx,cy);c.rotate(rot);
  const pg=c.createLinearGradient(0,-W,0,W);pg.addColorStop(0,`rgba(${K[2]},.62)`);pg.addColorStop(.5,`rgba(${K[3]},.5)`);pg.addColorStop(1,`rgba(${K[4]},.32)`);c.fillStyle=pg;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(L*.25,-W,L*.8,-W*.7,L,0);c.bezierCurveTo(L*.8,W*.7,L*.25,W,0,0);c.fill();
  c.strokeStyle=`rgba(${K[5]},.16)`;c.lineWidth=1.2;for(let k=-7;k<=7;k++){c.beginPath();c.moveTo(L*.02,k*W*.04);c.bezierCurveTo(L*.3,k*W*.11,L*.65,k*W*.09,L*.97,k*W*.012);c.stroke()}
  c.strokeStyle="rgba(255,248,225,.35)";c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(L*.5,W*.05,L,0);c.stroke();c.restore()}}
const LF=[["#26352b","#101a14","#dfe8cf","#b9cba0","#8aa57a",60,120,60],["#173032","#0c1a1c","#d8ece8","#a9d0c8","#6fa9a0",40,140,130],["#2e2a18","#16140a","#efe6bf","#cfc58a","#9a9a58",120,120,40],["#10261b","#08140d","#c4e3c8","#7fbf8c","#4f9560",40,150,80]];
function aLeaf(c,w,h,R,N0,v,p){const K=LF[(p||0)%4],g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,K[0]);g.addColorStop(1,K[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
 const leaf=(cx,cy,L,Wd,rot)=>{c.save();c.translate(cx,cy);c.rotate(rot);const lg=c.createLinearGradient(0,-Wd,0,Wd);lg.addColorStop(0,K[2]);lg.addColorStop(.5,K[3]);lg.addColorStop(1,K[4]);c.fillStyle=lg;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(L*.15,-Wd*1.1,L*.7,-Wd*1.05,L,0);c.bezierCurveTo(L*.7,Wd*1.05,L*.15,Wd*1.1,0,0);c.fill();c.clip();
  for(let i=0;i<260;i++){const x=R()*L,y=(R()-.5)*Wd*2;c.fillStyle=`rgba(${K[5]+R()*40|0},${K[6]+R()*50|0},${K[7]+R()*30|0},${.05+R()*.14})`;c.beginPath();c.arc(x,y,3+R()*14,0,6.3);c.fill()}
  c.strokeStyle="rgba(250,252,238,.7)";c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.lineTo(L,0);c.stroke();c.lineCap="round";
  for(let k=1;k<12;k++){const x=L*k/12.5;for(const s of[-1,1]){c.strokeStyle="rgba(250,252,238,.55)";c.lineWidth=3.2*(1-k/14);c.beginPath();c.moveTo(x,0);c.quadraticCurveTo(x+L*.07,s*Wd*.4,x+L*.16,s*Wd*(.95-k*.03));c.stroke()}}c.restore()};
 leaf(w*.06,h*.78,w*.72,h*.34,-.35);leaf(w*.98,h*.9,w*.8,h*.36,Math.PI+.28);
 const vg=c.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,h*.95);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.35)");c.fillStyle=vg;c.fillRect(0,0,w,h)}
function aFlow(c,w,h,R){const N=mkN(R()*1e6|0);gWind(c,w,h,R,N)}
const A2={train:aWood,food:(c,w,h,R,N,v)=>aOrb(c,w,h,R,N,v),grass:aLeaf,moss:aStone,ribbon:aFlow,petal:aPetal,water:aWater,moon:aGills,sun:aSky,goddess:(c,w,h,R,N,v)=>aOrb(c,w,h,R,N,v+1),wind:aFlow};
const A2C={};
export function av(kind,w,h,seed){const f=A2[kind]||aFlow,k=kind+"-"+((seed||1)%3);if(!A2C[k]){try{const cv=document.createElement("canvas");cv.width=1100;cv.height=700;const c=cv.getContext("2d");f(c,1100,700,mb(1000+(seed||1)%3*77+kind.length*13),null,(seed||1)%3);document.documentElement.style.setProperty("--a-"+k,`url(${cv.toDataURL("image/jpeg",.92)})`)}catch(e){}A2C[k]=1}return`var(--a-${k})`}
const FP=[[["#a5bcd6","#5d7a9c","#231815"],["#f5efc6","#a5bcd6","#4a2e27","#e6d5b8","#7f9bbd"]],[["#e8c9b8","#a8604a","#2a1612"],["#fff1e0","#f0b79a","#6b2f22","#e6c7a8","#d98a68"]],[["#cfe0e4","#4f7f86","#10242a"],["#f4fbf6","#a6d1cc","#1f4a52","#d8ece4","#79b0aa"]],[["#e6d2ea","#8366a8","#1d1230"],["#fdf3fb","#d6b8e6","#4a2f78","#efd6ee","#b48ad0"]]];
function aFlow2(c,w,h,R,N0,v,p){const N=mkN(R()*1e6|0),K=FP[(p||0)%4],g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,K[0][0]);g.addColorStop(.5,K[0][1]);g.addColorStop(1,K[0][2]);c.fillStyle=g;c.fillRect(0,0,w,h);
 const gl=c.createRadialGradient(w*.75,h*.25,0,w*.75,h*.25,w*.7);gl.addColorStop(0,"rgba(255,246,222,.55)");gl.addColorStop(1,"rgba(255,246,222,0)");c.fillStyle=gl;c.fillRect(0,0,w,h);c.lineCap="round";const P=K[1];
 for(let i=0;i<190;i++){let x=R()*w*1.2-w*.1,y=R()*h;c.strokeStyle=P[i%P.length];c.globalAlpha=.06+R()*.22;c.lineWidth=1+R()*6;c.beginPath();c.moveTo(x,y);for(let s=0;s<70;s++){const a=N(x/w*2.2,y/h*2.2)*7+Math.sin(y/h*3)*.8;x+=Math.cos(a)*(w/90);y+=Math.sin(a)*(h/90);c.lineTo(x,y)}c.stroke()}c.globalAlpha=1}
const MP=[[["#f3d9c4","#d7b9b0"],[200,180,180],[40,50,64]],[["#dbe8f2","#a9c4dc"],[180,200,220],[30,50,80]],[["#f7e1b5","#e9a97a"],[230,190,150],[80,40,40]],[["#e8d9f2","#b9a5d6"],[210,190,230],[40,30,70]]];
function aMount(c,w,h,R,N0,v,p){const K=MP[(p||0)%4],n=pn(R()*1e6|0),g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,K[0][0]);g.addColorStop(1,K[0][1]);c.fillStyle=g;c.fillRect(0,0,w,h);
 const sx=w*(.2+R()*.6),sy=h*(.2+R()*.2),gl=c.createRadialGradient(sx,sy,0,sx,sy,h*.5);gl.addColorStop(0,"rgba(255,252,236,.95)");gl.addColorStop(.2,"rgba(255,240,214,.5)");gl.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=gl;c.fillRect(0,0,w,h);
 for(let l=0;l<6;l++){const t=l/5,col=mx(K[1],K[2],t),y0=h*(.38+.1*l),amp=h*(.2-.012*l);c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=5){const y=y0-amp*(fb(n,x/w*2.2+l*4.1,l*1.7,4)*2-.75);c.lineTo(x,y)}c.lineTo(w,h);c.closePath();const lg=c.createLinearGradient(0,y0-amp,0,y0+h*.15);lg.addColorStop(0,`rgb(${col.map(Math.round)})`);const f=mx(col,K[0].length?[255,246,236]:col,.55);lg.addColorStop(1,`rgb(${f.map(Math.round)})`);c.fillStyle=lg;c.fill()}}
const BP=[["#eef0dc","#7a9a4e","#c7d58a","#4f6e32"],["#f6ecd0","#b8a04a","#e6d48a","#7a6a28"],["#e6edf0","#6f8f9c","#b4cfd8","#41606c"],["#f6e6e2","#a47a62","#d9b6a0","#6e4a3c"]];
function aBamboo(c,w,h,R,N0,v,p){const K=BP[(p||0)%4],g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,K[0]);g.addColorStop(1,K[2]);c.fillStyle=g;c.fillRect(0,0,w,h);
 for(let i=0;i<14;i++){const x=R()*w,y=R()*h,r=20+R()*60,b=c.createRadialGradient(x,y,0,x,y,r);b.addColorStop(0,"rgba(255,255,240,.4)");b.addColorStop(1,"rgba(255,255,240,0)");c.fillStyle=b;c.fillRect(x-r,y-r,r*2,r*2)}
 for(let d=0;d<3;d++){const n=d==0?7:d==1?6:5;for(let i=0;i<n;i++){const x=(i+R()*.8)/n*w,sw=(d==0?16:d==1?26:40)+R()*8,al=d==0?.5:d==1?.75:1,sg=c.createLinearGradient(x-sw/2,0,x+sw/2,0);sg.addColorStop(0,K[3]);sg.addColorStop(.35,K[1]);sg.addColorStop(.6,K[2]);sg.addColorStop(1,K[3]);c.globalAlpha=al;c.fillStyle=sg;c.fillRect(x-sw/2,0,sw,h);
  c.fillStyle="rgba(30,40,20,.45)";for(let y=R()*120;y<h;y+=110+R()*70){c.fillRect(x-sw/2-1,y,sw+2,3.5)}c.globalAlpha=1}}
 const vg=c.createLinearGradient(0,h*.6,0,h);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(20,26,14,.45)");c.fillStyle=vg;c.fillRect(0,0,w,h)}
const GEN={wood:aWood,orb:aOrb,leaf:aLeaf,stone:aStone,flow:aFlow2,petal:aPetal,water:aWater,gills:aGills,sky:aSky,mount:aMount,bamboo:aBamboo};
const EK={moon:["gills","mount","orb"],water:["water","mount","sky"],grass:["leaf","bamboo","petal"],moss:["stone","wood","bamboo"],ribbon:["flow","wood","gills"],petal:["petal","orb","gills"],sun:["sky","orb","mount"],goddess:["orb","petal","sky"],wind:["flow","sky","mount"]};
const QLRU=[];
export function avq(el,qi){const L=EK[el]||EK.wind,kind=L[qi%L.length],pal=1+(Math.floor(qi/L.length)%3),k="q"+qi;
 if(!A2C[k]){try{const cv=document.createElement("canvas");cv.width=900;cv.height=620;const c=cv.getContext("2d");GEN[kind](c,900,620,mb(5000+qi*131),null,kind=="orb"?3+pal:0,pal);document.documentElement.style.setProperty("--a-"+k,`url(${cv.toDataURL("image/jpeg",.9)})`)}catch(e){}A2C[k]=1;QLRU.push(k);while(QLRU.length>8){const o=QLRU.shift();document.documentElement.style.removeProperty("--a-"+o);delete A2C[o]}}return`var(--a-${k})`}
const NP=[["#dbe8f2","#a5bcd6","#4a2e27","#f5efc6","#7f9bbd"],["#fde8e0","#e8c9b8","#a8604a","#fff1e0","#d98a68"],["#e4f0ec","#a6d1cc","#1f4a52","#f4fbf6","#79b0aa"],["#f3e6f7","#d6b8e6","#4a2f78","#fdf3fb","#b48ad0"]];
const vg2=(c,w,h,P)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,P[0]);g.addColorStop(1,P[1]);c.fillStyle=g;c.fillRect(0,0,w,h)};
function aRipple(c,w,h,R,N0,v,p){const P=NP[(p||0)%4];vg2(c,w,h,P);const cx=w*(.3+R()*.4),cy=h*(.45+R()*.2);
 const gl=c.createRadialGradient(cx,cy,0,cx,cy,w*.6);gl.addColorStop(0,"rgba(255,248,230,.7)");gl.addColorStop(1,"rgba(255,248,230,0)");c.fillStyle=gl;c.fillRect(0,0,w,h);
 for(let i=1;i<=18;i++){const r=i*w*.045,ph=R()*6;c.beginPath();for(let a=0;a<=64;a++){const t=a/64*6.2832,k=1+Math.sin(t*3+ph)*.012*i;c[a?"lineTo":"moveTo"](cx+Math.cos(t)*r*k,cy+Math.sin(t)*r*.42*k)}c.closePath();c.strokeStyle=i%3?P[2]:P[4];c.globalAlpha=Math.max(.05,.5-i*.025);c.lineWidth=1+(i%4)*1.2;c.stroke()}c.globalAlpha=1;
 for(let i=0;i<5;i++){const x=R()*w,y=R()*h,r=8+R()*26;c.fillStyle=P[3];c.globalAlpha=.25;c.beginPath();c.ellipse(x,y,r,r*.5,0,0,6.2832);c.fill()}c.globalAlpha=1}
function aDunes(c,w,h,R,N0,v,p){const P=NP[(p||0)%4];vg2(c,w,h,[P[3],P[1]]);const sx=w*(.25+R()*.5),sy=h*(.22+R()*.12),gl=c.createRadialGradient(sx,sy,0,sx,sy,h*.55);gl.addColorStop(0,"rgba(255,252,236,.95)");gl.addColorStop(.25,"rgba(255,240,214,.5)");gl.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=gl;c.fillRect(0,0,w,h);
 c.fillStyle="#fffaf0";c.globalAlpha=.9;c.beginPath();c.arc(sx,sy,h*.055,0,6.2832);c.fill();c.globalAlpha=1;
 for(let l=0;l<7;l++){const y0=h*(.45+l*.075),a1=h*(.05+R()*.05),a2=h*.03*R(),f1=1.2+R()*1.6,ph=R()*6;c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=6){c.lineTo(x,y0-a1*Math.sin(x/w*f1*3.14+ph)-a2*Math.sin(x/w*7+l))}c.lineTo(w,h);c.closePath();const g=c.createLinearGradient(0,y0-a1,0,y0+h*.2);g.addColorStop(0,P[l%2?4:2]);g.addColorStop(1,P[1]);c.globalAlpha=.25+l*.1;c.fillStyle=g;c.fill()}c.globalAlpha=1}
function aMoonSea(c,w,h,R,N0,v,p){const P=NP[(p||0)%4],hy=h*.6;let g=c.createLinearGradient(0,0,0,hy);g.addColorStop(0,P[2]);g.addColorStop(.6,P[4]);g.addColorStop(1,P[1]);c.fillStyle=g;c.fillRect(0,0,w,hy);
 for(let i=0;i<7;i++){const x=R()*w,y=R()*hy*.8,rx=80+R()*200;c.fillStyle="rgba(255,235,225,.10)";c.beginPath();c.ellipse(x,y,rx,10+R()*14,0,0,6.2832);c.fill()}
 const mx=w*(.3+R()*.4),my=h*(.2+R()*.18),mr=h*.085,gl=c.createRadialGradient(mx,my,0,mx,my,mr*5);gl.addColorStop(0,"rgba(255,236,214,.6)");gl.addColorStop(1,"rgba(255,236,214,0)");c.fillStyle=gl;c.fillRect(0,0,w,hy);
 const mg=c.createRadialGradient(mx-mr*.25,my-mr*.25,0,mx,my,mr);mg.addColorStop(0,"#fff4e0");mg.addColorStop(1,"#f0cfae");c.fillStyle=mg;c.beginPath();c.arc(mx,my,mr,0,6.2832);c.fill();c.fillStyle="rgba(180,130,110,.18)";for(let i=0;i<6;i++){c.beginPath();c.arc(mx+(R()-.5)*mr,my+(R()-.5)*mr,mr*(.08+R()*.14),0,6.2832);c.fill()}
 g=c.createLinearGradient(0,hy,0,h);g.addColorStop(0,P[4]);g.addColorStop(1,P[2]);c.fillStyle=g;c.fillRect(0,hy,w,h-hy);
 for(let y=hy;y<h;y+=3){const t=(y-hy)/(h-hy),n=(R()-.5)*60*(.3+t),wd=18+t*160*R();c.fillStyle=`rgba(255,236,214,${.5*(1-t)*R()})`;c.fillRect(mx+n-wd/2,y,wd,1.6)}
 c.fillStyle="rgba(255,255,255,.18)";c.fillRect(0,hy-1,w,2)}
function star5(c,x,y,r,ri,rot){c.beginPath();for(let i=0;i<10;i++){const a=rot+i*Math.PI/5,rr=i%2?ri:r;c[i?"lineTo":"moveTo"](x+Math.sin(a)*rr,y-Math.cos(a)*rr)}c.closePath()}
function aOverlap(c,w,h,R,N0,v,p){const P=NP[(p||0)%4];vg2(c,w,h,[P[3],P[0]]);const r=h*.2,dx=r*1.55,dy=r*1.12,cols=Math.ceil(w/dx)+1,rows=Math.ceil(h/dy)+1,ox=w*.5-dx*(cols-1)/2+R()*10;
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x=ox+i*dx+(j%2?dx/2:0),y=j*dy-r*.2;c.fillStyle=P[2];c.globalAlpha=.1;c.beginPath();c.arc(x,y,r,0,6.2832);c.fill();c.globalAlpha=.35;c.strokeStyle=P[2];c.lineWidth=1.4;c.stroke();c.globalAlpha=1;c.fillStyle=P[3];c.globalAlpha=.9;star5(c,x,y,r*.2,r*.07,R()*1.2);c.fill();c.globalAlpha=1}}
Object.assign(GEN,{ripple:aRipple,dunes:aDunes,moonsea:aMoonSea,overlap:aOverlap});
const X2={moon:["moonsea","overlap"],water:["ripple","moonsea"],grass:["overlap","dunes"],moss:["ripple","overlap"],ribbon:["dunes","ripple"],petal:["overlap","dunes"],sun:["dunes","moonsea"],goddess:["moonsea","overlap"],wind:["ripple","dunes"]};
Object.keys(EK).forEach(k=>{if(X2[k]&&EK[k].length<5)EK[k]=EK[k].concat(X2[k])});
