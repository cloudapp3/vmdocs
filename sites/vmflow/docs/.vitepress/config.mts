import { defineConfig } from 'vitepress';
import { defineTeekConfig } from 'vitepress-theme-teek/config';

const siteTitle = 'vmflow';
const siteDescription =
  'A small pure-Go L4 forwarding runtime. Run it as a standalone daemon or embed it into your own control plane — TCP/UDP forwarding, rule lifecycle, precheck, metrics, and a terminal UI.';

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

  sitemap: {
    hostname: 'https://vmflow.bestcheapvps.org',
  },

  head: [
    ['meta', { name: 'theme-color', content: '#14b8a6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    // TODO: replace with a 1200x630 og-image.png once designed.
    ['meta', { property: 'og:image', content: 'https://vmflow.bestcheapvps.org/logo.svg' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://vmflow.bestcheapvps.org/logo.svg' }],
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],

  // Per-page canonical URL + Open Graph tags (SEO)
  transformHead: async (context) => {
    const path = context.page
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '');
    const url = `https://vmflow.bestcheapvps.org/${path}`;
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: context.page === 'index.md' ? siteTitle : (context.title || siteTitle) }],
      ['meta', { property: 'og:description', content: context.description || siteDescription }],
    ];
  },

  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'CLI', link: '/commands/' },
      { text: 'HTTP API', link: '/api' },
      { text: 'Go Library', link: '/library/' },
      { text: '中文', link: '/zh/' },
      {
        text: 'Community',
        items: [
          { text: 'GitHub', link: 'https://github.com/cloudapp3/vmflow' },
          { text: 'Docs Repo', link: 'https://github.com/cloudapp3/vmdocs' },
          { text: 'Contributing', link: '/contributing' },
          { text: 'Changelog', link: '/changelog' },
          { text: 'Roadmap', link: '/roadmap' },
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
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/cloudapp3/vmflow' }],
    editLink: {
      pattern: 'https://github.com/cloudapp3/vmdocs/edit/main/sites/vmflow/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 cloudapp3',
    },
  },
});
