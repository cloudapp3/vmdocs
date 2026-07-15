import { defineConfig } from 'vitepress';
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import {
  LANGUAGES,
  ROOT_LANG,
  TRANSLATED_LANGS,
  localeMeta,
  detectLocale,
} from './languages';

const siteTitle = 'vmflow';
const siteDescription =
  'A small pure-Go L4 forwarding runtime. Run it as a standalone daemon or embed it into your own control plane — TCP/UDP forwarding, rule lifecycle, precheck, metrics, and a terminal UI.';

const siteUrl = 'https://vmflow.bestcheapvps.org';

// English path -> translated paths (only pages actually translated).
// Every user-facing content page is translated into all six languages;
// changelog / contributing / privacy stay English-only (canonical record / meta).
// NOTE: guide/tui and commands/tui are distinct English pages, so guide/tui
// localizes to "<lang>/tui-guide" to avoid colliding with commands/tui -> "<lang>/tui".
const translations: Record<string, Partial<Record<string, string>>> = {
  '': { zh: 'zh/', ja: 'ja/', ru: 'ru/', es: 'es/', 'pt-BR': 'pt-BR/', ko: 'ko/' },
  'guide/quick-start': { zh: 'zh/quick-start', ja: 'ja/quick-start', ru: 'ru/quick-start', es: 'es/quick-start', 'pt-BR': 'pt-BR/quick-start', ko: 'ko/quick-start' },
  'guide/installation': { zh: 'zh/installation', ja: 'ja/installation', ru: 'ru/installation', es: 'es/installation', 'pt-BR': 'pt-BR/installation', ko: 'ko/installation' },
  'guide/configuration': { zh: 'zh/configuration', ja: 'ja/configuration', ru: 'ru/configuration', es: 'es/configuration', 'pt-BR': 'pt-BR/configuration', ko: 'ko/configuration' },
  'guide/deployment': { zh: 'zh/deployment', ja: 'ja/deployment', ru: 'ru/deployment', es: 'es/deployment', 'pt-BR': 'pt-BR/deployment', ko: 'ko/deployment' },
  'guide/forwarding': { zh: 'zh/forwarding', ja: 'ja/forwarding', ru: 'ru/forwarding', es: 'es/forwarding', 'pt-BR': 'pt-BR/forwarding', ko: 'ko/forwarding' },
  'guide/rules': { zh: 'zh/rules', ja: 'ja/rules', ru: 'ru/rules', es: 'es/rules', 'pt-BR': 'pt-BR/rules', ko: 'ko/rules' },
  'guide/precheck': { zh: 'zh/precheck', ja: 'ja/precheck', ru: 'ru/precheck', es: 'es/precheck', 'pt-BR': 'pt-BR/precheck', ko: 'ko/precheck' },
  'guide/tui': { zh: 'zh/tui-guide', ja: 'ja/tui-guide', ru: 'ru/tui-guide', es: 'es/tui-guide', 'pt-BR': 'pt-BR/tui-guide', ko: 'ko/tui-guide' },
  'guide/telegram-bot': { zh: 'zh/telegram-bot', ja: 'ja/telegram-bot', ru: 'ru/telegram-bot', es: 'es/telegram-bot', 'pt-BR': 'pt-BR/telegram-bot', ko: 'ko/telegram-bot' },
  'commands/': { zh: 'zh/commands', ja: 'ja/commands', ru: 'ru/commands', es: 'es/commands', 'pt-BR': 'pt-BR/commands', ko: 'ko/commands' },
  'commands/daemon': { zh: 'zh/daemon', ja: 'ja/daemon', ru: 'ru/daemon', es: 'es/daemon', 'pt-BR': 'pt-BR/daemon', ko: 'ko/daemon' },
  'commands/ctl': { zh: 'zh/ctl', ja: 'ja/ctl', ru: 'ru/ctl', es: 'es/ctl', 'pt-BR': 'pt-BR/ctl', ko: 'ko/ctl' },
  'commands/tui': { zh: 'zh/tui', ja: 'ja/tui', ru: 'ru/tui', es: 'es/tui', 'pt-BR': 'pt-BR/tui', ko: 'ko/tui' },
  'commands/version': { zh: 'zh/version', ja: 'ja/version', ru: 'ru/version', es: 'es/version', 'pt-BR': 'pt-BR/version', ko: 'ko/version' },
  'commands/update': { zh: 'zh/update', ja: 'ja/update', ru: 'ru/update', es: 'es/update', 'pt-BR': 'pt-BR/update', ko: 'ko/update' },
  'commands/service': { zh: 'zh/service', ja: 'ja/service', ru: 'ru/service', es: 'es/service', 'pt-BR': 'pt-BR/service', ko: 'ko/service' },
  'commands/uninstall': { zh: 'zh/uninstall', ja: 'ja/uninstall', ru: 'ru/uninstall', es: 'es/uninstall', 'pt-BR': 'pt-BR/uninstall', ko: 'ko/uninstall' },
  'library/': { zh: 'zh/library', ja: 'ja/library', ru: 'ru/library', es: 'es/library', 'pt-BR': 'pt-BR/library', ko: 'ko/library' },
  'library/runtime': { zh: 'zh/runtime', ja: 'ja/runtime', ru: 'ru/runtime', es: 'es/runtime', 'pt-BR': 'pt-BR/runtime', ko: 'ko/runtime' },
  'api': { zh: 'zh/api', ja: 'ja/api', ru: 'ru/api', es: 'es/api', 'pt-BR': 'pt-BR/api', ko: 'ko/api' },
  'roadmap': { zh: 'zh/roadmap', ja: 'ja/roadmap', ru: 'ru/roadmap', es: 'es/roadmap', 'pt-BR': 'pt-BR/roadmap', ko: 'ko/roadmap' },
};

