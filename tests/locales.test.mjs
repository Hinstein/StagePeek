import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  assertCompleteTranslations,
  localizedPath,
  localizedQuery,
  normalizeLocale,
  parseLocalizedPath,
  translationKeys,
} from '../server/locales.mjs';

test('supports five locales and defaults locale-less paths to English', () => {
  assert.deepEqual(SUPPORTED_LOCALES, ['en', 'zh-CN', 'zh-TW', 'ja', 'ko']);
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(normalizeLocale('en-US'), 'en');
  assert.equal(normalizeLocale('zh-hans'), 'zh-CN');
  assert.equal(normalizeLocale('zh-Hant-TW'), 'zh-TW');
  assert.equal(normalizeLocale('ja-JP'), 'ja');
  assert.equal(normalizeLocale('ko-KR'), 'ko');
  assert.equal(normalizeLocale('xx'), 'en');
  assert.deepEqual(parseLocalizedPath('/'), {locale: 'en', path: '/'});
  assert.deepEqual(parseLocalizedPath('/ja/venues/'), {locale: 'ja', path: '/venues/'});
  assert.deepEqual(parseLocalizedPath('/zh-TW/about'), {locale: 'zh-TW', path: '/about'});
});

test('builds locale routes without duplicating the English prefix', () => {
  assert.equal(localizedPath('en', '/venues/'), '/venues/');
  assert.equal(localizedPath('ja', '/venues/'), '/ja/venues/');
  assert.equal(localizedPath('ko', '/'), '/ko/');
  assert.equal(localizedPath('zh-CN', 'about'), '/zh-CN/about');
});

test('preserves only approved explorer and safe auth query parameters', () => {
  const input = new URL('https://stagepeek.live/explore?venue=kai-tak-stadium&layout=bowl&section=101&row=A&seat=78&mode=3d&token=secret&next=https%3A%2F%2Fevil.example&lang=zh-CN');
  assert.equal(
    localizedQuery('ja', input),
    '/ja/explore?venue=kai-tak-stadium&layout=bowl&section=101&row=A&seat=78&mode=3d'
  );

  const auth = new URL('https://stagepeek.live/auth/login?next=%2Fexplore%3Fvenue%3Dkai-tak-stadium&lang=zh-CN');
  assert.equal(localizedQuery('ko', auth), '/ko/auth/login?next=%2Fexplore%3Fvenue%3Dkai-tak-stadium');
});

test('all supported translation dictionaries contain the same reviewed keys', () => {
  const keys = translationKeys('en');
  assert.ok(keys.length > 40);
  for (const locale of SUPPORTED_LOCALES) assert.deepEqual(translationKeys(locale), keys, locale);
  assert.doesNotThrow(() => assertCompleteTranslations());
});
