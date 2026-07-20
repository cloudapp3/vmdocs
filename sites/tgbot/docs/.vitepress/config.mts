import { defineConfig } from 'vitepress';
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import {
  LANGUAGES,
  ROOT_LANG,
  TRANSLATED_LANGS,
  detectLocale,
  localeMeta,
} from './languages';

const siteTitle = 'tgbot';
const siteDescription =
  'A lightweight, strongly typed Telegram Bot API SDK for Go with zero third-party runtime dependencies.';
const siteUrl = 'https://tgbot.bestcheapvps.org';
const repositoryUrl = 'https://github.com/cloudapp3/tgbot';
const organizationUrl = 'https://github.com/cloudapp3';
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const softwareId = `${siteUrl}/#software`;
const homePageId = `${siteUrl}/#webpage`;

const translations: Record<string, Partial<Record<string, string>>> = {
  '': { zh: 'zh/' },
  'guide/quick-start': { zh: 'zh/guide/quick-start' },
  'sdk/client': { zh: 'zh/sdk/client' },
  'sdk/methods-and-types': { zh: 'zh/sdk/methods-and-types' },
  'sdk/file-uploads': { zh: 'zh/sdk/file-uploads' },
  'updates/long-polling': { zh: 'zh/updates/long-polling' },
  'updates/webhook': { zh: 'zh/updates/webhook' },
  'ext/': { zh: 'zh/ext/' },
  'ext/handlers-and-filters': { zh: 'zh/ext/handlers-and-filters' },
  'examples/': { zh: 'zh/examples/' },
  'reference/errors': { zh: 'zh/reference/errors' },
  'reference/api-coverage': { zh: 'zh/reference/api-coverage' },
  'migration/v0.2': { zh: 'zh/migration/v0.2' },
  contributing: { zh: 'zh/contributing' },
};

const normalizePath = (path: string) => path.replace(/^\/+|\/+$/g, '');
const absoluteUrl = (path: string) => `${siteUrl}/${path}`;

type TranslationVersion = {
  locale: string;
  hreflang: string;
  og: string;
  href: string;
  path: string;
};

function translationsForPath(path: string): TranslationVersion[] {
  const normalized = normalizePath(path);
  let englishPath: string | undefined;

  for (const [candidate, localized] of Object.entries(translations)) {
    const matchesEnglish = normalizePath(candidate) === normalized;
    const matchesTranslation = Object.values(localized).some(
      (value) => normalizePath(value ?? '') === normalized
    );
    if (matchesEnglish || matchesTranslation) {
      englishPath = candidate;
      break;
    }
  }

  if (englishPath === undefined) return [];

  const localized = translations[englishPath];
  const versions: TranslationVersion[] = [];
  const add = (code: string, pathValue: string | undefined) => {
    if (pathValue === undefined) return;
    versions.push({
      locale: code,
      hreflang: localeMeta[code].hreflang,
      og: localeMeta[code].og,
      href: absoluteUrl(pathValue),
      path: pathValue,
    });
  };

  add(ROOT_LANG.code, englishPath);
  for (const language of TRANSLATED_LANGS) {
    add(language.code, localized[language.code]);
  }
  return versions;
}

function alternateLinks(path: string): any[] {
  const versions = translationsForPath(path);
  if (!versions.length) return [];
  const english = versions.find((version) => version.locale === ROOT_LANG.code);
  return [
    ...versions.map((version) => [
      'link',
      { rel: 'alternate', hreflang: version.hreflang, href: version.href },
    ]),
    ...(english
      ? [['link', { rel: 'alternate', hreflang: 'x-default', href: english.href }]]
      : []),
  ];
}

const localeUi = {
  en: {
    nav: {
      guide: 'Guide',
      sdk: 'SDK',
      updates: 'Receive updates',
      ext: 'ext',
      reference: 'Resources',
      examples: 'Examples',
      errors: 'Errors',
      coverage: 'API coverage',
      migration: 'v0.2 migration',
      contributing: 'Contributing',
      docsRepo: 'Docs repository',
    },
    links: {
      guide: '/guide/quick-start',
      sdk: '/sdk/client',
      updates: '/updates/long-polling',
      ext: '/ext/',
      examples: '/examples/',
      errors: '/reference/errors',
      coverage: '/reference/api-coverage',
      migration: '/migration/v0.2',
      contributing: '/contributing',
    },
    editLink: 'Edit this page on GitHub',
    footer: 'Released under the MIT License.',
    homeTitle: 'tgbot: strongly typed Telegram bots in Go',
  },
  zh: {
    nav: {
      guide: '入门',
      sdk: 'SDK',
      updates: '更新接收',
      ext: 'ext',
      reference: '参考',
      examples: '示例',
      errors: '错误处理',
      coverage: 'API 覆盖',
      migration: 'v0.2 迁移',
      contributing: '参与贡献',
      docsRepo: '文档仓库',
    },
    links: {
      guide: '/zh/guide/quick-start',
      sdk: '/zh/sdk/client',
      updates: '/zh/updates/long-polling',
      ext: '/zh/ext/',
      examples: '/zh/examples/',
      errors: '/zh/reference/errors',
      coverage: '/zh/reference/api-coverage',
      migration: '/zh/migration/v0.2',
      contributing: '/zh/contributing',
    },
    editLink: '在 GitHub 上编辑此页',
    footer: '基于 MIT 协议发布。',
    homeTitle: 'tgbot：用 Go 构建强类型 Telegram Bot',
  },
} as const;