// Per-locale hreflang/og metadata and detectLocale() live in ./languages.ts,
// the single source of truth for the site's languages.

// Normalize a path so 'zh/', 'zh', '/zh/' all compare equal.
const normPath = (p: string) => p.replace(/^\/+|\/+$/g, '');

// Canonical absolute URL for a translations-map path entry. MUST stay identical
// to the URL VitePress writes to the sitemap, so head hreflang / canonical /
// sitemap alternates agree char-for-char.
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
// og:locale:alternate, and sitemap alternates.
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
    if (p === undefined) return;
    out.push({
      locale: code,
      hreflang: localeMeta[code].hreflang,
      og: localeMeta[code].og,
      href: hrefFor(p),
      path: p,
    });
  };
  push(ROOT_LANG.code, enPath);
  for (const l of TRANSLATED_LANGS) push(l.code, t[l.code]);
  return out;
}

// hreflang alternates: emits a <link> for every available translation of the
// current page (plus x-default pointing at English).
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
const LOCALE_UI = {
  en: {
    nav: { guide: 'Guide', cli: 'CLI', library: 'Go Library', community: 'Community', docsRepo: 'Docs Repo', contributing: 'Contributing', changelog: 'Changelog', roadmap: 'Roadmap', privacy: 'Privacy Policy' },
    links: { guide: '/guide/quick-start', cli: '/commands/' },
    editLink: 'Edit this page on GitHub',
    footer: 'Released under the MIT License.',
    homeOgTitle: 'vmflow — pure-Go L4 port forwarding runtime & Go library',
    sidebar: { title: 'Documentation', home: 'Home', quickStart: 'Quick Start', configuration: 'Configuration', cli: 'CLI' },
  },
  zh: {
    nav: { guide: '指南', cli: '命令行', library: 'Go 库', community: '社区', docsRepo: '文档仓库', contributing: '参与贡献', changelog: '更新日志', roadmap: '路线图', privacy: '隐私政策' },
    links: { guide: '/zh/quick-start', cli: '/zh/commands' },
    editLink: '在 GitHub 上编辑此页',
    footer: '基于 MIT 协议发布。',
    homeOgTitle: 'vmflow — 纯 Go 的 L4 端口转发运行时与 Go 库',
    sidebar: { title: '中文文档', home: '中文首页', quickStart: '快速开始', configuration: '配置', cli: '命令行' },
  },
  ja: {
    nav: { guide: 'ガイド', cli: 'コマンド', library: 'Go ライブラリ', community: 'コミュニティ', docsRepo: 'ドキュメントリポジトリ', contributing: '貢献する', changelog: '変更履歴', roadmap: 'ロードマップ', privacy: 'プライバシーポリシー' },
    links: { guide: '/ja/quick-start', cli: '/ja/commands' },
    editLink: 'GitHub でこのページを編集',
    footer: 'MIT ライセンスで公開。',
    homeOgTitle: 'vmflow — 純 Go の L4 ポート転送ランタイムと Go ライブラリ',
    sidebar: { title: '日本語ドキュメント', home: '日本語トップ', quickStart: 'クイックスタート', configuration: '設定', cli: 'コマンド' },
  },
  ru: {
    nav: { guide: 'Руководство', cli: 'CLI', library: 'Библиотека Go', community: 'Сообщество', docsRepo: 'Репозиторий док.', contributing: 'Участие', changelog: 'Журнал изменений', roadmap: 'Дорожная карта', privacy: 'Политика конфиденциальности' },
    links: { guide: '/ru/quick-start', cli: '/ru/commands' },
    editLink: 'Редактировать на GitHub',
    footer: 'Выпускается по лицензии MIT.',
    homeOgTitle: 'vmflow — среду L4-перенаправления портов на чистом Go и библиотеку Go',
    sidebar: { title: 'Документация', home: 'Главная', quickStart: 'Быстрый старт', configuration: 'Конфигурация', cli: 'CLI' },
  },
  es: {
    nav: { guide: 'Guía', cli: 'CLI', library: 'Biblioteca Go', community: 'Comunidad', docsRepo: 'Repositorio de docs', contributing: 'Contribuir', changelog: 'Cambios', roadmap: 'Hoja de ruta', privacy: 'Política de privacidad' },
    links: { guide: '/es/quick-start', cli: '/es/commands' },
    editLink: 'Editar esta página en GitHub',
    footer: 'Publicado bajo la licencia MIT.',
    homeOgTitle: 'vmflow — entorno de reenvío de puertos L4 en Go puro y biblioteca Go',
    sidebar: { title: 'Documentación', home: 'Inicio', quickStart: 'Inicio rápido', configuration: 'Configuración', cli: 'CLI' },
  },
  'pt-BR': {
    nav: { guide: 'Guia', cli: 'CLI', library: 'Biblioteca Go', community: 'Comunidade', docsRepo: 'Repositório de docs', contributing: 'Contribuir', changelog: 'Mudanças', roadmap: 'Roteiro', privacy: 'Política de privacidade' },
    links: { guide: '/pt-BR/quick-start', cli: '/pt-BR/commands' },
    editLink: 'Editar esta página no GitHub',
    footer: 'Publicado sob a licença MIT.',
    homeOgTitle: 'vmflow — runtime de encaminhamento de portas L4 em Go puro e biblioteca Go',
    sidebar: { title: 'Documentação', home: 'Início', quickStart: 'Início rápido', configuration: 'Configuração', cli: 'CLI' },
  },
  ko: {
    nav: { guide: '가이드', cli: 'CLI', library: 'Go 라이브러리', community: '커뮤니티', docsRepo: '문서 저장소', contributing: '기여하기', changelog: '변경 이력', roadmap: '로드맵', privacy: '개인정보 처리방침' },
    links: { guide: '/ko/quick-start', cli: '/ko/commands' },
    editLink: 'GitHub에서 이 페이지 편집',
    footer: 'MIT 라이선스로 배포됩니다.',
    homeOgTitle: 'vmflow — 순수 Go L4 포트 포워딩 런타임 및 Go 라이브러리',
    sidebar: { title: '문서', home: '홈', quickStart: '빠른 시작', configuration: '설정', cli: 'CLI' },
  },
} as const;

