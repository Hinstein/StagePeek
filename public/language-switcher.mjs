const controls=document.querySelectorAll('[data-language-switcher]');
for(const control of controls){
  const button=control.querySelector('button'),menu=control.querySelector('[role="menu"]');
  if(!button||!menu)continue;
  const close=()=>{control.classList.remove('is-open');button.setAttribute('aria-expanded','false');};
  button.addEventListener('click',event=>{event.stopPropagation();const open=!control.classList.contains('is-open');for(const other of controls)other.classList.remove('is-open');control.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));});
  button.addEventListener('keydown',event=>{if(event.key==='Escape')close();if(event.key==='ArrowDown'){event.preventDefault();control.classList.add('is-open');button.setAttribute('aria-expanded','true');menu.querySelector('a')?.focus();}});
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){close();button.focus();}});
  document.addEventListener('click',event=>{if(!control.contains(event.target))close();});
}
