(() => {
 'use strict';
 const dialog=document.getElementById('preview-dialog');
 if(!dialog)return;
 let opener=null;
 document.querySelectorAll('[data-preview]').forEach(card=>card.addEventListener('click',()=>{
  opener=card;
  document.getElementById('preview-title').textContent=card.dataset.name;
  document.getElementById('preview-segment').textContent=card.dataset.segment;
  const image=document.getElementById('preview-image');
  image.src=card.dataset.preview;image.alt=card.dataset.name+' website preview on desktop and mobile';
  dialog.showModal();
 }));
 dialog.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();