// Locale switcher as a dropdown (keeps the nav tidy as languages grow).
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
    { text: s.nav.cli, link: s.links.cli },
    { text: s.nav.library, link: '/library/' },
    localeSwitcher(code),
    {
      text: s.nav.community,
      items: [
        { text: 'GitHub', link: 'https://github.com/cloudapp3/vmflow' },
        { text: s.nav.docsRepo, link: 'https://github.com/cloudapp3/vmdocs' },
        { text: s.nav.contributing, link: '/contributing' },
        { text: s.nav.changelog, link: '/changelog' },
        { text: s.nav.roadmap, link: '/roadmap' },
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
      pattern: 'https://github.com/cloudapp3/vmdocs/edit/main/sites/vmflow/docs/:path',
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
        { text: s.sidebar.configuration, link: `/${l.code}/configuration` },
        { text: s.sidebar.cli, link: `/${l.code}/commands` },
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
  titleTemplate: ':title | vmflow',
  description: siteDescription,

  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  // Per-locale <html lang> + nav/editLink/footer, derived from LANGUAGES.
  locales: Object.fromEntries(
    LANGUAGES.map((l) => [
      l.root ? 'root' : l.code,
      { label: l.label, lang: l.vpLang, themeConfig: localeThemeConfig(l.code) },
    ])
  ),

  sitemap: {
    hostname: siteUrl,
    // Emit hreflang alternates in sitemap.xml so Google sees the same language
    // mappings in <head> and the sitemap. translationsForPath is the authority.
    transformItems: async (items) => {
      return items.map((item) => {
        const group = translationsForPath(normPath(item.url));
        if (group.length) {
          item.links = group.map((g) => ({ url: g.path, lang: g.hreflang }));
        }
        return item;
      });
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#14b8a6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:image', content: `${siteUrl}/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/og-image.png` }],
    ['link', { rel: 'icon', href: '/favicon.svg' }],
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

    // og:locale:alternate — the other language versions of this page.
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
        applicationCategory: 'DeveloperApplication',
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
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Deployment', link: '/guide/deployment' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Forwarding Engine', link: '/guide/forwarding' },
            { text: 'Rules & Lifecycle', link: '/guide/rules' },
            { text: 'Precheck', link: '/guide/precheck' },
          ],
        },
        {
          text: 'Interfaces',
          items: [
            { text: 'TUI Dashboard', link: '/guide/tui' },
            { text: 'Telegram Bot', link: '/guide/telegram-bot' },
          ],
        },
      ],
      '/commands/': [
        {
          text: 'Commands',
          items: [
            { text: 'Command Reference', link: '/commands/' },
            { text: 'daemon', link: '/commands/daemon' },
            { text: 'ctl', link: '/commands/ctl' },
            { text: 'tui', link: '/commands/tui' },
            { text: 'version', link: '/commands/version' },
            { text: 'update', link: '/commands/update' },
            { text: 'service', link: '/commands/service' },
            { text: 'uninstall', link: '/commands/uninstall' },
          ],
        },
      ],
      '/library/': [
        {
          text: 'Go Library',
          items: [
            { text: 'Embedding vmflow', link: '/library/' },
            { text: 'Runtime API', link: '/library/runtime' },
          ],
        },
      ],
      // Per-language sidebars (zh/ja/ru/…) generated from LANGUAGES + LOCALE_UI.
      ...localizedSidebars(),
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/cloudapp3/vmflow' }],
  },
});
