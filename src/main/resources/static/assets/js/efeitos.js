/* Fumaça leve acima da pizza no FUNDO inteiro. Sem vídeo nem dependências. */
(()=>{
 'use strict';
 const stage=document.getElementById('retroScene'),img=stage?.querySelector('.ambient-art');
 const canvas=document.getElementById('pizzaSmoke');if(!stage||!img||!canvas)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let W=0,H=0,baseX=0,baseY=0,scale=1,last=0,frameId=0;
 const smokes=Array.from({length:27},()=>({}));
 function spawn(p,initial=false){p.age=initial?Math.random()*5:0;p.life=5+Math.random()*4;p.dx=(Math.random()-.5)*.13;p.speed=.65+Math.random()*.55;p.phase=Math.random()*7;p.alpha=.055+Math.random()*.075;p.radius=10+Math.random()*16}
 smokes.forEach(p=>spawn(p,true));
 function resize(){
  W=window.innerWidth;H=window.innerHeight;const ratio=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(W*ratio);canvas.height=Math.round(H*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
  const naturalWidth=img.naturalWidth||1024,naturalHeight=img.naturalHeight||1536;
  // CSS object-fit: cover / object-position: center bottom.
  scale=Math.max(W/naturalWidth,H/naturalHeight);
  const displayW=naturalWidth*scale,displayH=naturalHeight*scale;
  const left=(W-displayW)/2,top=H-displayH;
  baseX=left+displayW*.77;baseY=top+displayH*.805;
 }
 function draw(dt,time){ctx.clearRect(0,0,W,H);if(baseY<0||baseY>H+80)return;ctx.save();ctx.globalCompositeOperation='screen';
  for(const p of smokes){p.age+=dt;if(p.age>p.life)spawn(p);let progress=p.age/p.life,fade=Math.sin(Math.PI*progress);
    const x=baseX+p.dx*W*.65+Math.sin(progress*5+p.phase)*W*.019*(progress+.3);
    const y=baseY-progress*H*.18*p.speed;
    const radius=Math.max(4,p.radius*(.3+progress)*Math.min(1.5,W/570));
    const gradient=ctx.createRadialGradient(x,y,0,x,y,radius*1.5);const alpha=p.alpha*fade;
    gradient.addColorStop(0,`rgba(245,236,219,${alpha})`);
    gradient.addColorStop(.45,`rgba(234,228,217,${alpha*.35})`);gradient.addColorStop(1,'rgba(234,228,217,0)');
    ctx.fillStyle=gradient;ctx.beginPath();ctx.ellipse(x,y,radius,radius*1.4,Math.sin(progress*5+p.phase)*.18,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();}
 function frame(t){frameId=requestAnimationFrame(frame);if(document.hidden)return;if(t-last<45)return;const dt=Math.min(.07,(t-last)/1000||.04);last=t;draw(dt,t)}
 if(img.complete)resize();else img.addEventListener('load',resize,{once:true});
 window.addEventListener('resize',resize,{passive:true});
 document.addEventListener('visibilitychange',()=>{last=0});
 frameId=requestAnimationFrame(frame);
 if(reduced.addEventListener)reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frameId);canvas.hidden=true}else{canvas.hidden=false;last=0;frameId=requestAnimationFrame(frame)}});
})();
