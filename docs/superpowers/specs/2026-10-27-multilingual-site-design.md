# StagePeek 多语言站点设计

## Intent

StagePeek 默认以英文服务全球用户，同时为简体中文、繁体中文、日文和韩文用户提供自然的本地化体验。语言页面需要能被直接访问、分享和搜索引擎理解，切换语言时应保留当前页面和可安全保留的工具参数。

## Goals

- 默认根路径 `/` 使用英文。
- 提供 `/zh-CN/`、`/zh-TW/`、`/ja/`、`/ko/` 语言前缀；英文保留根路径作为 canonical 默认入口。
- 覆盖所有普通用户可见页面：主页、探索器、场馆目录与指南、关于、数据方法、计划、联系、隐私、条款、登录、注册、验证、找回密码和账号页。
- 在全站公共导航提供地球图标语言按钮，显示当前语言和可选语言名称；切换时保留当前路径、探索器查询参数和安全的认证 `next` 参数。
- 为每个可索引语言页面输出对应的 `lang`、自 canonical、互 reciprocal `hreflang` 和 `x-default`；sitemap 只收录真正可访问的 canonical 页面。
- 使用共享翻译资源和可审校的页面内容结构，避免四/五套 HTML 长期分叉。
- 将产品术语、购票/座位表达、礼貌程度、标点和大小写按目标地区习惯处理；数据来源、未校准、非官方和能力限制保持原意。

## Non-goals and anti-goals

- 不翻译后台、资料审核、研究和内部管理页面（如 admin、local-review、global-sources、reference-sources）；这些页面不是普通用户产品入口。
- 不使用浏览器自动翻译或逐字替换作为最终文案。
- 不为语言版本伪造当地场馆、价格、测量精度、官方授权或统计数据。
- 不改变现有座位数据、认证协议、计费状态和 3D/2D 几何逻辑。

## Approaches

1. 每种语言单独维护页面：简单直观，但会复制模板，容易产生内容差异。
2. 单地址客户端切换：改动较少，但首屏 HTML、canonical 和搜索引擎语言信号不完整。
3. 语言前缀路由与共享翻译资源（selected）：保留一个页面渲染系统，以 locale 解析器和翻译资源生成不同语言的 HTML 与前端文案。它满足 SEO、分享和维护要求，且不复制现有页面模板。

## Design

### Locale and routing

The supported locales are `en`, `zh-CN`, `zh-TW`, `ja`, and `ko`. `/` is the English default. Localized paths use the locale prefix followed by the existing public path, for example `/ja/venues/` and `/zh-TW/about`. Existing Chinese root links are migrated to English root links; legacy locale-less public paths redirect or resolve consistently according to the selected canonical policy.

The locale parser owns validation at the request boundary. It preserves only known public route segments and safe query parameters. Explorer parameters (`venue`, `event`, `layout`, `section`, `row`, `seat`, `mode`, `zoom`, `depth`, `lateral`, `standing`, `date`, `panel`, and `data`) remain intact when switching language. Authentication return paths continue to pass through the existing safe-return validation.

### Translation resources

Translation resources are organized by locale and feature area: shared navigation/actions, home, explorer, public guides/legal pages, and authentication/account flows. Dynamic values such as venue names, counts, dates, source versions, and seat labels remain structured values and are interpolated through locale-aware formatters rather than embedded in translated strings.

The resource layer exposes typed lookup/interpolation functions to both server-rendered public pages and browser modules. Missing translations fail visibly in development checks and use the English resource only as a controlled fallback at runtime; they are not silently presented as a completed localized page.

### Language control

The shared control is a compact globe button with an accessible label such as “Language” / its localized equivalent. Opening it presents all five language names in their own writing systems, with the current locale marked. The control is keyboard accessible, works on mobile, and does not transmit user data. Switching uses a normal navigation to the equivalent locale URL so the new document metadata and server copy are correct.

### SEO and metadata

Each indexable localized page gets a localized title, description, visible H1, canonical, Open Graph locale, and JSON-LD language value where applicable. Every localized equivalent links to all five supported versions plus `x-default`; unsupported or internal pages do not enter the localized sitemap. Locale-specific route generation and rendered HTML are tested on representative home, directory, venue, methodology, and tool routes.

### Review process

The initial copy will be written as product copy for each locale, not machine-translated output. Review checks cover terminology, naturalness, honorific/register, punctuation, numerals/date formatting, navigation length, button fit, accessibility labels, and legal/data-status meaning. A locale is considered complete only when its route inventory has no missing keys and its representative pages have been reviewed by a fluent reviewer or explicitly marked pending review before publication.

## Verification

- Unit tests for locale parsing, equivalent-route generation, query preservation, missing-key checks, formatters, and `hreflang`/canonical generation.
- Existing public-page, analytics, auth, and app-selection tests continue to pass.
- Rendered HTML checks for all five home pages and representative public routes.
- Browser checks on desktop and 390px mobile for the globe control, navigation, language switching, and explorer parameters.
- Build and sitemap checks confirm only intended canonical localized URLs are emitted.

## Implementation calls

- English is the default and the first copy source; Chinese root URLs are not retained as a hidden default.
- Traditional Chinese is a separate locale (`zh-TW`), not a character conversion of simplified Chinese.
- Public user routes are localized; internal review/admin routes remain as existing internal tools.
- The existing visual system remains in place unless a localized string causes a measured layout or accessibility issue.
