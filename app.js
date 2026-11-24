// menu mobilne
const ham=document.querySelector('.ham'),panel=document.getElementById('panel');
ham.addEventListener('click',()=>{const o=panel.classList.toggle('otw');ham.setAttribute('aria-expanded',o);ham.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{panel.classList.remove('otw');ham.setAttribute('aria-expanded',false)}));

// pas zdjęć: strzałki
document.querySelectorAll('.strz').forEach(s=>{
  const pas=document.getElementById(s.dataset.pas),[l,p]=s.querySelectorAll('button');
  const krok=()=>pas.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(pas).columnGap||14);
  const stan=()=>{l.disabled=pas.scrollLeft<4;p.disabled=pas.scrollLeft+pas.clientWidth>=pas.scrollWidth-4};
  l.addEventListener('click',()=>pas.scrollBy({left:-krok(),behavior:'smooth'}));
  p.addEventListener('click',()=>pas.scrollBy({left:krok(),behavior:'smooth'}));
  pas.addEventListener('scroll',stan,{passive:true});addEventListener('resize',stan);stan();
});

// przeciąganie pasa myszą
document.querySelectorAll('.pas').forEach(pas=>{
  let x0=0,s0=0,ciag=false,ruch=0;
  pas.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;ciag=true;ruch=0;x0=e.clientX;s0=pas.scrollLeft;pas.style.scrollSnapType='none'});
  addEventListener('pointermove',e=>{if(!ciag)return;ruch=Math.abs(e.clientX-x0);pas.scrollLeft=s0-(e.clientX-x0)});
  addEventListener('pointerup',()=>{if(!ciag)return;ciag=false;pas.style.scrollSnapType=''});
  pas.addEventListener('click',e=>{if(ruch>6){e.preventDefault();e.stopPropagation();ruch=0}},true);
  pas.addEventListener('dragstart',e=>e.preventDefault());
});

// powiększenie zdjęć
const lb=document.getElementById('lb'),lbi=lb.querySelector('img'),licz=lb.querySelector('.licz');
let lista=[],ind=0,zrodlo=null;
const pokaz=i=>{ind=(i+lista.length)%lista.length;const b=lista[ind],mini=b.querySelector('img');
  lbi.src=b.dataset.src;lbi.alt=mini.alt;licz.textContent=(b.dataset.opis?b.dataset.opis+' · ':'')+(ind+1)+' / '+lista.length};
document.querySelectorAll('[data-galeria] button').forEach(b=>b.addEventListener('click',()=>{
  lista=[...b.closest('[data-galeria]').querySelectorAll('button')];zrodlo=b;lb.classList.add('otw');document.body.style.overflow='hidden';pokaz(lista.indexOf(b));lb.querySelector('.zam').focus()}));
const zamknij=()=>{lb.classList.remove('otw');document.body.style.overflow='';zrodlo&&zrodlo.focus()};
lb.querySelector('.zam').onclick=zamknij;lb.querySelector('.pop').onclick=()=>pokaz(ind-1);lb.querySelector('.nas').onclick=()=>pokaz(ind+1);
lb.addEventListener('click',e=>{if(e.target===lb)zamknij()});
addEventListener('keydown',e=>{if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zamknij();if(e.key==='ArrowLeft')pokaz(ind-1);if(e.key==='ArrowRight')pokaz(ind+1)});
let tx=0;lb.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)pokaz(ind+(d<0?1:-1))});

// formularz pokazowy
document.getElementById('formularz').addEventListener('submit',e=>{e.preventDefault();e.target.querySelector('.komunikat').textContent='To podgląd strony - formularz zacznie wysyłać wiadomości po wdrożeniu.'});

// aktywna pozycja menu
const linki=[...document.querySelectorAll('.menu a')],sekcje=['poziomy','hangul','o-mnie','materialy','kontakt'].map(id=>document.getElementById(id));
const io=new IntersectionObserver(ws=>ws.forEach(w=>{if(w.isIntersecting){const i=sekcje.indexOf(w.target);linki.forEach((a,j)=>a.classList.toggle('akt',j===i))}}),{rootMargin:'-45% 0px -50% 0px'});
sekcje.forEach(s=>io.observe(s));
