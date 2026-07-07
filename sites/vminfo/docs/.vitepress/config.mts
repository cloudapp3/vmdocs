import { defineConfig } from 'vitepress';
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import { adsClient } from './theme/ads-config';
import {
  LANGUAGES,
  ROOT_LANG,
  TRANSLATED_LANGS,
  localeMeta,
  detectLocale,
} from './languages';

const siteTitle = 'vminfo';
const siteDescription =
  'Cross-platform host runtime information toolkit with terminal UI, JSON output, web dashboard, and embeddable Go APIs.';

const siteUrl = 'https://vminfo.bestcheapvps.org';

// English path -> translated paths (only pages actually translated).
// Add a row whenever a page is localized into another language.
const translations: Record<string, Partial<Record<string, string>>> = {
  '': { zh: 'zh/', ja: 'ja/', ru: 'ru/', es: 'es/', 'pt-BR': 'pt-BR/', ko: 'ko/' },
  'guide/quick-start': { zh: 'zh/quick-start', ja: 'ja/quick-start', ru: 'ru/quick-start', es: 'es/quick-start', 'pt-BR': 'pt-BR/quick-start', ko: 'ko/quick-start' },
  'commands/': { zh: 'zh/commands', ja: 'ja/commands', ru: 'ru/commands', es: 'es/commands', 'pt-BR': 'pt-BR/commands', ko: 'ko/commands' },
  'guide/installation': { zh: 'zh/installation', ja: 'ja/installation', ru: 'ru/installation', es: 'es/installation', 'pt-BR': 'pt-BR/installation', ko: 'ko/installation' },
  'guide/overview': { zh: 'zh/overview', ja: 'ja/overview', ru: 'ru/overview', es: 'es/overview', 'pt-BR': 'pt-BR/overview', ko: 'ko/overview' },
  'guide/web-dashboard': { zh: 'zh/web-dashboard', ja: 'ja/web-dashboard', ru: 'ru/web-dashboard', es: 'es/web-dashboard', 'pt-BR': 'pt-BR/web-dashboard', ko: 'ko/web-dashboard' },
  'guide/deployment': { zh: 'zh/deployment', ja: 'ja/deployment', ru: 'ru/deployment', es: 'es/deployment', 'pt-BR': 'pt-BR/deployment', ko: 'ko/deployment' },
  'guide/platform-support': { zh: 'zh/platform-support', ja: 'ja/platform-support', ru: 'ru/platform-support', es: 'es/platform-support', 'pt-BR': 'pt-BR/platform-support', ko: 'ko/platform-support' },
  'guide/tui-controls': { zh: 'zh/tui-controls', ja: 'ja/tui-controls', ru: 'ru/tui-controls', es: 'es/tui-controls', 'pt-BR': 'pt-BR/tui-controls', ko: 'ko/tui-controls' },
  'api': { zh: 'zh/api', ja: 'ja/api', ru: 'ru/api', es: 'es/api', 'pt-BR': 'pt-BR/api', ko: 'ko/api' },
  'commands/summary': { zh: 'zh/summary', ja: 'ja/summary', ru: 'ru/summary', es: 'es/summary', 'pt-BR': 'pt-BR/summary', ko: 'ko/summary' },
  'commands/watch': { zh: 'zh/watch', ja: 'ja/watch', ru: 'ru/watch', es: 'es/watch', 'pt-BR': 'pt-BR/watch', ko: 'ko/watch' },
  'commands/ps': { zh: 'zh/ps', ja: 'ja/ps', ru: 'ru/ps', es: 'es/ps', 'pt-BR': 'pt-BR/ps', ko: 'ko/ps' },
  'commands/kill': { zh: 'zh/kill', ja: 'ja/kill', ru: 'ru/kill', es: 'es/kill', 'pt-BR': 'pt-BR/kill', ko: 'ko/kill' },
  'commands/net': { zh: 'zh/net', ja: 'ja/net', ru: 'ru/net', es: 'es/net', 'pt-BR': 'pt-BR/net', ko: 'ko/net' },
  'commands/update': { zh: 'zh/update', ja: 'ja/update', ru: 'ru/update', es: 'es/update', 'pt-BR': 'pt-BR/update', ko: 'ko/update' },
  'library/': { zh: 'zh/library', ja: 'ja/library', ru: 'ru/library', es: 'es/library', 'pt-BR': 'pt-BR/library', ko: 'ko/library' },
  'library/collect': { zh: 'zh/collect', ja: 'ja/collect', ru: 'ru/collect', es: 'es/collect', 'pt-BR': 'pt-BR/collect', ko: 'ko/collect' },
  'library/embed-tui': { zh: 'zh/embed-tui', ja: 'ja/embed-tui', ru: 'ru/embed-tui', es: 'es/embed-tui', 'pt-BR': 'pt-BR/embed-tui', ko: 'ko/embed-tui' },
};

