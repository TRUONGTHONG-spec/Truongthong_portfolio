/* Thong's desktop-only, click-to-play runner. No network or tracking. */
class ThongRunner {
  constructor(random=Math.random){this.random=random;this.reset();}
  reset(){this.state='ready';this.y=0;this.vy=0;this.elapsed=0;this.score=0;this.speed=290;this.next=1.4;this.obstacles=[];}
  start(){this.reset();this.state='running';}
  jump(){if(this.state==='running'&&this.y===0&&this.vy===0){this.vy=600;return true;}return false;}
  step(dt){if(this.state!=='running')return;dt=Math.min(dt,.04);this.elapsed+=dt;this.score=Math.floor(this.elapsed*10);this.speed=Math.min(470,290+this.elapsed*3);this.vy-=1650*dt;this.y=Math.max(0,this.y+this.vy*dt);if(!this.y)this.vy=0;this.next-=dt;if(this.next<=0){this.obstacles.push({x:1060,w:22+Math.floor(this.random()*15),h:34+Math.floor(this.random()*35)});this.next=1.25+this.random()*.7;}
    for(const o of this.obstacles){o.x-=this.speed*dt;if(o.x<156&&o.x+o.w>124&&this.y<o.h-7&&this.y+65>6)this.state='over';}this.obstacles=this.obstacles.filter(o=>o.x+o.w>-20);
  }
}
if(typeof module!=='undefined')module.exports=ThongRunner;
if(typeof document!=='undefined')(()=>{
const section=document.querySelector('#runner-game');if(!section)return;
const desktop=matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
const canvas=section.querySelector('canvas'),ctx=canvas.getContext('2d'),button=section.querySelector('.runner-action'),pause=section.querySelector('.runner-pause'),status=section.querySelector('[role="status"]'),scoreLabel=section.querySelector('.runner-score'),bestLabel=section.querySelector('.runner-best');
const game=new ThongRunner();let best=0,raf=0,last=0,visible=false;try{best=Number(localStorage.getItem('thong-runner-best'))||0;}catch{}bestLabel.textContent=String(best).padStart(5,'0');
function block(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function avatar(x,ground){const airborne=game.y>0,t=game.elapsed;const gait=game.state==='running'&&!airborne?Math.sin(t*22):0;const y=ground-76-game.y+(airborne?0:Math.abs(gait)*2);ctx.save();ctx.translate(x,y);ctx.scale(2,2);
 // A small cubic beanie, warm face, round glasses, green jacket and satchel.
 block(4,0,18,3,'#1b211d');block(1,3,24,7,'#292f29');block(0,9,26,3,'#101610');block(3,12,20,12,'#e9ac75');block(22,14,3,5,'#d59060');block(3,12,20,3,'#f7c38b');block(4,15,8,6,'#121a14');block(15,15,8,6,'#121a14');block(11,16,5,2,'#121a14');block(6,16,4,3,'#c6e7c6');block(17,16,4,3,'#c6e7c6');block(16,22,5,1,'#704028');
 block(6,24,15,9,'#24643a');block(6,24,3,9,'#39874b');block(19,24,3,9,'#124a2d');block(12,24,3,9,'#87613d');block(5,28,7,6,'#815a32');block(6,29,5,2,'#b88a49');
 const arm=airborne?-3:gait*2;block(1,25+arm,5,7,'#348446');block(0,30+arm,4,3,'#edb17b');block(21,26-arm,5,6,'#1d6133');block(23,30-arm,4,3,'#edb17b');
 block(7,33,5,5+Math.round(gait*2),'#242c28');block(16,33,5,5-Math.round(gait*2),'#151e19');block(6,37+Math.round(gait*2),8,3,'#e8ebdd');block(16,37-Math.round(gait*2),8,3,'#e8ebdd');block(8,38+Math.round(gait*2),6,1,'#a7ff5c');ctx.restore();}
function cactus(o){const x=o.x,y=206-o.h;block(x+5,y,o.w-10,o.h,'#8fdd4d');block(x+o.w-8,y+3,8,o.h-3,'#46782f');block(x+8,y+4,3,o.h-7,'#c3ff88');block(x-7,y+o.h*.4,9,8,'#8fdd4d');block(x-9,y+o.h*.25,5,o.h*.23,'#639e3d');block(x+o.w-2,y+o.h*.6,9,7,'#639e3d');block(x+o.w+3,y+o.h*.35,5,o.h*.3,'#8fdd4d');}
function render(){ctx.clearRect(0,0,1060,250);block(0,0,1060,250,'#0b100d');ctx.strokeStyle='#19251b';ctx.lineWidth=1;for(let x=0;x<1060;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,250);ctx.stroke();}for(let y=10;y<250;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1060,y);ctx.stroke();}
 const distance=game.elapsed*game.speed;ctx.strokeStyle='#3d5b32';for(let i=0;i<7;i++){const x=(i*190-distance*.16%1330+1330)%1330-70;ctx.beginPath();ctx.moveTo(x,100);ctx.lineTo(x+45,60);ctx.lineTo(x+90,100);ctx.stroke();}block(0,206,1060,2,'#749959');for(let i=0;i<24;i++){const x=(i*51-distance%1224+1224)%1224;block(x,222+(i%3)*7,9+(i%4)*3,2,'#354d2d');}if(game.state==='ready'){cactus({x:720,w:28,h:38});cactus({x:930,w:34,h:64});}for(const o of game.obstacles)cactus(o);avatar(116,206);scoreLabel.textContent=String(game.score).padStart(5,'0');}
function message(text){status.textContent=text;}
function gameOver(){game.state='over';if(game.score>best){best=game.score;bestLabel.textContent=String(best).padStart(5,'0');try{localStorage.setItem('thong-runner-best',String(best));}catch{}}button.hidden=false;button.textContent='PLAY AGAIN ↻';pause.hidden=true;message('GAME OVER · '+game.score+' points. Click Play again to retry.');}
function frame(now){raf=0;if(!desktop.matches||!visible||game.state!=='running')return;const dt=last?(now-last)/1000:0;last=now;game.step(dt);render();if(game.state==='over'){gameOver();return;}raf=requestAnimationFrame(frame);}
function loop(){if(!raf&&desktop.matches&&visible&&game.state==='running'){last=0;raf=requestAnimationFrame(frame);}}
function act(){if(!desktop.matches)return;if(game.state==='ready'||game.state==='over'){game.start();button.hidden=true;pause.hidden=false;pause.textContent='PAUSE Ⅱ';message('RUNNING · Click the track or press Space to jump.');loop();}else if(game.state==='paused'){game.state='running';button.hidden=true;pause.hidden=false;pause.textContent='PAUSE Ⅱ';message('RUNNING · Click the track or press Space to jump.');loop();}else game.jump();}
function suspend(){if(game.state==='running'){game.state='paused';cancelAnimationFrame(raf);raf=0;button.hidden=false;button.textContent='RESUME ▶';pause.hidden=true;pause.textContent='RESUME ▶';message('PAUSED · Click Resume when ready.');}}
button.addEventListener('click',act);canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;canvas.focus({preventScroll:true});act();});canvas.addEventListener('keydown',event=>{if(['Space','ArrowUp','Enter'].includes(event.code)){event.preventDefault();if(!event.repeat)act();}});pause.addEventListener('click',()=>game.state==='running'?suspend():act());
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)suspend();else{render();loop();}},{threshold:.3}).observe(section);document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});desktop.addEventListener('change',()=>{if(!desktop.matches)suspend();else render();});render();
})();
