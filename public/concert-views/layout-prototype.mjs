import {copy} from '../locales.mjs';
// The approved B layout reuses the production form and shared scene.
document.body.dataset.uiLayout='B';
const style=document.createElement('link');style.rel='stylesheet';style.href='/concert-views/layout-prototype.css';document.head.append(style);
const help=document.createElement('details');help.className='preview-help';
const summary=document.createElement('summary');summary.textContent=copy('使用说明');
help.append(summary,document.querySelector('.explorer-steps'));document.querySelector('.intro').append(help);
