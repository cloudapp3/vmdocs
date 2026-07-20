// Strict post-build SEO validator for the tgbot documentation site.
//
// The generated HTML is the public contract. This check validates page-level
// metadata, complete translation groups, sitemap/robots agreement, social
// images, and structured data without adding runtime or build dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const EXPECTED_SITE = 'https://tgbot.bestcheapvps.org';
const SITE_NAME = 'tgbot';
const TITLE_SUFFIX = /\s*\|\s*tgbot\s*$/i;
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const SOURCE_REPOSITORY = 'https://github.com/cloudapp3/tgbot';

const REGISTERED_LOCALES = new Map([
  ['en-US', { og: 'en_US', prefix: '' }],
  ['zh-CN', { og: 'zh_CN', prefix: 'zh' }],
]);

const REQUIRED_OG_FIELDS = [
  'og:type',
  'og:site_name',
  'og:locale',
  'og:url',
  'og:title',
  'og:description',
  'og:image',
  'og:image:alt',
  'og:image:width',
  'og:image:height',
  'og:image:type',
];

const REQUIRED_TWITTER_FIELDS = [
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
  'twitter:image:alt',
];

const errors = [];
const err = (where, message) => errors.push(`${where}\n    -> ${message}`);

// --- HTML helpers --------------------------------------------------------

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function getAttr(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*"([^"]*)"`, 'i'));
  return match ? match[1] : null;
}

function extractHead(html) {
  return html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
}

function extractTagValues(html, tagName) {
  const values = [];
  const expression = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  for (const match of html.matchAll(expression)) values.push(match[1]);
  return values;
}

function extractMetaValues(head, attribute, key) {
  const values = [];
  for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
    if (getAttr(match[0], attribute)?.toLowerCase() !== key.toLowerCase()) continue;
    const content = getAttr(match[0], 'content');
    if (content !== null) values.push(content);
  }
  return values;
}

function extractLinkValues(head, rel) {
  const values = [];
  for (const match of head.matchAll(/<link\b[^>]*>/gi)) {
    const rels = (getAttr(match[0], 'rel') ?? '').toLowerCase().split(/\s+/);
    if (!rels.includes(rel.toLowerCase())) continue;
    const href = getAttr(match[0], 'href');
    if (href) values.push(href);
  }
  return values;
}

function extractCanonical(head) {
  return extractLinkValues(head, 'canonical')[0] ?? null;
}

function extractHreflangs(head) {
  const map = new Map();
  const xDefaults = [];
  const duplicates = [];
  for (const match of head.matchAll(/<link\b[^>]*>/gi)) {
    const rels = (getAttr(match[0], 'rel') ?? '').toLowerCase().split(/\s+/);
    if (!rels.includes('alternate')) continue;
    const language = getAttr(match[0], 'hreflang');
    const href = getAttr(match[0], 'href');
    if (!language || !href) continue;
    if (language === 'x-default') {
      xDefaults.push(href);
      continue;
    }
    if (map.has(language)) duplicates.push(language);
    map.set(language, href);
  }
  return { map, xDefaults, duplicates };
}

function extractHtmlLang(html) {
  const tag = html.match(/<html\b[^>]*>/i)?.[0];
  return tag ? getAttr(tag, 'lang') : null;
}

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function cleanText(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function uniquenessKey(value) {
  return cleanText(value).toLocaleLowerCase('en-US');
}

function parseRobots(value) {
  return new Set(value.toLowerCase().split(/[\s,]+/).filter(Boolean));
}

function extractJsonLd(head, where) {
  const documents = [];
  for (const match of head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      documents.push(JSON.parse(match[1]));
    } catch (error) {
      err(where, `JSON-LD is not valid JSON: ${error.message}`);
    }
  }

  const nodes = [];
  const append = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) append(item);
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value['@graph'])) {
      for (const item of value['@graph']) append(item);
    }
    if (value['@type']) nodes.push(value);
  };
  for (const document of documents) append(document);
  return { documents, nodes };
}

function hasSchemaType(node, type) {
  const types = Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']];
  return types.includes(type);
}

function schemaUrl(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return null;
  return value.url ?? value.contentUrl ?? value['@id'] ?? null;
}

function resolveSchemaNode(info, value) {
  const id = typeof value === 'string' ? value : value?.['@id'];
  if (!id) return value;
  return info.jsonLd.nodes.find((node) => node['@id'] === id) ?? value;
}

function resolvedSchemaUrl(info, value) {
  return schemaUrl(resolveSchemaNode(info, value));
}

