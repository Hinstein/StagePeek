import {setLocaleUrl} from './locales.mjs';
const controls=document.querySelectorAll('[data-language-switcher]');
for(const control of controls){
  const button=control.querySelector('button'),menu=control.querySelector('[role="menu"]');
  if(!button||!menu)continue;
  const close=()=>{control.classList.remove('is-open');button.setAttribute('aria-expanded','false');};
  button.addEventListener('click',event=>{event.stopPropagation();const open=!control.classList.contains('is-open');for(const other of controls)other.classList.remove('is-open');control.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));});
  button.addEventListener('keydown',event=>{if(event.key==='Escape')close();if(event.key==='ArrowDown'){event.preventDefault();control.classList.add('is-open');button.setAttribute('aria-expanded','true');menu.querySelector('a')?.focus();}});
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();button.focus();return;}if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;event.preventDefault();const items=[...menu.querySelectorAll('a')],index=items.indexOf(document.activeElement);items[event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowUp'?-1:1)+items.length)%items.length]?.focus();});
  control.addEventListener('focusout',event=>{if(!control.contains(event.relatedTarget))close();});
  document.addEventListener('click',event=>{if(!control.contains(event.target))close();});
  menu.addEventListener('click',event=>{const link=event.target.closest('[data-locale]');if(!link||event.defaultPrevented)return;event.preventDefault();setLocaleUrl(link.dataset.locale);});
}
