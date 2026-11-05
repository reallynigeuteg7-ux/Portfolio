document.querySelectorAll('[data-enhanced]').forEach(el=>el.hidden=false);
const cards=[...document.querySelectorAll('.project[data-category]')];
const total=cards.length;
const filterButtons=[...document.querySelectorAll('[data-filter]')];
const search=document.querySelector('#project-search');
if(cards.length){
 const params=new URLSearchParams(location.search);
 let category=filterButtons.some(b=>b.dataset.filter===params.get('category'))?params.get('category'):'all';
 search.value=params.get('q')||'';
 function update(){
  const q=search.value.trim().toLocaleLowerCase('ru');
  let count=0;
  cards.forEach(card=>{card.hidden=!((category==='all'||card.dataset.category===category)&&card.dataset.search.includes(q));if(!card.hidden)count++;});
  filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
  document.querySelector('#result-count').textContent=count===total?`Все ${total} проектов`:`Найдено: ${count} из ${total}`;
  document.querySelector('.empty-state').hidden=count!==0;
  const url=new URL(location.href);
  if(category==='all')url.searchParams.delete('category');else url.searchParams.set('category',category);
  if(q)url.searchParams.set('q',search.value.trim());else url.searchParams.delete('q');
  history.replaceState(null,'',url);
 }
 filterButtons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;update();}));
 search.addEventListener('input',update);
 document.querySelector('#reset-filters').addEventListener('click',()=>{category='all';search.value='';update();search.focus();});
 update();
}
const dialog=document.querySelector('#lightbox');
let opener;
document.querySelectorAll('[data-lightbox]').forEach(link=>link.addEventListener('click',event=>{
 if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();opener=link;
 const img=document.querySelector('#lightbox-image');
 img.src=link.href;img.alt=link.dataset.alt;
 document.querySelector('#lightbox-title').textContent=link.dataset.alt;
 dialog.showModal();document.body.classList.add('lightbox-open');
}));
dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{document.body.classList.remove('lightbox-open');opener?.focus();});