function schemaLanguages(value) {
  if (Array.isArray(value)) return value.flatMap((item) => schemaLanguages(item));
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  const language = value.alternateName ?? value.name ?? value['@id'];
  return typeof language === 'string' ? [language] : [];
}

function isHttpsUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function fileToUrl(absFile, site) {
  const relative = path.relative(DIST, absFile).split(path.sep).join('/');
  if (relative === 'index.html') return `${site}/`;
  if (relative.endsWith('/index.html')) {
    return `${site}/${relative.slice(0, -'/index.html'.length)}/`;
  }
  return `${site}/${relative.slice(0, -'.html'.length)}`;
}

function isLocaleHome(relativeFile) {
  return [...REGISTERED_LOCALES.values()].some(({ prefix }) => {
    return relativeFile === (prefix ? `${prefix}/index.html` : 'index.html');
  });
}

function requiredMeta(info, attribute, fields, label) {
  const result = {};
  const missing = [];
  const duplicates = [];
  for (const field of fields) {
    const values = extractMetaValues(info.head, attribute, field);
    if (values.length === 0 || !values[0].trim()) missing.push(field);
    if (values.length > 1) duplicates.push(field);
    result[field] = values[0] ?? '';
  }
  if (missing.length) err(info.url, `missing or empty ${label} fields: ${missing.join(', ')}`);
  if (duplicates.length) err(info.url, `duplicate ${label} fields: ${duplicates.join(', ')}`);
  return result;
}

function nodeForType(info, type) {
  const nodes = info.jsonLd.nodes.filter((node) => hasSchemaType(node, type));
  if (nodes.length !== 1) {
    err(info.url, `expected exactly one JSON-LD ${type} node, got ${nodes.length}`);
  }
  return nodes[0] ?? null;
}

function validateWebsite(info, node, site) {
  if (!node) return;
  if (schemaUrl(node.url) !== `${site}/`) {
    err(info.url, 'WebSite.url must equal the site root URL');
  }
  if (!schemaLanguages(node.inLanguage).includes(info.language)) {
    err(info.url, `WebSite.inLanguage must include ${info.language || 'the page language'}`);
  }
  if (typeof node.name !== 'string' || !node.name.trim()) {
    err(info.url, 'WebSite.name must be non-empty');
  }
  if (typeof node.description !== 'string' || !node.description.trim()) {
    err(info.url, 'WebSite.description must be non-empty');
  }
}

