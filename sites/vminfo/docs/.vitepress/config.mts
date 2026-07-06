import { defineConfig } from 'vitepress';
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import { adsClient } from './theme/ads-config';

const siteTitle = 'vminfo';
const siteDescription =
  'Cross-platform host runtime information toolkit with terminal UI, JSON output, web dashboard, and embeddable Go APIs.';

const siteUrl = 'https://vminfo.bestcheapvps.org';

// English path -> translated paths (only pages actually translated).
// Add a row whenever a page is localized into another language.
const translations: Record<string, { zh?: string; ja?: string }> = {
  '': { zh: 'zh/', ja: 'ja/' },
  'guide/quick-start': { zh: 'zh/quick-start', ja: 'ja/quick-start' },
  'commands/': { zh: 'zh/commands', ja: 'ja/commands' },
};

// Per-locale metadata for hreflang + og:locale.
const localeMeta = {
  en: { hreflang: 'en-US', og: 'en_US' },
  zh: { hreflang: 'zh-CN', og: 'zh_CN' },
  ja: { hreflang: 'ja-JP', og: 'ja_JP' },
} as const;
type Locale = keyof typeof localeMeta;

function detectLocale(path: string): Locale {
  if (path.startsWith('zh/') || path === 'zh') return 'zh';
  if (path.startsWith('ja/') || path === 'ja') return 'ja';
  return 'en';
}

// hreflang alternates: emits a <link> for every available translation of the
// current page (plus x-default). Pages with no translation emit nothing.
function alternateLinks(path: string): any[] {
  let enPath: string | undefined;
  if (translations[path]) {
    enPath = path;
  } else {
    for (const [en, t] of Object.entries(translations)) {
      if (t.zh === path || t.ja === path) { enPath = en; break; }
    }
  }
  if (enPath === undefined) return [];

  const group: { lang: string; p: string }[] = [{ lang: localeMeta.en.hreflang, p: enPath }];
  const t = translations[enPath];
  if (t.zh) group.push({ lang: localeMeta.zh.hreflang, p: t.zh });
  if (t.ja) group.push({ lang: localeMeta.ja.hreflang, p: t.ja });

  return [
    ...group.map((g) => ['link', { rel: 'alternate', hreflang: g.lang, href: `${siteUrl}/${g.p}` }]),
    ['link', { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/${enPath}` }],
  ];
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

  // Per-locale <html lang>. Routes under /zh/ render zh-CN, /ja/ render ja-JP.
  locales: {
    root: { label: 'English', lang: 'en-US' },
    zh: { label: '中文', lang: 'zh-CN' },
    ja: { label: '日本語', lang: 'ja-JP' },
  },

  sitemap: {
    hostname: siteUrl,
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
    const isHome = context.page === 'index.md' || context.page === 'zh/index.md' || context.page === 'ja/index.md';
    const homeOgTitle =
      loc === 'zh' ? 'vminfo — 跨平台终端系统监控、Web 仪表盘与 Go 库'
        : loc === 'ja' ? 'vminfo — クロスプラットフォームのシステムモニター・Web ダッシュボード・Go ライブラリ'
        : 'vminfo — terminal system monitor, web dashboard & Go library';

    const head: any[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: isHome ? homeOgTitle : (context.title || homeOgTitle) }],
      ['meta', { property: 'og:description', content: context.description || siteDescription }],
      ['meta', { property: 'og:locale', content: localeMeta[loc].og }],
    ];

    // hreflang alternates for every available translation of this page.
    head.push(...alternateLinks(path));

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
    nav: [
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'Commands', link: '/commands/' },
      { text: 'HTTP API', link: '/api' },
      { text: 'Go Library', link: '/library/' },
      { text: '中文', link: '/zh/' },
      { text: '日本語', link: '/ja/' },
      {
        text: 'Community',
        items: [
          { text: 'GitHub', link: 'https://github.com/cloudapp3/vminfo' },
          { text: 'Docs Repo', link: 'https://github.com/cloudapp3/vmdocs' },
          { text: 'Contributing', link: '/contributing' },
          { text: 'Changelog', link: '/changelog' },
          { text: 'Roadmap', link: '/roadmap/feature-benchmark' },
          { text: 'Privacy Policy', link: '/privacy' },
        ],
      },
    ],
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
      '/zh/': [
        {
          text: '中文文档',
          items: [
            { text: '中文首页', link: '/zh/' },
            { text: '快速开始', link: '/zh/quick-start' },
            { text: '命令参考', link: '/zh/commands' },
          ],
        },
      ],
      '/ja/': [
        {
          text: '日本語ドキュメント',
          items: [
            { text: '日本語トップ', link: '/ja/' },
            { text: 'クイックスタート', link: '/ja/quick-start' },
            { text: 'コマンドリファレンス', link: '/ja/commands' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/cloudapp3/vminfo' }],
    editLink: {
      pattern: 'https://github.com/cloudapp3/vmdocs/edit/main/sites/vminfo/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 cloudapp3',
    },
  },
});
