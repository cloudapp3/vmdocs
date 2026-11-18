import { defineConfig } from 'vitepress';
import { defineTeekConfig } from 'vitepress-theme-teek/config';

const siteTitle = 'vmlg';
const siteDescription =
  'Modern single-binary multi-node Network & BGP Looking Glass portal in Go — real-time MTR, zero-disk speedtest, ephemeral iPerf3, BIRD2/FRR/GoBGP SVG AS-Path graphs, Docker & MCP.';

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
  titleTemplate: ':title | vmlg Looking Glass',
  description: siteDescription,

  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  sitemap: {
    hostname: 'https://vmlg.bestcheapvps.org',
  },

  head: [
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'vmlg — Network & BGP Looking Glass Documentation' }],
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
      { text: 'Docker & Cluster', link: '/guide/docker-cluster' },
      { text: 'BGP & MCP', link: '/guide/bgp-mcp' },
      { text: 'API', link: '/api' },
      { text: '中文', link: '/zh/' },
      {
        text: 'Community',
        items: [
          { text: 'GitHub', link: 'https://github.com/cloudapp3/vmlg' },
          { text: 'Telegram', link: 'https://t.me/VMPulse' },
          { text: 'Docs Repo', link: 'https://github.com/cloudapp3/vmdocs' },
          { text: 'Changelog', link: '/changelog' },
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
            { text: 'Docker & Multi-Node Cluster', link: '/guide/docker-cluster' },
            { text: 'BGP Drivers & MCP Server', link: '/guide/bgp-mcp' },
          ],
        },
      ],
      '/zh/': [
        {
          text: '中文指南',
          items: [
            { text: '中文首页', link: '/zh/' },
            { text: '快速开始与集群部署', link: '/zh/quick-start' },
            { text: 'BGP 拓扑与 MCP 排障', link: '/zh/bgp-mcp' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/cloudapp3/vmlg' }],
    editLink: {
      pattern: 'https://github.com/cloudapp3/vmdocs/edit/main/sites/vmlg/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 cloudapp3',
    },
  },
});
