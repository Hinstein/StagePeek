const buttons=[...document.querySelectorAll('[data-style]')];
const applyStyle=style=>{
  if(!buttons.some(button=>button.dataset.style===style))return;
  document.body.className=style;
  buttons.forEach(button=>button.classList.toggle('active',button.dataset.style===style));
  history.replaceState(null,'','?style='+style);
};
for(const button of buttons)button.addEventListener('click',()=>applyStyle(button.dataset.style));
const initial=new URLSearchParams(location.search).get('style');
if(initial)applyStyle(initial);
