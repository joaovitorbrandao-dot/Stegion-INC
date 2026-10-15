(() => {
 'use strict';
 const sequence=document.getElementById('hero');
 const stage=sequence.querySelector('.hero-stage');
 const slides=[...document.querySelectorAll('.slide')];
 const dots=[...document.querySelectorAll('.slide-dot')];
 const desktop=matchMedia('(min-width:901px)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let current=0,queued=false,touchStart=null;
 const scrollMode=()=>desktop.matches&&!reduced.matches;
 const loadImage=i=>{const image=slides[i]?.querySelector('img');if(image?.dataset.src){image.src=image.dataset.src;delete image.dataset.src;}};
 function show(index){
  current=Math.max(0,Math.min(slides.length-1,index));
  loadImage(current);loadImage(current+1);
  slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('is-active',active);slide.inert=!active;slide.setAttribute('aria-hidden',String(!active));});
  dots.forEach((dot,i)=>{dot.classList.toggle('is-past',i<current);if(i===current)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
  document.getElementById('slide-count').textContent=String(current+1).padStart(2,'0')+' / 08';
  document.getElementById('slide-segment').textContent=slides[current].dataset.segment;
 }
 function range(){return Math.max(1,sequence.offsetHeight-stage.offsetHeight)}
 function syncScroll(){queued=false;if(!scrollMode())return;const offset=parseFloat(getComputedStyle(stage).top)||0;const progress=Math.max(0,Math.min(.999999,(offset-sequence.getBoundingClientRect().top)/range()));const index=Math.floor(progress*slides.length);if(index!==current)show(index);}
 function schedule(){if(!queued){queued=true;requestAnimationFrame(syncScroll)}}
 function navigate(index){index=Math.max(0,Math.min(slides.length-1,index));show(index);if(scrollMode()){const top=parseFloat(getComputedStyle(stage).top)||0;window.scrollTo({top:scrollY+sequence.getBoundingClientRect().top-top+(index+.15)/slides.length*range(),behavior:'instant'});}}
 dots.forEach((dot,i)=>{dot.addEventListener('click',()=>navigate(i));dot.addEventListener('keydown',event=>{let next=i;if(event.key==='ArrowRight')next=(i+1)%slides.length;else if(event.key==='ArrowLeft')next=(i+slides.length-1)%slides.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=slides.length-1;else return;event.preventDefault();dots[next].focus({preventScroll:true});navigate(next);});});
 stage.addEventListener('touchstart',event=>{if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
 stage.addEventListener('touchend',event=>{if(!touchStart||scrollMode())return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)navigate((current+(dx<0?1:7))%slides.length);},{passive:true});
 stage.addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);desktop.addEventListener('change',schedule);reduced.addEventListener('change',schedule);
 show(0);syncScroll();
 // Download remaining hero assets progressively, without blocking the initial render.
 const preloadNext=i=>{if(i>=slides.length)return;loadImage(i);setTimeout(()=>preloadNext(i+1),600)};
 if('requestIdleCallback' in window)requestIdleCallback(()=>preloadNext(2),{timeout:2000});else setTimeout(()=>preloadNext(2),1500);
 const dialog=document.getElementById('preview-dialog');
 let opener=null;
 document.querySelectorAll('[data-preview]').forEach(card=>card.addEventListener('click',()=>{opener=card;document.getElementById('preview-title').textContent=card.dataset.name;document.getElementById('preview-segment').textContent=card.dataset.segment;const image=document.getElementById('preview-image');image.src=card.dataset.preview;image.alt=card.dataset.name+' website preview on desktop and mobile';dialog.showModal();}));
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();