// Per-locale hreflang/og metadata and detectLocale() live in ./languages.ts,
// the single source of truth for the site's languages.

// Normalize a path so 'zh/', 'zh', '/zh/' all compare equal. The translations
// map and the paths we derive from sitemap URLs / page data may differ on
// trailing slashes; this collapses those differences.
const normPath = (p: string) => p.replace(/^\/+|\/+$/g, '');

// Canonical absolute URL for a translations-map path entry. MUST stay identical
// to the URL VitePress writes to the sitemap, so that all three signals
// (head hreflang / canonical / sitemap alternates) agree char-for-char.
const hrefFor = (p: string) => `${siteUrl}/${p}`;

type TranslationVersion = {
  locale: string;
  hreflang: string;
  og: string;
  href: string; // absolute URL, for <head> hreflang + og
  path: string; // relative path, for sitemap <loc> / <xhtml:link>
};

// Returns every available language version of the page at `path` (empty if the
// page has no translation group). Single source of truth for head hreflang,
// og:locale:alternate, and sitemap alternates — all three derive from this so
// they can never disagree. (Google drops an entire hreflang group on any
// inconsistency, so keeping one source is the SEO-critical invariant here.)
function translationsForPath(path: string): TranslationVersion[] {
  const n = normPath(path);
  let enPath: string | undefined;
  for (const [en, t] of Object.entries(translations)) {
    const matches = normPath(en) === n || Object.values(t).some((p) => normPath(p ?? '') === n);
    if (matches) { enPath = en; break; }
  }
  if (enPath === undefined) return [];

  const t = translations[enPath];
  const out: TranslationVersion[] = [];
  const push = (code: string, p: string | undefined) => {
    // Empty string is a valid path (the English root). Only `undefined` means
    // "no translation for this language" and should be skipped.
    if (p === undefined) return;
    out.push({
      locale: code,
      hreflang: localeMeta[code].hreflang,
      og: localeMeta[code].og,
      href: hrefFor(p),
      path: p,
    });
  };
  // Root (English) first, then every translated language present in the map.
  push(ROOT_LANG.code, enPath);
  for (const l of TRANSLATED_LANGS) push(l.code, t[l.code]);
  return out;
}

// hreflang alternates: emits a <link> for every available translation of the
// current page (plus x-default pointing at English). Pages with no translation
// emit nothing.
function alternateLinks(path: string): any[] {
  const group = translationsForPath(path);
  if (!group.length) return [];
  const enHref = group.find((g) => g.locale === ROOT_LANG.code)?.href;
  return [
    ...group.map((g) => ['link', { rel: 'alternate', hreflang: g.hreflang, href: g.href }]),
    ...(enHref ? [['link', { rel: 'alternate', hreflang: 'x-default', href: enHref }]] as any[] : []),
  ];
}