const seoUi = {
  en: {
    home: 'Home',
    imageAlt: 'tgbot strongly typed Telegram Bot API SDK documentation for Go',
    sections: {
      guide: { name: 'Guide', path: 'guide/quick-start' },
      sdk: { name: 'SDK', path: 'sdk/client' },
      updates: { name: 'Receive updates', path: 'updates/long-polling' },
      ext: { name: 'ext routing', path: 'ext/' },
      examples: { name: 'Examples', path: 'examples/' },
      reference: { name: 'Resources', path: 'reference/errors' },
      migration: { name: 'Migration', path: 'migration/v0.2' },
    },
  },
  zh: {
    home: '首页',
    imageAlt: 'tgbot Go 强类型 Telegram Bot API SDK 中文文档',
    sections: {
      guide: { name: '入门', path: 'guide/quick-start' },
      sdk: { name: 'SDK', path: 'sdk/client' },
      updates: { name: '更新接收', path: 'updates/long-polling' },
      ext: { name: 'ext 路由', path: 'ext/' },
      examples: { name: '示例', path: 'examples/' },
      reference: { name: '参考', path: 'reference/errors' },
      migration: { name: '迁移', path: 'migration/v0.2' },
    },
  },
} as const;

function seoForLocale(code: string) {
  return seoUi[code as keyof typeof seoUi] ?? seoUi.en;
}

function withoutLocalePrefix(path: string, locale: string): string {
  if (locale !== 'zh') return path;
  return path.replace(/^zh\/?/, '');
}

function localizedPath(path: string, locale: string): string {
  return locale === 'zh' ? `zh/${path}` : path;
}

function cleanPageTitle(title: string): string {
  return title.replace(/\s+\|\s+tgbot$/, '');
}

function gitLastUpdatedIso(value: unknown): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function breadcrumbData(path: string, pageTitle: string, locale: string) {
  const seo = seoForLocale(locale);
  const localHomePath = locale === 'zh' ? 'zh/' : '';
  const logicalPath = withoutLocalePrefix(path, locale);
  const sectionKey = normalizePath(logicalPath).split('/')[0];
  const section = seo.sections[sectionKey as keyof typeof seo.sections];
  const items: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: seo.home,
      item: absoluteUrl(localHomePath),
    },
  ];

  if (section && normalizePath(section.path) !== normalizePath(logicalPath)) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: section.name,
      item: absoluteUrl(localizedPath(section.path, locale)),
    });
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: pageTitle,
    item: absoluteUrl(path),
  });

  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(path)}#breadcrumb`,
    inLanguage: localeMeta[locale].hreflang,
    itemListElement: items,
  };
}

type StructuredDataOptions = {
  url: string;
  path: string;
  locale: string;
  isHome: boolean;
  pageTitle: string;
  pageDescription: string;
  imageUrl: string;
  imageAlt: string;
  lastUpdated?: string;
};

