import {mountKaiTakPreview} from './home-venue-preview.mjs';
import {getLocale,localizedPath,t} from './locales.mjs';
import './language-switcher.mjs';

const locale=getLocale();

void mountKaiTakPreview(document.querySelector('[data-live-preview]'));

document.querySelectorAll('[data-peek-zoom]').forEach(button=>button.addEventListener('click',()=>{
  const wrap=button.closest('.view-peek');
  wrap.querySelector('[data-peek-scene]').style.transform=`scale(${Number(button.dataset.peekZoom)})`;
  wrap.querySelector('[data-peek-scene]').style.transformOrigin='50% 57%';
  wrap.querySelectorAll('[data-peek-zoom]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));

fetch('/api/me',{cache:'no-store'}).then(response=>response.ok?response.json():null).then(me=>{
  window.stagepeekSignedIn=!!me?.user;
  if(!me?.user)return;
  const account=document.querySelector('#home-account');
  account.href=localizedPath(locale,'/account');
  account.textContent=t('nav.account');
}).catch(()=>{});
