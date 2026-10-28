import {mountKaiTakPreview} from './home-venue-preview.mjs';
import './language-switcher.mjs';


void mountKaiTakPreview(document.querySelector('[data-live-preview]'));

document.querySelectorAll('[data-peek-zoom]').forEach(button=>button.addEventListener('click',()=>{
  const wrap=button.closest('.view-peek');
  wrap.querySelector('[data-peek-scene]').style.transform=`scale(${Number(button.dataset.peekZoom)})`;
  wrap.querySelector('[data-peek-scene]').style.transformOrigin='50% 57%';
  wrap.querySelectorAll('[data-peek-zoom]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.peekZoom===button.dataset.peekZoom)));
}));
