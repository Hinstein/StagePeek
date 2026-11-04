const nav=document.querySelector('[data-site-header] nav, .header nav');
if(nav&&!location.pathname.startsWith('/concert-views')){const link=document.createElement('a');link.href='/concert-views?venue=twcv-the-o2-arena-london&layout=o2a&mode=3d';link.textContent='演唱会视角 · O2 / Hydro';nav.append(link);}
