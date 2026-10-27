import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');

test('explorer exposes a three-step flow with actionable async status regions',()=>{
  assert.equal((html.match(/data-explorer-step="/g)||[]).length,3);
  assert.match(html,/id="explorer-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(html,/id="location-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(html,/id="events-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(html,/id="venue-retry"[^>]*data-i18n="common.retry"/);
  assert.match(html,/id="events-retry"[^>]*data-i18n="common.retry"/);
});

test('explorer keeps seat actions disabled until a complete ticket location is ready',()=>{
  assert.match(app,/function updateLocateAvailability\(\)/);
  assert.match(app,/button\.disabled=!ready\|\|button\.getAttribute\?\.\('aria-busy'\)==='true'/);
  assert.match(app,/setBusy\('locate',true,copy\("正在查找座位…"\)\)/);
  assert.match(app,/setStatus\('explorer-status',found\.status==='matched'/);
});

test('saving gives visitors a reason to sign in and gives members a confirmation',()=>{
  assert.match(app,/setStatus\('save-feedback',copy\("登录后即可保存这个座位。"\),'error'\)/);
  assert.match(app,/setStatus\('save-feedback',copy\("已保存。可在账号页查看收藏。"\),'success'\)/);
});