// --- per-locale UI (nav / editLink / footer / sidebar) -----------------
// nav, editLink, footer, and the per-language sidebar all derive from
// LOCALE_UI; the locale switcher derives from LANGUAGES. Adding a language =
// add a LOCALE_UI entry — everything else is automatic. (The /guide/, /commands/,
// /library/, /roadmap/ sidebar sections are global and shared by all languages.)
const LOCALE_UI = {
  en: {
    nav: { guide: 'Guide', commands: 'Commands', api: 'HTTP API', library: 'Go Library', community: 'Community', docsRepo: 'Docs Repo', contributing: 'Contributing', changelog: 'Changelog', roadmap: 'Roadmap', privacy: 'Privacy Policy' },
    links: { guide: '/guide/quick-start', commands: '/commands/' },
    editLink: 'Edit this page on GitHub',
    footer: 'Released under the MIT License.',
    homeOgTitle: 'vminfo — terminal system monitor, web dashboard & Go library',
    sidebar: { title: 'Documentation', home: 'Home', quickStart: 'Quick Start', commands: 'Commands' },
  },
  zh: {
    nav: { guide: '快速开始', commands: '命令参考', api: 'HTTP API', library: 'Go 库', community: '社区', docsRepo: '文档仓库', contributing: '参与贡献', changelog: '更新日志', roadmap: '路线图', privacy: '隐私政策' },
    links: { guide: '/zh/quick-start', commands: '/zh/commands' },
    editLink: '在 GitHub 上编辑此页',
    footer: '基于 MIT 协议发布。',
    homeOgTitle: 'vminfo — 跨平台终端系统监控、Web 仪表盘与 Go 库',
    sidebar: { title: '中文文档', home: '中文首页', quickStart: '快速开始', commands: '命令参考' },
  },
  ja: {
    nav: { guide: 'クイックスタート', commands: 'コマンド', api: 'HTTP API', library: 'Go ライブラリ', community: 'コミュニティ', docsRepo: 'ドキュメントリポジトリ', contributing: '貢献する', changelog: '変更履歴', roadmap: 'ロードマップ', privacy: 'プライバシーポリシー' },
    links: { guide: '/ja/quick-start', commands: '/ja/commands' },
    editLink: 'GitHub でこのページを編集',
    footer: 'MIT ライセンスで公開。',
    homeOgTitle: 'vminfo — クロスプラットフォームのシステムモニター・Web ダッシュボード・Go ライブラリ',
    sidebar: { title: '日本語ドキュメント', home: '日本語トップ', quickStart: 'クイックスタート', commands: 'コマンドリファレンス' },
  },
  ru: {
    nav: { guide: 'Руководство', commands: 'Команды', api: 'HTTP API', library: 'Библиотека Go', community: 'Сообщество', docsRepo: 'Репозиторий док.', contributing: 'Участие', changelog: 'Журнал изменений', roadmap: 'Дорожная карта', privacy: 'Политика конфиденциальности' },
    links: { guide: '/ru/quick-start', commands: '/ru/commands' },
    editLink: 'Редактировать на GitHub',
    footer: 'Выпускается по лицензии MIT.',
    homeOgTitle: 'vminfo — системный монитор для терминала, веб-дашборд и библиотека Go',
    sidebar: { title: 'Документация', home: 'Главная', quickStart: 'Быстрый старт', commands: 'Команды' },
  },
  es: {
    nav: { guide: 'Guía', commands: 'Comandos', api: 'HTTP API', library: 'Biblioteca Go', community: 'Comunidad', docsRepo: 'Repositorio de docs', contributing: 'Contribuir', changelog: 'Cambios', roadmap: 'Hoja de ruta', privacy: 'Política de privacidad' },
    links: { guide: '/es/quick-start', commands: '/es/commands' },
    editLink: 'Editar esta página en GitHub',
    footer: 'Publicado bajo la licencia MIT.',
    homeOgTitle: 'vminfo — monitor del sistema para terminal, panel web y biblioteca Go',
    sidebar: { title: 'Documentación', home: 'Inicio', quickStart: 'Inicio rápido', commands: 'Comandos' },
  },
  'pt-BR': {
    nav: { guide: 'Guia', commands: 'Comandos', api: 'HTTP API', library: 'Biblioteca Go', community: 'Comunidade', docsRepo: 'Repositório de docs', contributing: 'Contribuir', changelog: 'Mudanças', roadmap: 'Roteiro', privacy: 'Política de privacidade' },
    links: { guide: '/pt-BR/quick-start', commands: '/pt-BR/commands' },
    editLink: 'Editar esta página no GitHub',
    footer: 'Publicado sob a licença MIT.',
    homeOgTitle: 'vminfo — monitor do sistema para terminal, painel web e biblioteca Go',
    sidebar: { title: 'Documentação', home: 'Início', quickStart: 'Início rápido', commands: 'Comandos' },
  },
  ko: {
    nav: { guide: '가이드', commands: '명령어', api: 'HTTP API', library: 'Go 라이브러리', community: '커뮤니티', docsRepo: '문서 저장소', contributing: '기여하기', changelog: '변경 이력', roadmap: '로드맵', privacy: '개인정보 처리방침' },
    links: { guide: '/ko/quick-start', commands: '/ko/commands' },
    editLink: 'GitHub에서 이 페이지 편집',
    footer: 'MIT 라이선스로 배포됩니다.',
    homeOgTitle: 'vminfo — 터미널 시스템 모니터, 웹 대시보드 및 Go 라이브러리',
    sidebar: { title: '문서', home: '홈', quickStart: '빠른 시작', commands: '명령어' },
  },
} as const;

