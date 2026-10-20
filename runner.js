/* Thong's desktop-only, click-to-play world tour. No network or tracking. */
const RUNNER_MAPS={
 japan:{name:'Japan',code:'JP',title:'Sakura evening',detail:'Mount Fuji · sakura · torii gates',obstacle:'bamboo',accent:'#ffb6cf',sky:['#25213f','#714963'],ground:'#392c40',trail:'#b9809c'},
 korea:{name:'South Korea',code:'KR',title:'Seoul after hours',detail:'Seoul skyline · hanok rooftops · city lights',obstacle:'road barriers',accent:'#b8b5ff',sky:['#191f42','#725677'],ground:'#25273b',trail:'#9995da'},
 vietnam:{name:'Vietnam',code:'VN',title:'Golden hour in Hội An',detail:'Rice fields · limestone hills · lanterns',obstacle:'wooden crates',accent:'#ffe092',sky:['#18464a','#bc9b60'],ground:'#344535',trail:'#dac284'},
 europe:{name:'Europe',code:'EU',title:'An Alpine escape',detail:'Alpine peaks · castles · windmills',obstacle:'stone pillars',accent:'#bce6ff',sky:['#18344d','#6f9eaf'],ground:'#293f3a',trail:'#a0c7b1'}
};

// Original canvas scenery: separate parallax layers, pixel silhouettes and landmarks.
function drawRunnerWorld(c,id,distance=0,time=0){
 const m=RUNNER_MAPS[id],r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));};
 const poly=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fill();};
 const ridge=(x,base,width,height,color)=>{const points=[[x,base]];for(let i=0;i<=12;i++){const y=base-height*(1-Math.abs(i-6)/6);points.push([x+i*width/12,y],[x+(i+1)*width/12,y]);}points.push([x+width,base]);poly(points,color);};
 const repeat=(spacing,rate,draw)=>{const offset=distance*rate%spacing;for(let x=-spacing-offset;x<1120;x+=spacing)draw(x);};
 const pine=(x,y,s=1)=>{r(x+8*s,y+15*s,4*s,22*s,'#4a4a34');for(let k=0;k<3;k++)poly([[x-3*k*s,y+(13+k*9)*s],[x+10*s,y+(-4+k*8)*s],[x+(23+3*k)*s,y+(13+k*9)*s]],'#254e48');};
 const cloud=(x,y)=>{r(x,y,66,7,'#ffffff18');r(x+13,y-6,40,7,'#ffffff18');r(x+24,y-12,18,7,'#ffffff18');};
 const sky=c.createLinearGradient(0,0,0,206);sky.addColorStop(0,m.sky[0]);sky.addColorStop(1,m.sky[1]);c.fillStyle=sky;c.fillRect(0,0,1060,250);
 repeat(330,.035,x=>cloud(x+80,42+(Math.floor((x+1000)/330)%2)*25));
 if(id==='japan'){
  r(864,24,27,27,'#f9ddba');r(860,30,35,15,'#f9ddba');
  repeat(1100,.045,x=>{ridge(x+275,169,340,118,'#44435c');poly([[x+405,82],[x+445,51],[x+493,90],[x+470,86],[x+450,96],[x+435,84]],'#e8dbe0');ridge(x+65,177,250,64,'#494354');});
  repeat(420,.14,x=>{r(x+72,129,53,54,'#3e3548');for(let k=0;k<3;k++){const y=126-k*19;poly([[x+57,y+9],[x+99,y-5],[x+141,y+9]],'#252638');r(x+81+k*5,y+9,36-k*10,10,'#68424f');}r(x+96,57,4,20,'#252638');});
  repeat(620,.27,x=>{r(x+420,109,9,92,'#984d56');r(x+487,109,9,92,'#984d56');r(x+405,100,105,10,'#dd8790');r(x+398,96,119,5,'#2c2a3a');r(x+415,126,85,7,'#ce737f');r(x+450,108,15,22,'#643846');
   r(x+42,115,11,91,'#4b3848');r(x+33,143,8,35,'#4b3848');r(x+55,130,26,8,'#4b3848');for(const [a,b,w]of [[6,111,58],[24,91,63],[52,105,50],[19,128,60]]){r(x+a,b,w,19,'#dc8faa');r(x+a+8,b-6,w-20,7,'#f4b2c7');}});
  for(let i=0;i<10;i++){const x=(i*119-distance*.3+Math.sin(time+i)*9+1200)%1200,y=35+(i*37+time*10)%158;r(x,y,4,3,'#ffc5db');}
 }else if(id==='korea'){
  r(888,24,22,22,'#f2dcbd');
  repeat(1200,.055,x=>{ridge(x+200,178,590,82,'#41405b');r(x+491,50,5,90,'#b5a4c6');r(x+480,68,27,9,'#d2bbda');r(x+485,60,17,10,'#7f6b9b');r(x+492,29,3,30,'#e1bdc8');});
  repeat(117,.12,x=>{const h=50+(Math.abs(Math.floor(x/117))%4)*15;r(x+20,190-h,67,h,'#2c304e');for(let a=0;a<4;a++)for(let b=0;b<4;b++)r(x+28+a*14,200-h+b*13,4,6,(a+b)%3?'#a39bb64d':'#f2d19c');});
  repeat(580,.26,x=>{r(x+65,151,168,51,'#665062');r(x+78,168,143,34,'#c1a3a0');for(let k=0;k<6;k++){r(x+84+k*22,164,5,38,'#6b4351');r(x+91+k*22,175,11,17,'#f3d8af');}poly([[x+44,157],[x+68,146],[x+149,120],[x+231,146],[x+256,157],[x+219,157],[x+149,137],[x+81,157]],'#252c42');r(x+141,116,16,5,'#77708d');r(x+334,86,9,117,'#42425a');r(x+316,84,45,8,'#676681');r(x+321,92,18,26,'#d6bcdf');r(x+342,99,18,28,'#d6bcdf');r(x+326,98,8,14,'#f9e2b9');});
 }else if(id==='vietnam'){
  r(855,27,32,32,'#f8d787');r(849,34,44,18,'#f8d787');
  repeat(1100,.045,x=>{poly([[x+115,176],[x+134,127],[x+153,127],[x+167,83],[x+196,78],[x+215,105],[x+225,176]],'#326467');poly([[x+255,178],[x+278,101],[x+295,101],[x+310,72],[x+338,78],[x+353,130],[x+375,178]],'#3b6c68');ridge(x+450,182,400,69,'#48766b');});
  r(0,176,1060,30,'#77935b');for(let i=0;i<4;i++){r(0,180+i*7,1060,2,'#c4bb6c');}repeat(160,.16,x=>{r(x,178,4,28,'#526e49');});
  repeat(600,.27,x=>{r(x+42,137,175,66,'#c9a262');r(x+54,145,150,58,'#d7b474');poly([[x+30,140],[x+59,118],[x+205,118],[x+230,140]],'#634b44');for(let k=0;k<4;k++){r(x+66+k*35,158,21,45,'#655b43');r(x+70+k*35,161,13,24,'#425d56');}r(x+242,113,5,91,'#4c5946');r(x+18,105,250,2,'#4f4b43');for(let k=0;k<5;k++){const xx=x+32+k*48,yy=108+(k%2)*8;r(xx,yy,14,20,k%2?'#f6cc66':'#dc7455');r(xx+3,yy-3,8,3,'#8a5445');r(xx+6,yy+20,2,7,'#b35e45');}r(x+419,133,7,72,'#4d6348');poly([[x+421,140],[x+377,128],[x+391,124]],'#658851');poly([[x+424,147],[x+459,126],[x+449,123]],'#658851');});
 }else{
  repeat(1050,.04,x=>{ridge(x+150,183,340,135,'#587d91');poly([[x+262,93],[x+320,48],[x+376,95],[x+350,88],[x+328,107],[x+308,85],[x+292,99]],'#d4e3df');ridge(x+435,186,380,116,'#456e83');poly([[x+570,103],[x+625,70],[x+670,100],[x+646,96],[x+626,110],[x+610,94]],'#c9dcd9');});
  repeat(650,.12,x=>{r(x+360,116,84,68,'#60747c');r(x+345,92,27,92,'#78888a');r(x+433,92,27,92,'#78888a');for(let k=0;k<3;k++){r(x+345+k*10,85,6,10,'#78888a');r(x+433+k*10,85,6,10,'#78888a');}for(let k=0;k<4;k++)r(x+369+k*18,130,7,12,'#c7c7ad');r(x+388,159,24,25,'#374f60');});
  repeat(550,.25,x=>{pine(x+15,168,.9);pine(x+51,177,.7);r(x+135,155,93,47,'#d7c4a0');poly([[x+123,157],[x+181,116],[x+239,157]],'#654e49');r(x+166,170,23,32,'#77624d');r(x+142,167,14,14,'#a9cdd0');r(x+203,167,14,14,'#a9cdd0');r(x+375,143,25,59,'#bbac91');poly([[x+367,145],[x+387,128],[x+409,145]],'#635c59');c.save();c.translate(x+387,155);c.rotate(Math.sin(time*.4)*.25+.4);for(let k=0;k<4;k++){c.rotate(Math.PI/2);r(3,-3,30,7,'#d4d1b9');r(12,-1,20,2,'#7e8883');}c.restore();r(x+384,152,6,6,'#5a625d');});
 }
 r(0,203,1060,3,m.trail);r(0,206,1060,44,m.ground);
 repeat(51,1,x=>{r(x,222,12,2,m.trail+'60');r(x+28,238,8,2,m.trail+'45');});
 c.fillStyle=m.accent;c.font='10px monospace';c.textAlign='right';c.fillText(m.code+' / '+m.title.toUpperCase(),1035,22);c.textAlign='left';
}
class ThongRunner {
  constructor(random=Math.random){this.random=random;this.reset();}
  reset(){this.state='ready';this.y=0;this.vy=0;this.elapsed=0;this.score=0;this.speed=340;this.distance=0;this.next=.25;this.obstacles=[];this.coins=[];this.coinNext=.35;this.collected=0;this.effects=[];this.first=true;}
  start(){this.reset();this.state='running';}
  jump(){if(this.state==='running'&&this.y===0&&this.vy===0){this.vy=600;return true;}return false;}
  step(dt){if(this.state!=='running')return;dt=Math.max(0,Math.min(dt,.04));this.elapsed+=dt;this.speed=Math.min(650,340+this.elapsed*8);this.distance+=this.speed*dt;this.vy-=1650*dt;this.y=Math.max(0,this.y+this.vy*dt);if(!this.y)this.vy=0;this.next-=dt;
    if(this.next<=0){const x=this.first?640:1080;this.first=false;const w=22+Math.floor(this.random()*17),h=36+Math.floor(this.random()*36);this.obstacles.push({x,w,h});this.next=Math.max(.95,1.45-this.elapsed*.006)+this.random()*.4;}
    this.coinNext-=dt;if(this.coinNext<=0){const count=1+Math.floor(this.random()*4),base=48+this.random()*82,start=this.elapsed<1?470+this.random()*380:1080+this.random()*100;for(let i=0;i<count;i++){let y=Math.max(42,Math.min(158,base+Math.sin(i*1.3)*24+(this.random()-.5)*24));const x=start+i*(38+this.random()*22);for(const o of this.obstacles)if(Math.abs(x-(o.x+o.w/2))<o.w/2+42)y=Math.max(y,o.h+48);this.coins.push({x,y});}this.coinNext=.55+this.random()*1.05;}
    for(const o of this.obstacles){o.x-=this.speed*dt;if(o.x<156&&o.x+o.w>124&&this.y<o.h-7&&this.y+65>6)this.state='over';}this.obstacles=this.obstacles.filter(o=>o.x+o.w>-20);
    for(const c of this.coins){c.x-=this.speed*dt;if(this.state==='running'&&this.y>8&&c.x+9>124&&c.x-9<168&&c.y+9>this.y+8&&c.y-9<this.y+76){c.taken=true;this.collected++;this.effects.push({x:c.x,y:206-c.y,life:.5});}}this.coins=this.coins.filter(c=>!c.taken&&c.x>-20);for(const e of this.effects){e.life-=dt;e.y-=40*dt;}this.effects=this.effects.filter(e=>e.life>0);this.score=Math.floor(this.elapsed*10)+this.collected*25;
  }
}

