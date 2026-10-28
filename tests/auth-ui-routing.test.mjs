import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {parseLocalizedPath,SUPPORTED_LOCALES,localizedPath} from '../public/locales.mjs';

const source=readFileSync(new URL('../public/auth-page.mjs',import.meta.url),'utf8');
const routing=source.slice(source.indexOf('const basePath='),source.indexOf('const en='));

test('every localized registration route opens registration rather than password login',()=>{
  for(const locale of SUPPORTED_LOCALES){
    const result=runInNewContext(routing+';({mode,source});',{location:{pathname:localizedPath(locale,'/auth/register')},parseLocalizedPath});
    assert.equal(result.mode,'register',locale);
    assert.equal(result.source,'register',locale);
  }
});

test('login and password recovery retain separate initial modes',()=>{
  for(const [path,expected] of [['/auth/login','login'],['/auth/reset','reset'],['/auth/password','setup']]){
    assert.equal(runInNewContext(routing+';mode;',{location:{pathname:path},parseLocalizedPath}),expected);
  }
});
