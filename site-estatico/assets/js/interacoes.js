window.PERANZZA_CONFIG_READY.then(()=>{
 'use strict';
 const cfg=window.PERANZZA_CONFIG||{};
 const story=document.getElementById('historiaTexto');
 const storyText=String(cfg.historia||'Em breve, nossa história.').trim();
 if(story){story.replaceChildren();for(const part of storyText.split(/\n\s*\n/)){const p=document.createElement('p');p.textContent=part.trim();p.style.margin='0 0 14px';story.append(p)}}
 const photo=document.getElementById('shopPhoto'),empty=document.getElementById('photoEmpty'),badge=document.getElementById('photoBadge');
 photo.onload=()=>{photo.hidden=false;empty.hidden=true;badge.hidden=false};
 photo.onerror=()=>{photo.hidden=true;empty.hidden=false;badge.hidden=true};
 if(typeof cfg.foto==='string'&&cfg.foto.trim())photo.src=cfg.foto.trim();
 const hero=document.querySelector('.hero-copy>p');if(hero&&cfg.apresentacao)hero.textContent=cfg.apresentacao;
 const digits=String(cfg.whatsapp||'5581998828250').replace(/\D/g,'');
 if(digits.length===13){const url='https://wa.me/'+digits+'?text='+encodeURIComponent('Olá! Gostaria de fazer um pedido na Peranzza.');document.querySelectorAll('.whatsapp-quick,.whatsapp-direct,.footer-whatsapp').forEach(link=>link.href=url)}
 const search=document.getElementById('search'),clear=document.getElementById('clearSearch');
 function sync(){
  clear.hidden=!search.value;
  const n=document.querySelectorAll('#grid .item').length;
  document.getElementById('resultsMeta').textContent=n+(n===1?' opção encontrada':' opções encontradas');
  document.getElementById('mobileCount').textContent=document.getElementById('cartCount').textContent;
  document.getElementById('mobileTotal').textContent=document.getElementById('subtotal').textContent||'R$ 0,00';
 }
 document.addEventListener('peranzza:catalogo-carregado',sync);
 search.addEventListener('input',()=>setTimeout(sync,0));
 clear.addEventListener('click',()=>{search.value='';search.dispatchEvent(new Event('input'));search.focus()});
 document.getElementById('mobileCart').addEventListener('click',()=>document.getElementById('cartOpen').click());
 document.getElementById('cartOpen').addEventListener('click',()=>setTimeout(sync,0));
 document.getElementById('addToCart').addEventListener('click',()=>setTimeout(sync,0));
 document.getElementById('cartItems').addEventListener('click',()=>setTimeout(sync,0));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.overlay').forEach(x=>x.hidden=true)});
 sync();
});
