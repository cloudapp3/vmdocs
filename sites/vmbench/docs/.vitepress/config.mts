import { defineConfig } from 'vitepress';
import { defineTeekConfig } from 'vitepress-theme-teek/config';

const siteTitle = 'vmbench';
const siteDescription =
  'Cross-platform VPS benchmark suite with raw metrics, structured reports, TUI, and GitHub Releases.';

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
  titleTemplate: ':title | vmbench',
  description: siteDescription,

  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  sitemap: {
    hostname: 'https://vmbench.bestcheapvps.org',
  },

  head: [
    ['meta', { name: 'theme-color', content: '#f97316' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'vmbench Documentation' }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'Commands', link: '/commands/' },
      { text: 'Reports', link: '/reports' },
      { text: '中文', link: '/zh/' },
      {
        text: 'Community',
        items: [
          { text: 'GitHub', link: 'https://github.com/cloudapp3/vmbench' },
          { text: 'Docs Repo', link: 'https://github.com/cloudapp3/vmdocs' },
          { text: 'Contributing', link: '/contributing' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Overview', link: '/guide/overview' },
            { text: 'Platform Support', link: '/guide/platform-support' },
          ],
        },
      ],
      '/commands/': [
        {
          text: 'Commands',
          items: [{ text: 'Command Reference', link: '/commands/' }],
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/cloudapp3/vmbench' }],
    editLink: {
      pattern: 'https://github.com/cloudapp3/vmdocs/edit/main/sites/vmbench/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 cloudapp3',
    },
  },
});