function validateSoftwareSourceCode(info, node) {
  if (!node) return;
  const repository = schemaUrl(node.codeRepository);
  if (repository !== SOURCE_REPOSITORY) {
    err(info.url, `SoftwareSourceCode.codeRepository must be ${SOURCE_REPOSITORY}`);
  }
  if (node.url !== undefined && !isHttpsUrl(schemaUrl(node.url))) {
    err(info.url, 'SoftwareSourceCode.url must be an HTTPS URL when present');
  }
  if (!schemaLanguages(node.inLanguage).includes(info.language)) {
    err(info.url, `SoftwareSourceCode.inLanguage must include ${info.language || 'the page language'}`);
  }
  const programmingLanguages = schemaLanguages(node.programmingLanguage)
    .map((language) => language.toLowerCase());
  if (!programmingLanguages.includes('go')) {
    err(info.url, 'SoftwareSourceCode.programmingLanguage must include Go');
  }
  const license = schemaUrl(node.license);
  if (!isHttpsUrl(license) || !license.startsWith(`${SOURCE_REPOSITORY}/`) || !/\/LICENSE(?:$|[?#])/.test(license)) {
    err(info.url, 'SoftwareSourceCode.license must be an HTTPS LICENSE URL in the source repository');
  }
  if (node.image !== undefined) validateSchemaImage(info, node.image, 'SoftwareSourceCode.image');
  if (typeof node.name !== 'string' || !node.name.trim()) {
    err(info.url, 'SoftwareSourceCode.name must be non-empty');
  }
  if (typeof node.description !== 'string' || !node.description.trim()) {
    err(info.url, 'SoftwareSourceCode.description must be non-empty');
  }
}

function validateTechArticle(info, node) {
  if (!node) return;
  if (schemaUrl(node.url) !== info.url) {
    err(info.url, 'TechArticle.url must equal the canonical URL');
  }
  if (node.inLanguage !== info.language) {
    err(info.url, `TechArticle.inLanguage must be ${info.language || 'the page language'}`);
  }
  validateSchemaImage(info, node.image, 'TechArticle.image');
  if (typeof node.headline !== 'string' || !node.headline.trim()) {
    err(info.url, 'TechArticle.headline must be non-empty');
  }
  if (typeof node.description !== 'string' || !node.description.trim()) {
    err(info.url, 'TechArticle.description must be non-empty');
  }
}

function validateSchemaImage(info, value, label) {
  const image = resolveSchemaNode(info, value);
  if (schemaUrl(image) !== info.og['og:image']) {
    err(info.url, `${label} must resolve to og:image`);
    return;
  }
  if (image && typeof image === 'object' && hasSchemaType(image, 'ImageObject')) {
    if (image.url !== undefined && schemaUrl(image.url) !== info.og['og:image']) {
      err(info.url, `${label} ImageObject.url must equal og:image`);
    }
    if (image.contentUrl !== undefined && schemaUrl(image.contentUrl) !== info.og['og:image']) {
      err(info.url, `${label} ImageObject.contentUrl must equal og:image`);
    }
    if (image.width !== OG_IMAGE_WIDTH || image.height !== OG_IMAGE_HEIGHT) {
      err(info.url, `${label} ImageObject must be ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT}`);
    }
    if (!schemaLanguages(image.inLanguage).includes(info.language)) {
      err(info.url, `${label} ImageObject.inLanguage must include ${info.language || 'the page language'}`);
    }
    if (image.caption !== info.og['og:image:alt']) {
      err(info.url, `${label} ImageObject.caption must equal og:image:alt`);
    }
  }
}

function validateBreadcrumb(info, node, site) {
  if (!node) return;
  if (!schemaLanguages(node.inLanguage).includes(info.language)) {
    err(info.url, `BreadcrumbList.inLanguage must include ${info.language || 'the page language'}`);
  }
  const items = node.itemListElement;
  if (!Array.isArray(items) || items.length === 0) {
    err(info.url, 'BreadcrumbList.itemListElement must be a non-empty array');
    return;
  }

  let previousPosition = 0;
  for (const item of items) {
    if (!hasSchemaType(item, 'ListItem')) {
      err(info.url, 'every breadcrumb entry must be a ListItem');
      continue;
    }
    if (!Number.isInteger(item.position) || item.position !== previousPosition + 1) {
      err(info.url, 'breadcrumb positions must be consecutive integers starting at 1');
    }
    previousPosition = item.position;
    if (typeof item.name !== 'string' || !item.name.trim()) {
      err(info.url, 'every breadcrumb entry must have a non-empty name');
    }
    const itemUrl = schemaUrl(item.item);
    if (itemUrl) {
      try {
        if (new URL(itemUrl).origin !== site) err(info.url, `breadcrumb URL is off-site: ${itemUrl}`);
      } catch {
        err(info.url, `breadcrumb URL is invalid: ${itemUrl}`);
      }
    }
  }

  const finalUrl = schemaUrl(items.at(-1)?.item);
  if (finalUrl !== info.url) {
    err(info.url, 'the final breadcrumb item must equal the canonical URL');
  }
}

function validateOrganization(info, organization) {
  if (!organization) return;
  if (typeof organization.name !== 'string' || !organization.name.trim()) {
    err(info.url, 'Organization.name must be non-empty');
  }
  const organizationUrl = schemaUrl(organization.url);
  if (!organizationUrl) {
    err(info.url, 'Organization.url is required');
  } else if (!isHttpsUrl(organizationUrl)) {
    err(info.url, 'Organization.url must be an HTTPS URL');
  }
  const organizationImage = schemaUrl(organization.logo ?? organization.image);
  if (!organizationImage) {
    err(info.url, 'Organization must include a logo or image URL');
  } else if (!isHttpsUrl(organizationImage)) {
    err(info.url, 'Organization logo or image must be an HTTPS URL');
  }
}

function validateReference(info, value, expectedNode, label) {
  if (!expectedNode) return;
  const reference = typeof value === 'string' ? value : value?.['@id'];
  if (!reference) {
    err(info.url, `${label} must be an @id reference`);
    return;
  }
  if (!expectedNode['@id'] || reference !== expectedNode['@id']) {
    err(info.url, `${label} points to the wrong graph entity`);
    return;
  }
  if (resolveSchemaNode(info, value) !== expectedNode) {
    err(info.url, `${label} is a dangling graph reference`);
  }
}

function validateWebPage(info, webPage, website, sourceCode, image, mainEntity, breadcrumb) {
  if (!webPage) return;
  if (schemaUrl(webPage.url) !== info.url) err(info.url, 'WebPage.url must equal the canonical URL');
  if (!schemaLanguages(webPage.inLanguage).includes(info.language)) {
    err(info.url, `WebPage.inLanguage must include ${info.language || 'the page language'}`);
  }
  if (webPage.name !== info.og['og:title']) err(info.url, 'WebPage.name must equal og:title');
  if (webPage.description !== info.og['og:description']) {
    err(info.url, 'WebPage.description must equal og:description');
  }
  validateReference(info, webPage.isPartOf, website, 'WebPage.isPartOf');
  validateReference(info, webPage.about, sourceCode, 'WebPage.about');
  validateReference(info, webPage.primaryImageOfPage, image, 'WebPage.primaryImageOfPage');
  validateReference(info, webPage.mainEntity, mainEntity, 'WebPage.mainEntity');
  if (breadcrumb) validateReference(info, webPage.breadcrumb, breadcrumb, 'WebPage.breadcrumb');
}

// --- parse build output --------------------------------------------------

const allFiles = walkHtml(DIST);
const files = allFiles.filter((file) => path.basename(file) !== '404.html');
if (!files.length) {
  console.error(`check-seo: no indexable HTML under ${DIST}; run build first.`);
  process.exit(2);
}

const notFoundPath = path.join(DIST, '404.html');
if (!fs.existsSync(notFoundPath)) {
  err('404.html', 'missing build output');
} else {
  const html = fs.readFileSync(notFoundPath, 'utf8');
  const head = extractHead(html);
  const robots = extractMetaValues(head, 'name', 'robots');
  if (robots.length !== 1) {
    err('404.html', `expected exactly one robots directive, got ${robots.length}`);
  } else {
    const directives = parseRobots(robots[0]);
    if (!directives.has('noindex') || !directives.has('nofollow')) {
      err('404.html', 'robots must be noindex, nofollow');
    }
  }
  if (extractLinkValues(head, 'canonical').length > 0) {
    err('404.html', 'must not declare a canonical URL');
  }
}

const site = EXPECTED_SITE;

const pages = new Map();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const head = extractHead(html);
  const canonical = extractCanonical(head);
  const url = canonical || fileToUrl(file, site);
  const relativeFile = path.relative(DIST, file).split(path.sep).join('/');
  const alternates = extractHreflangs(head);
  const titles = extractTagValues(head, 'title');
  const descriptions = extractMetaValues(head, 'name', 'description');
  const canonicalLinks = extractLinkValues(head, 'canonical');

  if (pages.has(url)) err(url, `duplicate canonical (also produced by ${pages.get(url).file})`);
  pages.set(url, {
    file,
    relativeFile,
    html,
    head,
    url,
    canonical,
    canonicalLinks,
    expectedUrl: fileToUrl(file, site),
    isHome: isLocaleHome(relativeFile),
    hreflangs: alternates.map,
    xDefaults: alternates.xDefaults,
    duplicateHreflangs: alternates.duplicates,
    htmlLang: extractHtmlLang(html),
    ogLocale: extractMetaValues(head, 'property', 'og:locale')[0] ?? null,
    ogAlts: extractMetaValues(head, 'property', 'og:locale:alternate'),
    titles,
    descriptions,
    robots: extractMetaValues(head, 'name', 'robots'),
    h1Count: (html.match(/<h1\b/gi) ?? []).length,
    jsonLd: extractJsonLd(head, url),
    language: null,
    og: {},
    twitter: {},
  });
}

// --- canonical and complete language groups ----------------------------

for (const [url, info] of pages) {
  if (info.canonicalLinks.length !== 1) {
    err(url, `expected exactly one canonical URL, got ${info.canonicalLinks.length}`);
  }
  if (!info.canonical) {
    err(url, 'missing canonical URL');
  } else if (info.canonical !== info.expectedUrl) {
    err(url, `canonical does not self-reference: got ${info.canonical}, expected ${info.expectedUrl}`);
  }
  for (const language of info.duplicateHreflangs) {
    err(url, `duplicate hreflang declaration for "${language}"`);
  }

  const declared = new Set(info.hreflangs.keys());
  const missing = [...REGISTERED_LOCALES.keys()].filter((language) => !declared.has(language));
  const unregistered = [...declared].filter((language) => !REGISTERED_LOCALES.has(language));
  if (missing.length || unregistered.length) {
    err(url, `translation group is not the registered complete set (missing: ${missing.join(', ') || 'none'}; unregistered: ${unregistered.join(', ') || 'none'})`);
  }

  if (info.xDefaults.length !== 1) {
    err(url, `expected exactly one x-default, got ${info.xDefaults.length}`);
  } else if (info.xDefaults[0] !== info.hreflangs.get('en-US')) {
    err(url, `x-default must point to the English version (${info.hreflangs.get('en-US')})`);
  }

  const ownLanguages = [...info.hreflangs.entries()]
    .filter(([, href]) => href === url)
    .map(([language]) => language);
  if (ownLanguages.length !== 1) {
    err(url, `translation group must contain exactly one self-reference, got ${ownLanguages.length}`);
  } else {
    info.language = ownLanguages[0];
    if (info.htmlLang !== info.language) {
      err(url, `<html lang> is ${info.htmlLang || 'missing'}, expected ${info.language}`);
    }
    const locale = REGISTERED_LOCALES.get(info.language);
    if (locale) {
      let pathname = '';
      try {
        pathname = new URL(url).pathname;
      } catch {
        err(url, 'canonical URL is invalid');
      }
      const expectedPrefix = locale.prefix ? `/${locale.prefix}/` : null;
      if (expectedPrefix && !pathname.startsWith(expectedPrefix)) {
        err(url, `${info.language} page must live under ${expectedPrefix}`);
      }
      if (!expectedPrefix) {
        for (const { prefix } of REGISTERED_LOCALES.values()) {
          if (prefix && pathname.startsWith(`/${prefix}/`)) {
            err(url, `${info.language} page must not live under /${prefix}/`);
          }
        }
      }
    }
  }

  const signature = JSON.stringify([...info.hreflangs.entries()].sort());
  for (const [language, targetUrl] of info.hreflangs) {
    const target = pages.get(targetUrl);
    if (!target) {
      err(url, `hreflang "${language}" target is not a built indexable page: ${targetUrl}`);
      continue;
    }
    if (![...target.hreflangs.values()].includes(url)) {
      err(url, `hreflang target does not declare this page back: ${targetUrl}`);
    }
    const targetSignature = JSON.stringify([...target.hreflangs.entries()].sort());
    if (targetSignature !== signature) {
      err(url, `hreflang group differs from target ${targetUrl}`);
    }
  }
}

// --- page metadata and social cards ------------------------------------

const seenTitles = new Map();
const seenDescriptions = new Map();
const imagesByLocale = new Map([...REGISTERED_LOCALES.keys()].map((key) => [key, new Set()]));
const altsByLocale = new Map([...REGISTERED_LOCALES.keys()].map((key) => [key, new Set()]));
const checkedImages = new Set();

function pngCrc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function inspectPng(buffer, imageUrl) {
  if (buffer.length < 8 || buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    err(imageUrl, 'social image does not have a valid PNG signature');
    return;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = -1;
  let interlace = -1;
  let sawHeader = false;
  let sawEnd = false;
  const imageData = [];

  while (offset < buffer.length) {
    if (buffer.length - offset < 12) {
      err(imageUrl, 'PNG has a truncated chunk header');
      return;
    }
    const length = buffer.readUInt32BE(offset);
    const chunkEnd = offset + 12 + length;
    if (chunkEnd > buffer.length) {
      err(imageUrl, 'PNG has a truncated chunk body');
      return;
    }
    const typeBuffer = buffer.subarray(offset + 4, offset + 8);
    const type = typeBuffer.toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    const expectedCrc = buffer.readUInt32BE(offset + 8 + length);
    const actualCrc = pngCrc32(Buffer.concat([typeBuffer, data]));
    if (actualCrc !== expectedCrc) {
      err(imageUrl, `PNG ${type} chunk has an invalid CRC`);
      return;
    }

    if (!sawHeader) {
      if (type !== 'IHDR' || length !== 13) {
        err(imageUrl, 'PNG must start with a 13-byte IHDR chunk');
        return;
      }
      sawHeader = true;
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      imageData.push(data);
    } else if (type === 'IEND') {
      if (length !== 0) err(imageUrl, 'PNG IEND chunk must be empty');
      sawEnd = true;
      if (chunkEnd !== buffer.length) err(imageUrl, 'PNG has trailing data after IEND');
      break;
    }
    offset = chunkEnd;
  }

  if (!sawEnd) err(imageUrl, 'PNG is missing its IEND chunk');
  if (imageData.length === 0) {
    err(imageUrl, 'PNG is missing image data');
    return;
  }
  if (width !== OG_IMAGE_WIDTH || height !== OG_IMAGE_HEIGHT) {
    err(imageUrl, `PNG dimensions are ${width}x${height}, expected ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT}`);
  }

  try {
    const decoded = inflateSync(Buffer.concat(imageData));
    const channels = new Map([[0, 1], [2, 3], [3, 1], [4, 2], [6, 4]]).get(colorType);
    if (interlace === 0 && channels) {
      const rowBytes = Math.ceil((width * channels * bitDepth) / 8);
      const expectedBytes = (rowBytes + 1) * height;
      if (decoded.length !== expectedBytes) {
        err(imageUrl, `decoded PNG data is ${decoded.length} bytes, expected ${expectedBytes}`);
      }
    }
  } catch (error) {
    err(imageUrl, `PNG image data cannot be decoded: ${error.message}`);
  }
}

function inspectSocialImage(imageUrl) {
  if (!imageUrl || checkedImages.has(imageUrl)) return;
  checkedImages.add(imageUrl);

  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch {
    err(imageUrl || 'og:image', 'social image URL is invalid');
    return;
  }
  if (parsed.origin !== site) err(imageUrl, `social image must be hosted on ${site}`);
  if (!parsed.pathname.toLowerCase().endsWith('.png')) err(imageUrl, 'social image must use a .png path');

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');
  } catch {
    err(imageUrl, 'social image path is not valid URL encoding');
    return;
  }
  const absolute = path.resolve(DIST, decodedPath);
  if (absolute !== DIST && !absolute.startsWith(`${DIST}${path.sep}`)) {
    err(imageUrl, 'social image path escapes the build output');
    return;
  }
  if (!fs.existsSync(absolute)) {
    err(imageUrl, `social image is missing from build output: ${decodedPath}`);
    return;
  }

  inspectPng(fs.readFileSync(absolute), imageUrl);
}

for (const [url, info] of pages) {
  if (info.titles.length !== 1) {
    err(url, `expected exactly one document <title>, got ${info.titles.length}`);
  }
  const title = cleanText(info.titles[0] ?? '').replace(TITLE_SUFFIX, '').trim();
  if (!title) {
    err(url, 'document title is empty after removing the fixed tgbot suffix');
  } else {
    const key = uniquenessKey(title);
    if (seenTitles.has(key)) err(url, `document title duplicates ${seenTitles.get(key)}: ${title}`);
    else seenTitles.set(key, url);
  }

  if (info.descriptions.length !== 1) {
    err(url, `expected exactly one meta description, got ${info.descriptions.length}`);
  }
  const description = cleanText(info.descriptions[0] ?? '');
  if (!description) {
    err(url, 'meta description is empty');
  } else {
    const key = uniquenessKey(description);
    if (seenDescriptions.has(key)) err(url, `meta description duplicates ${seenDescriptions.get(key)}`);
    else seenDescriptions.set(key, url);
  }

  if (info.h1Count !== 1) err(url, `expected exactly one H1, got ${info.h1Count}`);
  if (info.robots.length !== 1) {
    err(url, `expected exactly one robots meta tag, got ${info.robots.length}`);
  } else {
    const directives = parseRobots(info.robots[0]);
    if (!directives.has('index') || !directives.has('follow') || directives.has('noindex') || directives.has('nofollow')) {
      err(url, 'robots meta must explicitly allow index, follow');
    }
  }

  info.og = requiredMeta(info, 'property', REQUIRED_OG_FIELDS, 'Open Graph');
  info.twitter = requiredMeta(info, 'name', REQUIRED_TWITTER_FIELDS, 'Twitter');

  if (info.og['og:url'] && info.og['og:url'] !== url) err(url, 'og:url must equal the canonical URL');
  if (info.og['og:site_name'] && info.og['og:site_name'] !== SITE_NAME) {
    err(url, `og:site_name must be ${SITE_NAME}`);
  }
  const expectedOgType = info.isHome ? 'website' : 'article';
  if (info.og['og:type'] && info.og['og:type'] !== expectedOgType) {
    err(url, `og:type must be ${expectedOgType}`);
  }
  if (info.og['og:title']) {
    const ogTitle = cleanText(info.og['og:title']).replace(TITLE_SUFFIX, '').trim();
    if (ogTitle !== title) err(url, 'og:title must equal the document title without the fixed tgbot suffix');
  }
  if (info.language && info.og['og:locale'] !== REGISTERED_LOCALES.get(info.language)?.og) {
    err(url, `og:locale must match ${info.language}`);
  }
  const expectedOgAlternates = [...REGISTERED_LOCALES.entries()]
    .filter(([language]) => language !== info.language)
    .map(([, locale]) => locale.og)
    .sort();
  const actualOgAlternates = [...info.ogAlts].sort();
  if (new Set(actualOgAlternates).size !== actualOgAlternates.length || JSON.stringify(actualOgAlternates) !== JSON.stringify(expectedOgAlternates)) {
    err(url, `og:locale:alternate must be exactly ${expectedOgAlternates.join(', ')}`);
  }

  if (info.og['og:description'] && info.og['og:description'] !== info.descriptions[0]) {
    err(url, 'og:description must equal the meta description');
  }
  if (info.twitter['twitter:title'] && info.twitter['twitter:title'] !== info.og['og:title']) {
    err(url, 'twitter:title must equal og:title');
  }
  if (info.twitter['twitter:description'] && info.twitter['twitter:description'] !== info.og['og:description']) {
    err(url, 'twitter:description must equal og:description');
  }
  if (info.twitter['twitter:image'] && info.twitter['twitter:image'] !== info.og['og:image']) {
    err(url, 'twitter:image must equal og:image');
  }
  if (info.twitter['twitter:image:alt'] && info.twitter['twitter:image:alt'] !== info.og['og:image:alt']) {
    err(url, 'twitter:image:alt must equal og:image:alt');
  }
  if (info.twitter['twitter:card'] && info.twitter['twitter:card'] !== 'summary_large_image') {
    err(url, 'twitter:card must be summary_large_image');
  }
  if (info.og['og:image:width'] && info.og['og:image:width'] !== String(OG_IMAGE_WIDTH)) {
    err(url, `og:image:width must be ${OG_IMAGE_WIDTH}`);
  }
  if (info.og['og:image:height'] && info.og['og:image:height'] !== String(OG_IMAGE_HEIGHT)) {
    err(url, `og:image:height must be ${OG_IMAGE_HEIGHT}`);
  }
  if (info.og['og:image:type'] && info.og['og:image:type'].toLowerCase() !== 'image/png') {
    err(url, 'og:image:type must be image/png');
  }

  inspectSocialImage(info.og['og:image']);
  if (info.language && info.og['og:image']) imagesByLocale.get(info.language)?.add(info.og['og:image']);
  if (info.language && info.og['og:image:alt']) altsByLocale.get(info.language)?.add(info.og['og:image:alt']);
}

for (const [language, images] of imagesByLocale) {
  if (images.size !== 1) err('social images', `${language} must use exactly one localized social image, got ${images.size}`);
}
const localeImageUrls = [...imagesByLocale.values()].flatMap((images) => [...images]);
if (localeImageUrls.length === REGISTERED_LOCALES.size && new Set(localeImageUrls).size !== REGISTERED_LOCALES.size) {
  err('social images', 'each registered locale must use a distinct localized social image');
}
for (const [language, alts] of altsByLocale) {
  for (const [otherLanguage, otherAlts] of altsByLocale) {
    if (language >= otherLanguage) continue;
    const repeated = [...alts].filter((alt) => otherAlts.has(alt));
    if (repeated.length) err('social images', `${language} and ${otherLanguage} share non-localized image alt text: ${repeated.join(', ')}`);
  }
}

// --- JSON-LD -------------------------------------------------------------

for (const [url, info] of pages) {
  if (info.jsonLd.documents.length === 0) {
    err(url, 'missing JSON-LD');
    continue;
  }
  for (const document of info.jsonLd.documents) {
    if (!document || typeof document !== 'object' || document['@context'] !== 'https://schema.org') {
      err(url, 'each JSON-LD document must use @context https://schema.org');
    }
  }

  const website = nodeForType(info, 'WebSite');
  const organization = nodeForType(info, 'Organization');
  const sourceCode = nodeForType(info, 'SoftwareSourceCode');
  const image = nodeForType(info, 'ImageObject');
  const webPage = nodeForType(info, 'WebPage');
  const article = info.isHome ? null : nodeForType(info, 'TechArticle');
  const breadcrumb = info.isHome ? null : nodeForType(info, 'BreadcrumbList');

  validateWebsite(info, website, site);
  validateOrganization(info, organization);
  validateSoftwareSourceCode(info, sourceCode);
  validateSchemaImage(info, image, 'ImageObject');
  validateWebPage(
    info,
    webPage,
    website,
    sourceCode,
    image,
    info.isHome ? sourceCode : article,
    breadcrumb
  );

  validateReference(info, website?.publisher, organization, 'WebSite.publisher');
  validateReference(info, website?.about, sourceCode, 'WebSite.about');
  validateReference(info, website?.mainEntity, sourceCode, 'WebSite.mainEntity');
  validateReference(info, sourceCode?.creator, organization, 'SoftwareSourceCode.creator');
  if (sourceCode?.image !== undefined) {
    validateReference(info, sourceCode.image, image, 'SoftwareSourceCode.image');
  }

  if (!info.isHome) {
    validateTechArticle(info, article);
    validateBreadcrumb(info, breadcrumb, site);
    if (article) {
      if (article.headline !== info.og['og:title']) err(url, 'TechArticle.headline must equal og:title');
      if (article.description !== info.og['og:description']) err(url, 'TechArticle.description must equal og:description');
      if (resolvedSchemaUrl(info, article.mainEntityOfPage) !== url) {
        err(url, 'TechArticle.mainEntityOfPage must resolve to the canonical URL');
      }
      validateReference(info, article.mainEntityOfPage, webPage, 'TechArticle.mainEntityOfPage');
      validateReference(info, article.image, image, 'TechArticle.image');
      validateReference(info, article.author, organization, 'TechArticle.author');
      validateReference(info, article.publisher, organization, 'TechArticle.publisher');
      validateReference(info, article.isPartOf, website, 'TechArticle.isPartOf');
      validateReference(info, article.about, sourceCode, 'TechArticle.about');
    }
  }
}

// --- sitemap, robots.txt, and report ------------------------------------

const sitemapPath = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  err('sitemap.xml', 'not found in build output');
} else {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapAlternates = new Map();
  let locOk = 0;
  let locTotal = 0;
  for (const block of xml.split('</url>')) {
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    if (!locMatch) continue;
    const loc = locMatch[1].trim();
    locTotal++;
    if (sitemapAlternates.has(loc)) err(loc, 'duplicate sitemap <loc>');
    if (pages.has(loc)) locOk++;
    else err(loc, 'sitemap URL has no matching built indexable page');

    const alternates = new Map();
    for (const match of block.matchAll(/hreflang="([^"]*)"[^>]*href="([^"]*)"/g)) {
      if (alternates.has(match[1])) err(loc, `duplicate sitemap hreflang "${match[1]}"`);
      alternates.set(match[1], match[2]);
    }
    sitemapAlternates.set(loc, alternates);
  }

  for (const [loc, info] of pages) {
    const sitemapGroup = sitemapAlternates.get(loc);
    if (!sitemapGroup) {
      err(loc, 'built indexable page is missing from sitemap');
      continue;
    }
    const headGroup = new Map(info.hreflangs);
    if (info.xDefaults.length === 1) headGroup.set('x-default', info.xDefaults[0]);
    for (const [language, href] of headGroup) {
      if (!sitemapGroup.has(language)) err(loc, `head hreflang "${language}" is missing from sitemap`);
      else if (sitemapGroup.get(language) !== href) err(loc, `sitemap hreflang "${language}" disagrees with the page head`);
    }
    for (const [language] of sitemapGroup) {
      if (!headGroup.has(language)) err(loc, `sitemap hreflang "${language}" is missing from the page head`);
    }
  }

  const alternateCount = (xml.match(/<xhtml:link\b[^>]*\bhreflang=/g) ?? []).length;
  console.log(`sitemap: ${locOk}/${locTotal} locs resolved, ${alternateCount} hreflang alternates emitted`);
}

const robotsPath = path.join(DIST, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  err('robots.txt', 'not found in build output');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  const expectedSitemap = `Sitemap: ${site}/sitemap.xml`;
  if (!robots.includes(expectedSitemap)) err('robots.txt', `missing exact sitemap declaration: ${expectedSitemap}`);
}

const withGroups = [...pages.values()].filter((page) => page.hreflangs.size > 0).length;
console.log(`\nchecked ${pages.size} indexable pages, ${withGroups} have language groups`);
console.log(`checked ${checkedImages.size} localized social image(s)`);

if (errors.length) {
  console.error(`\nFAIL: ${errors.length} strict SEO issue(s):\n`);
  for (const issue of errors) console.error(`  - ${issue}\n`);
  process.exit(1);
}

console.log('\nOK: strict SEO invariants passed');