if(typeof module!=='undefined')module.exports=ThongRunner;
if(typeof document!=='undefined')(()=>{
const section=document.querySelector('#runner-game');if(!section)return;
const desktop=matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
const canvas=section.querySelector('canvas'),ctx=canvas.getContext('2d'),button=section.querySelector('.runner-action'),pause=section.querySelector('.runner-pause'),status=section.querySelector('[role="status"]'),scoreLabel=section.querySelector('.runner-score'),bestLabel=section.querySelector('.runner-best'),coinLabel=section.querySelector('.runner-coins'),speedLabel=section.querySelector('.runner-speed');
const game=new ThongRunner();let best=0,raf=0,last=0,visible=false;try{best=Number(localStorage.getItem('thong-runner-best'))||0;}catch{}bestLabel.textContent=String(best).padStart(5,'0');
let map='vietnam';try{const saved=localStorage.getItem('thong-runner-map');if(RUNNER_MAPS[saved])map=saved;}catch{}
const picker=document.createElement('div');picker.className='runner-map-picker';picker.innerHTML='<div class="runner-map-intro"><span>CHOOSE YOUR NEXT STOP</span><small class="runner-map-hint">Select a map, then click Play. Pause to change maps.</small></div><div class="runner-map-options" role="group" aria-label="Choose a game map"></div><p class="runner-map-detail"></p>';
section.querySelector('.runner-track').before(picker);
const mapButtons=[];
for(const [id,m]of Object.entries(RUNNER_MAPS)){const b=document.createElement('button');b.type='button';b.className='runner-map-card';b.dataset.map=id;b.setAttribute('aria-label','Choose '+m.name+' map');b.innerHTML='<canvas width="318" height="75" aria-hidden="true"></canvas><span><b>'+m.name+'</b><small>'+m.title+'</small></span><i aria-hidden="true">'+m.code+'</i>';const mini=b.querySelector('canvas').getContext('2d');mini.scale(.3,.3);drawRunnerWorld(mini,id);b.addEventListener('click',()=>selectMap(id));picker.querySelector('.runner-map-options').append(b);mapButtons.push(b);}
function updateMaps(){const m=RUNNER_MAPS[map];section.querySelector('.runner-frame').style.setProperty('--map-accent',m.accent);for(const b of mapButtons){b.setAttribute('aria-pressed',String(b.dataset.map===map));b.disabled=game.state==='running';}picker.querySelector('.runner-map-detail').textContent=m.detail+' / Jump over '+m.obstacle+'.';picker.querySelector('.runner-map-hint').textContent=game.state==='running'?'Pause your run to choose another destination.':'Select a map, then click Play. Changing maps starts a new run.';canvas.setAttribute('aria-label','Thong runner game in '+m.name+'. Click to play, then click or press Space to jump over '+m.obstacle+' and collect coins.');}
function selectMap(id){if(game.state==='running'||id===map)return;cancelAnimationFrame(raf);raf=0;last=0;map=id;game.reset();button.hidden=false;button.textContent='PLAY '+RUNNER_MAPS[map].code+' ▶';pause.hidden=true;try{localStorage.setItem('thong-runner-map',map);}catch{}updateMaps();message(RUNNER_MAPS[map].name.toUpperCase()+' READY · Click Play, then click / Space / ↑ to jump.');render();}
function block(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function avatar(x,ground){const airborne=game.y>0,t=game.elapsed;const gait=game.state==='running'&&!airborne?Math.sin(t*22):0;const y=ground-76-game.y+(airborne?0:Math.abs(gait)*2);ctx.save();ctx.translate(x,y);ctx.scale(2,2);
 // A small cubic beanie, warm face, round glasses, green jacket and satchel.
 block(4,0,18,3,'#1b211d');block(1,3,24,7,'#292f29');block(0,9,26,3,'#101610');block(3,12,20,12,'#e9ac75');block(22,14,3,5,'#d59060');block(3,12,20,3,'#f7c38b');block(4,15,8,6,'#121a14');block(15,15,8,6,'#121a14');block(11,16,5,2,'#121a14');block(6,16,4,3,'#c6e7c6');block(17,16,4,3,'#c6e7c6');block(16,22,5,1,'#704028');
 block(6,24,15,9,'#24643a');block(6,24,3,9,'#39874b');block(19,24,3,9,'#124a2d');block(12,24,3,9,'#87613d');block(5,28,7,6,'#815a32');block(6,29,5,2,'#b88a49');
 const arm=airborne?-3:gait*2;block(1,25+arm,5,7,'#348446');block(0,30+arm,4,3,'#edb17b');block(21,26-arm,5,6,'#1d6133');block(23,30-arm,4,3,'#edb17b');
 block(7,33,5,5+Math.round(gait*2),'#242c28');block(16,33,5,5-Math.round(gait*2),'#151e19');block(6,37+Math.round(gait*2),8,3,'#e8ebdd');block(16,37-Math.round(gait*2),8,3,'#e8ebdd');block(8,38+Math.round(gait*2),6,1,'#a7ff5c');ctx.restore();}
function cactus(o){const x=o.x,y=206-o.h;if(map==='japan'){block(x,y,o.w,o.h,'#458565');block(x+o.w-7,y,7,o.h,'#2c5c4d');for(let k=0;k<o.h;k+=15){block(x,y+k,o.w,3,'#bad5a0');block(x+4,y+k+4,3,9,'#70b080');}}else if(map==='korea'){block(x,y,o.w,o.h,'#6f7fa5');block(x+4,y+4,o.w-8,o.h-8,'#b1bbd3');for(let k=0;k<o.h-8;k+=15){block(x+4,y+6+k,o.w-8,5,'#4c506c');}block(x-2,202,o.w+4,4,'#47516f');}else if(map==='vietnam'){block(x,y,o.w,o.h,'#967346');block(x+4,y+4,o.w-8,o.h-8,'#b99a61');for(let k=0;k<o.h;k+=20){block(x,y+k,o.w,3,'#655335');}block(x+4,y+4,3,o.h-8,'#dec48b');block(x+o.w-7,y+4,3,o.h-8,'#745b38');}else{block(x,y,o.w,o.h,'#8b9e9c');block(x+4,y+3,o.w-8,o.h-3,'#b1bfb7');for(let k=13;k<o.h;k+=15){block(x,y+k,o.w,2,'#687e7d');block(x+(k%2?o.w/2:6),y+k-12,2,12,'#879b95');}block(x,y,o.w,5,'#d4d7c2');}}
function coin(c){const y=206-c.y,w=5+Math.abs(Math.cos(game.elapsed*6+c.x*.01))*11;block(c.x-w/2-2,y-10,w+4,20,'#a96b19');block(c.x-w/2,y-12,w,24,'#ffcd42');block(c.x-w/2+2,y-8,Math.max(2,w-4),16,'#ffe79a');block(c.x-1,y-6,2,12,'#d69b21');}
function render(){ctx.clearRect(0,0,1060,250);drawRunnerWorld(ctx,map,game.distance,game.elapsed);if(game.state==='ready'){cactus({x:720,w:28,h:38});cactus({x:930,w:34,h:64});for(const c of [{x:360,y:70},{x:455,y:132},{x:740,y:110},{x:790,y:142},{x:980,y:100}])coin(c);}for(const o of game.obstacles)cactus(o);for(const c of game.coins)coin(c);for(const e of game.effects){ctx.globalAlpha=e.life*2;ctx.fillStyle='#ffdc66';ctx.font='bold 16px monospace';ctx.fillText('+25',e.x,e.y);ctx.globalAlpha=1;}avatar(116,206);scoreLabel.textContent=String(game.score).padStart(5,'0');coinLabel.textContent=String(game.collected).padStart(2,'0');speedLabel.textContent=(game.speed/340).toFixed(1)+'×';}
function message(text){status.textContent=text;}
function gameOver(){game.state='over';if(game.score>best){best=game.score;bestLabel.textContent=String(best).padStart(5,'0');try{localStorage.setItem('thong-runner-best',String(best));}catch{}}button.hidden=false;button.textContent='PLAY AGAIN ↻';pause.hidden=true;updateMaps();message(RUNNER_MAPS[map].name.toUpperCase()+' · GAME OVER · '+game.score+' points · '+game.collected+' coins. Try again or choose another map.');}
function frame(now){raf=0;if(!desktop.matches||!visible||game.state!=='running')return;const dt=last?(now-last)/1000:0;last=now;game.step(dt);render();if(game.state==='over'){gameOver();return;}raf=requestAnimationFrame(frame);}
function loop(){if(!raf&&desktop.matches&&visible&&game.state==='running'){last=0;raf=requestAnimationFrame(frame);}}
function act(){if(!desktop.matches)return;if(game.state==='ready'||game.state==='over'){game.start();button.hidden=true;pause.hidden=false;pause.textContent='PAUSE Ⅱ';updateMaps();message(RUNNER_MAPS[map].name.toUpperCase()+' · RUNNING · Jump over '+RUNNER_MAPS[map].obstacle+'. Coins +25. Speed increases over time.');loop();}else if(game.state==='paused'){game.state='running';button.hidden=true;pause.hidden=false;pause.textContent='PAUSE Ⅱ';updateMaps();message(RUNNER_MAPS[map].name.toUpperCase()+' · RUNNING · Click / Space / ↑ to jump.');loop();}else game.jump();}
function suspend(){if(game.state==='running'){game.state='paused';cancelAnimationFrame(raf);raf=0;button.hidden=false;button.textContent='RESUME ▶';pause.hidden=true;pause.textContent='RESUME ▶';updateMaps();message('PAUSED · Resume your run or select another map to start fresh.');}}
button.addEventListener('click',act);canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;canvas.focus({preventScroll:true});act();});canvas.addEventListener('keydown',event=>{if(['Space','ArrowUp','Enter'].includes(event.code)){event.preventDefault();if(!event.repeat)act();}});pause.addEventListener('click',()=>game.state==='running'?suspend():act());
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)suspend();else{render();loop();}},{threshold:.3}).observe(section);document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});desktop.addEventListener('change',()=>{if(!desktop.matches)suspend();else render();});updateMaps();button.textContent='PLAY '+RUNNER_MAPS[map].code+' ▶';message('CHOOSE YOUR MAP · Click Play, then click / Space / ↑ to jump. Coins +25.');render();
})();