// Locale switcher as a dropdown (keeps the nav tidy as languages grow,
// instead of a long flat row of language links). The label shows the current
// language; the menu lists the others.
function localeSwitcher(currentCode: string) {
  const current = LANGUAGES.find((l) => l.code === currentCode);
  return {
    text: current?.label ?? 'Language',
    items: LANGUAGES
      .filter((l) => l.code !== currentCode)
      .map((l) => ({ text: l.label, link: l.route + '/' })),
  };
}

function navFor(code: string) {
  const s = LOCALE_UI[code as keyof typeof LOCALE_UI] ?? LOCALE_UI.en;
  return [
    { text: s.nav.guide, link: s.links.guide },
    { text: s.nav.commands, link: s.links.commands },
    { text: s.nav.api, link: '/api' },
    { text: s.nav.library, link: '/library/' },
    localeSwitcher(code),
    {
      text: s.nav.community,
      items: [
        { text: 'GitHub', link: 'https://github.com/cloudapp3/vminfo' },
        { text: s.nav.docsRepo, link: 'https://github.com/cloudapp3/vmdocs' },
        { text: s.nav.contributing, link: '/contributing' },
        { text: s.nav.changelog, link: '/changelog' },
        { text: s.nav.roadmap, link: '/roadmap/feature-benchmark' },
        { text: s.nav.privacy, link: '/privacy' },
      ],
    },
  ];
}

function localeThemeConfig(code: string) {
  const s = LOCALE_UI[code as keyof typeof LOCALE_UI] ?? LOCALE_UI.en;
  return {
    nav: navFor(code),
    editLink: {
      pattern: 'https://github.com/cloudapp3/vmdocs/edit/main/sites/vminfo/docs/:path',
      text: s.editLink,
    },
    footer: {
      message: s.footer,
      copyright: 'Copyright © 2026 cloudapp3',
    },
  };
}

// Per-language sidebar sections (keyed by URL prefix like '/zh/'), generated
// from LANGUAGES + LOCALE_UI so a new language gets its sidebar for free.
function localizedSidebars() {
  const out: Record<string, any[]> = {};
  for (const l of TRANSLATED_LANGS) {
    const s = LOCALE_UI[l.code as keyof typeof LOCALE_UI];
    if (!s) continue;
    out[`/${l.code}/`] = [{
      text: s.sidebar.title,
      items: [
        { text: s.sidebar.home, link: `/${l.code}/` },
        { text: s.sidebar.quickStart, link: `/${l.code}/quick-start` },
        { text: s.sidebar.commands, link: `/${l.code}/commands` },
      ],
    }];
  }
  return out;
}

const teekConfig = defineTeekConfig({
  teekTheme: true,
  teekHome: false,
  vpHome: true,
  vitePlugins: {
    mdH1: true,
    autoFrontmatter: false,
    sidebarOption: {
      ignoreList: ['assets'],
      scannerRootMd: false,
    },
  },
});