function structuredData(options: StructuredDataOptions) {
  const {
    url,
    path,
    locale,
    isHome,
    pageTitle,
    pageDescription,
    imageUrl,
    imageAlt,
    lastUpdated,
  } = options;
  const inLanguage = localeMeta[locale].hreflang;
  const pageId = `${url}#webpage`;
  const imageId = `${imageUrl}#primaryimage`;
  const articleId = `${url}#article`;
  const breadcrumb = isHome
    ? undefined
    : breadcrumbData(path, pageTitle, locale);

  const organization = {
    '@type': 'Organization',
    '@id': organizationId,
    name: 'cloudapp3',
    url: organizationUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.svg`,
    },
    sameAs: [organizationUrl],
  };
  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${siteUrl}/`,
    name: siteTitle,
    description: siteDescription,
    inLanguage: LANGUAGES.map((language) => language.hreflang),
    publisher: { '@id': organizationId },
    about: { '@id': softwareId },
    mainEntity: { '@id': softwareId },
  };
  const software = {
    '@type': 'SoftwareSourceCode',
    '@id': softwareId,
    name: siteTitle,
    description: siteDescription,
    url: repositoryUrl,
    codeRepository: repositoryUrl,
    inLanguage: LANGUAGES.map((language) => language.hreflang),
    image: { '@id': imageId, url: imageUrl },
    programmingLanguage: {
      '@type': 'ComputerLanguage',
      name: 'Go',
    },
    runtimePlatform: 'Go 1.22 or newer',
    license: `${repositoryUrl}/blob/master/LICENSE`,
    creator: { '@id': organizationId },
    mainEntityOfPage: { '@id': homePageId },
    isAccessibleForFree: true,
  };
  const image = {
    '@type': 'ImageObject',
    '@id': imageId,
    url: imageUrl,
    contentUrl: imageUrl,
    width: 1200,
    height: 630,
    caption: imageAlt,
    inLanguage,
  };
  const webPage = {
    '@type': 'WebPage',
    '@id': pageId,
    url,
    name: pageTitle,
    description: pageDescription,
    inLanguage,
    isPartOf: { '@id': websiteId },
    about: { '@id': softwareId },
    primaryImageOfPage: { '@id': imageId },
    mainEntity: { '@id': isHome ? softwareId : articleId },
    ...(breadcrumb ? { breadcrumb: { '@id': breadcrumb['@id'] } } : {}),
    ...(lastUpdated ? { dateModified: lastUpdated } : {}),
  };

  const graph: any[] = [organization, website, software, image, webPage];
  if (!isHome && breadcrumb) {
    graph.push(
      {
        '@type': 'TechArticle',
        '@id': articleId,
        headline: pageTitle,
        description: pageDescription,
        url,
        inLanguage,
        mainEntityOfPage: { '@id': pageId, url },
        isPartOf: { '@id': websiteId },
        about: { '@id': softwareId },
        image: { '@id': imageId, url: imageUrl },
        author: { '@id': organizationId },
        publisher: { '@id': organizationId },
        ...(lastUpdated ? { dateModified: lastUpdated } : {}),
      },
      breadcrumb
    );
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function navFor(code: string) {
  const ui = localeUi[code as keyof typeof localeUi] ?? localeUi.en;
  return [
    { text: ui.nav.guide, link: ui.links.guide },
    { text: ui.nav.sdk, link: ui.links.sdk },
    { text: ui.nav.updates, link: ui.links.updates },
    { text: ui.nav.ext, link: ui.links.ext },
    {
      text: ui.nav.reference,
      items: [
        { text: ui.nav.examples, link: ui.links.examples },
        { text: ui.nav.errors, link: ui.links.errors },
        { text: ui.nav.coverage, link: ui.links.coverage },
        { text: ui.nav.migration, link: ui.links.migration },
        { text: 'pkg.go.dev', link: 'https://pkg.go.dev/github.com/cloudapp3/tgbot' },
        { text: ui.nav.contributing, link: ui.links.contributing },
        { text: ui.nav.docsRepo, link: 'https://github.com/cloudapp3/vmdocs' },
      ],
    },
  ];
}

function localeThemeConfig(code: string) {
  const ui = localeUi[code as keyof typeof localeUi] ?? localeUi.en;
  return {
    nav: navFor(code),
    editLink: {
      pattern: 'https://github.com/cloudapp3/vmdocs/edit/main/sites/tgbot/docs/:path',
      text: ui.editLink,
    },
    footer: {
      message: ui.footer,
      copyright: 'Copyright © 2026 cloudapp3',
    },
  };
}

const englishSidebar = {
  '/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Home', link: '/' },
        { text: 'Quick start', link: '/guide/quick-start' },
      ],
    },
    {
      text: 'SDK',
      items: [
        { text: 'Client', link: '/sdk/client' },
        { text: 'Methods and types', link: '/sdk/methods-and-types' },
        { text: 'File uploads', link: '/sdk/file-uploads' },
      ],
    },
    {
      text: 'Receive updates',
      items: [
        { text: 'Long polling', link: '/updates/long-polling' },
        { text: 'Webhooks', link: '/updates/webhook' },
      ],
    },
    {
      text: 'ext routing',
      items: [
        { text: 'Application', link: '/ext/' },
        { text: 'Handlers and filters', link: '/ext/handlers-and-filters' },
      ],
    },
    {
      text: 'Resources',
      items: [
        { text: 'Examples', link: '/examples/' },
        { text: 'Errors and rate limits', link: '/reference/errors' },
        { text: 'API coverage', link: '/reference/api-coverage' },
        { text: 'v0.2 migration', link: '/migration/v0.2' },
        { text: 'Contributing', link: '/contributing' },
      ],
    },
  ],
};