export default defineConfig({
  extends: teekConfig,

  lang: 'en-US',
  title: siteTitle,
  titleTemplate: ':title | vminfo',
  description: siteDescription,

  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  // The legacy Chinese README stub duplicates /zh/; exclude it from being
  // built as a page so it can't pollute the sitemap or split search ranking.
  srcExclude: ['README.zh-CN.md'],

  // Per-locale <html lang> + nav/editLink/footer, derived from LANGUAGES. The
  // root locale (English) has no URL prefix; each translated language lives
  // under its `route`. (sidebar stays global — it's keyed by URL prefix.)
  locales: Object.fromEntries(
    LANGUAGES.map((l) => [
      l.root ? 'root' : l.code,
      { label: l.label, lang: l.vpLang, themeConfig: localeThemeConfig(l.code) },
    ])
  ),

  sitemap: {
    hostname: siteUrl,
    // Emit hreflang alternates in sitemap.xml so Google sees the same language
    // mappings in <head> and the sitemap (it accepts either; emitting both is
    // the most robust). We override VitePress's built-in auto-grouping, which
    // mis-splits the English `commands/index.md` (dir) from `ja/commands.md`
    // (file) and drops the English version out of the group —
    // `translationsForPath` is the authority here.
    transformItems: async (items) => {
      return items.map((item) => {
        // item.url is a relative path (e.g. 'commands/', 'ja/commands'); the
        // sitemap stream prepends the hostname at serialization time.
        const group = translationsForPath(normPath(item.url));
        if (group.length) {
          item.links = group.map((g) => ({ url: g.path, lang: g.hreflang }));
        }
        return item;
      });
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#22c55e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:image', content: `${siteUrl}/og-image.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/og-image.png` }],
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    // AdSense site verification (loads no scripts, sets no cookies on its own).
    ['meta', { name: 'google-adsense-account', content: adsClient }],
  ],

  // Per-page canonical URL, Open Graph, locale, and hreflang tags (SEO)
  transformHead: async (context) => {
    const path = context.page
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '');
    const url = `${siteUrl}/${path}`;
    const loc = detectLocale(path);
    const isHome = context.page === 'index.md'
      || TRANSLATED_LANGS.some((l) => context.page === `${l.code}/index.md`);
    const homeOgTitle = (LOCALE_UI[loc as keyof typeof LOCALE_UI] ?? LOCALE_UI.en).homeOgTitle;

    const head: any[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: isHome ? homeOgTitle : (context.title || homeOgTitle) }],
      ['meta', { property: 'og:description', content: context.description || siteDescription }],
      ['meta', { property: 'og:locale', content: localeMeta[loc].og }],
    ];

    // hreflang alternates for every available translation of this page.
    head.push(...alternateLinks(path));

    // og:locale:alternate — tells social crawlers about the other language
    // versions of this page (the current language is already in og:locale above).
    for (const g of translationsForPath(path)) {
      if (g.locale === loc) continue;
      head.push(['meta', { property: 'og:locale:alternate', content: g.og }]);
    }

    // Structured data: the landing page is a SoftwareApplication, docs are TechArticle.
    if (isHome) {
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: siteTitle,
        applicationCategory: 'SystemApplication',
        operatingSystem: 'Linux, macOS, Windows',
        description: context.description || siteDescription,
        url,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      })]);
    } else if (context.title) {
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: context.title,
        description: context.description || siteDescription,
        url,
        author: { '@type': 'Organization', name: 'cloudapp3' },
        publisher: { '@type': 'Organization', name: 'cloudapp3' },
      })]);
    }

    return head;
  },

  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Deployment', link: '/guide/deployment' },
            { text: 'Platform Support', link: '/guide/platform-support' },
          ],
        },
        {
          text: 'Using vminfo',
          items: [
            { text: 'Overview', link: '/guide/overview' },
            { text: 'Web Dashboard', link: '/guide/web-dashboard' },
            { text: 'TUI Controls', link: '/guide/tui-controls' },
          ],
        },
      ],
      '/commands/': [
        {
          text: 'Commands',
          items: [
            { text: 'Command Reference', link: '/commands/' },
            { text: 'summary', link: '/commands/summary' },
            { text: 'watch', link: '/commands/watch' },
            { text: 'ps', link: '/commands/ps' },
            { text: 'kill', link: '/commands/kill' },
            { text: 'net', link: '/commands/net' },
            { text: 'update', link: '/commands/update' },
          ],
        },
      ],
      '/library/': [
        {
          text: 'Go Library',
          items: [
            { text: 'Library Usage', link: '/library/' },
            { text: 'Collect Metrics', link: '/library/collect' },
            { text: 'Embed TUI', link: '/library/embed-tui' },
          ],
        },
      ],
      '/roadmap/': [
        {
          text: 'Roadmap',
          items: [{ text: 'Feature Benchmark', link: '/roadmap/feature-benchmark' }],
        },
      ],
      // Per-language sidebars (zh/ja/ru/…) generated from LANGUAGES + LOCALE_UI,
      // so adding a language adds its sidebar automatically.
      ...localizedSidebars(),
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/cloudapp3/vminfo' }],
  },
});