const chineseSidebar = {
  '/zh/': [
    {
      text: '入门',
      items: [
        { text: '中文首页', link: '/zh/' },
        { text: '快速开始', link: '/zh/guide/quick-start' },
      ],
    },
    {
      text: 'SDK',
      items: [
        { text: '客户端', link: '/zh/sdk/client' },
        { text: '方法与类型', link: '/zh/sdk/methods-and-types' },
        { text: '文件上传', link: '/zh/sdk/file-uploads' },
      ],
    },
    {
      text: '接收更新',
      items: [
        { text: '长轮询', link: '/zh/updates/long-polling' },
        { text: 'Webhook', link: '/zh/updates/webhook' },
      ],
    },
    {
      text: 'ext 路由',
      items: [
        { text: 'Application', link: '/zh/ext/' },
        { text: 'Handler 与 Filter', link: '/zh/ext/handlers-and-filters' },
      ],
    },
    {
      text: '参考',
      items: [
        { text: '示例', link: '/zh/examples/' },
        { text: '错误与限流', link: '/zh/reference/errors' },
        { text: 'API 覆盖', link: '/zh/reference/api-coverage' },
        { text: 'v0.2 迁移', link: '/zh/migration/v0.2' },
        { text: '参与贡献', link: '/zh/contributing' },
      ],
    },
  ],
};

const teekConfig = defineTeekConfig({
  teekTheme: true,
  teekHome: false,
  vpHome: true,
  vitePlugins: {
    mdH1: true,
    autoFrontmatter: false,
    sidebarOption: {
      ignoreList: ['public'],
      scannerRootMd: false,
    },
  },
});

export default defineConfig({
  extends: teekConfig,
  lang: 'en-US',
  title: siteTitle,
  titleTemplate: ':title | tgbot',
  description: siteDescription,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  locales: Object.fromEntries(
    LANGUAGES.map((language) => [
      language.root ? 'root' : language.code,
      {
        label: language.label,
        lang: language.vpLang,
        themeConfig: localeThemeConfig(language.code),
      },
    ])
  ),

  sitemap: {
    hostname: siteUrl,
    transformItems: async (items) =>
      items.map((item) => {
        const versions = translationsForPath(normalizePath(item.url));
        if (versions.length) {
          const links = versions.map((version) => ({
            url: version.path,
            lang: version.hreflang,
          }));
          const english = versions.find(
            (version) => version.locale === ROOT_LANG.code
          );
          if (english) {
            links.push({ url: english.path, lang: 'x-default' });
          }
          item.links = links;
        }
        return item;
      }),
  },

  head: [
    ['meta', { name: 'theme-color', content: '#087ea4' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],

  transformHead: async (context) => {
    if (context.page === '404.md') {
      return [['meta', { name: 'robots', content: 'noindex, nofollow' }]];
    }

    const path = context.page
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '');
    const url = absoluteUrl(path);
    const locale = detectLocale(path);
    const isHome =
      context.page === 'index.md' ||
      TRANSLATED_LANGS.some(
        (language) => context.page === `${language.code}/index.md`
      );
    const homeTitle =
      (localeUi[locale as keyof typeof localeUi] ?? localeUi.en).homeTitle;
    const pageTitle = cleanPageTitle(context.title || homeTitle);
    const pageDescription = context.description || siteDescription;
    const imageUrl = `${siteUrl}/${locale === 'zh' ? 'og-image-zh.png' : 'og-image.png'}`;
    const imageAlt = seoForLocale(locale).imageAlt;
    const lastUpdated = gitLastUpdatedIso(context.pageData.lastUpdated);

    const head: any[] = [
      ['meta', { name: 'robots', content: 'index, follow' }],
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:locale', content: localeMeta[locale].og }],
      ['meta', { property: 'og:image', content: imageUrl }],
      ['meta', { property: 'og:image:alt', content: imageAlt }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:type', content: 'image/png' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['meta', { name: 'twitter:image', content: imageUrl }],
      ['meta', { name: 'twitter:image:alt', content: imageAlt }],
      ...alternateLinks(path),
    ];

    if (!isHome && lastUpdated) {
      head.push([
        'meta',
        { property: 'article:modified_time', content: lastUpdated },
      ]);
    }

    for (const version of translationsForPath(path)) {
      if (version.locale !== locale) {
        head.push([
          'meta',
          { property: 'og:locale:alternate', content: version.og },
        ]);
      }
    }

    head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(
        structuredData({
          url,
          path,
          locale,
          isHome,
          pageTitle,
          pageDescription,
          imageUrl,
          imageAlt,
          lastUpdated,
        })
      ),
    ]);

    return head;
  },

  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    sidebar: {
      ...englishSidebar,
      ...chineseSidebar,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cloudapp3/tgbot' },
    ],
  },
});
