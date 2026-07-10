// Post-build SEO i18n validator.
//
// Scans the built dist/ and enforces the three Google hreflang invariants
// (bi-directional symmetry, complete groups, 200-reachable targets) plus the
// URL-form agreement between canonical / <head> hreflang / sitemap. Google
// silently drops an ENTIRE hreflang group on any inconsistency, so this is the
// safety net that lets us add languages without regressing international SEO.
//
// Zero dependencies (pure node:fs / node:path / regex). Run after build:
//   node sites/vmflow/docs/.vitepress/check-hreflang.mjs
// Exits 1 on any violation.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');

const errors = [];
const err = (where, msg) => errors.push(`${where}\n    ↳ ${msg}`);

// --- helpers -------------------------------------------------------------

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function getAttr(tag, name) {
  const m = tag.match(new RegExp('\\b' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
}

function extractCanonical(html) {
  const m = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/);
  return m ? getAttr(m[0], 'href') : null;
}

// Map<hreflang, href> for the translation group; x-default is excluded.
function extractHreflangs(html) {
  const map = new Map();
  for (const m of html.matchAll(/<link\b[^>]*\brel="alternate"[^>]*>/g)) {
    const hl = getAttr(m[0], 'hreflang');
    const href = getAttr(m[0], 'href');
    if (hl && href && hl !== 'x-default') map.set(hl, href);
  }
  return map;
}

function extractOgLocale(html) {
  // property="og:locale" but NOT property="og:locale:alternate"
  const m = html.match(/<meta\b[^>]*property="og:locale"(?![:"])[^>]*>/);
  return m ? getAttr(m[0], 'content') : null;
}

function extractOgAlts(html) {
  const out = [];
  for (const m of html.matchAll(/<meta\b[^>]*property="og:locale:alternate"[^>]*>/g)) {
    const c = getAttr(m[0], 'content');
    if (c) out.push(c);
  }
  return out;
}

// Derive a page's expected URL from its dist file path (cleanUrls mode):
//   index.html         -> SITE/
//   zh/index.html      -> SITE/zh/
//   zh/quick-start.html-> SITE/zh/quick-start
function fileToUrl(absFile, site) {
  const rel = path.relative(DIST, absFile).split(path.sep).join('/');
  if (rel === 'index.html') return site + '/';
  if (rel.endsWith('/index.html')) return site + '/' + rel.slice(0, -'/index.html'.length) + '/';
  return site + '/' + rel.slice(0, -'.html'.length);
}

// --- pass 1: parse every page -------------------------------------------

const files = walkHtml(DIST);
if (!files.length) {
  console.error(`check-hreflang: no HTML under ${DIST} — run build first.`);
  process.exit(2);
}

// Site origin is derived from the first canonical we find (kept in sync with
// config.mts automatically — no hardcoded hostname to drift).
let site = '';
for (const f of files) {
  const c = extractCanonical(fs.readFileSync(f, 'utf8'));
  if (c) {
    try { site = new URL(c).origin; } catch { /* ignore, reported below */ }
    break;
  }
}
if (!site) {
  console.error('check-hreflang: could not derive site origin (no canonical with a valid URL).');
  process.exit(2);
}

// Keyed by canonical URL so that hreflang href / sitemap <loc> resolution is
// exact-match — any trailing-slash or case mismatch surfaces as "target missing".
const pages = new Map();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const canonical = extractCanonical(html);
  const url = canonical || fileToUrl(file, site);
  if (pages.has(url)) err(url, `duplicate canonical (also produced by ${pages.get(url).file})`);
  pages.set(url, {
    file,
    canonical,
    hreflangs: extractHreflangs(html),
    ogLocale: extractOgLocale(html),
    ogAlts: extractOgAlts(html),
    expectedUrl: fileToUrl(file, site),
  });
}

// --- pass 2: invariant checks -------------------------------------------

// (a) canonical must self-reference the page's own URL (never point across
//     languages — that would tell Google the localized page is a duplicate).
for (const [url, info] of pages) {
  if (!info.canonical) {
    err(url, 'missing <link rel="canonical">');
  } else if (info.canonical !== info.expectedUrl) {
    err(url, `canonical does not self-reference: got ${info.canonical}, expected ${info.expectedUrl}`);
  }
}

// (b) every hreflang target must exist (exact URL) — this also catches
//     URL-form drift (trailing slash / case) since the map is keyed by canonical.
// (c) bidirectional symmetry: if A declares B as a translation, B must declare A.
for (const [A, info] of pages) {
  for (const [hl, B] of info.hreflangs) {
    if (B === A) continue; // self-reference is expected and fine
    const b = pages.get(B);
    if (!b) {
      err(A, `hreflang "${hl}" → ${B}: target page not found (untranslated page, dead link, or URL-form mismatch)`);
      continue;
    }
    if (![...b.hreflangs.values()].includes(A)) {
      err(A, `hreflang "${hl}" → ${B}: not declared back by target (asymmetric group — Google will drop the whole group)`);
    }
  }
}

// (d) og:locale coverage — a page with a translation group must declare its own
//     og:locale, and the group's other languages must appear as og:locale:alternate.
for (const [url, info] of pages) {
  if (info.hreflangs.size === 0) continue;
  if (!info.ogLocale) {
    err(url, 'has translations but no og:locale');
    continue;
  }
  // expected alternates = every group member's language except the page's own.
  // We don't have the locale->og table here, so verify the weaker but still
  // meaningful invariant: at least one alternate, and no alternate equals self.
  if (info.ogAlts.length === 0) err(url, 'has translations but no og:locale:alternate');
  if (info.ogAlts.includes(info.ogLocale)) err(url, `og:locale:alternate repeats self (${info.ogLocale})`);
}

// (e) sitemap.xml: every <loc> must resolve to a built page (agree with
//     canonical char-for-char), AND each entry's hreflang alternates must
//     match the <head> hreflang group exactly. A sitemap that drops a language
//     version — the exact class of bug this validator exists to catch — fails here.
const sitemapPath = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  err('sitemap.xml', 'not found in build output');
} else {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const smAlts = new Map(); // loc -> Map<hreflang, href>
  let locOk = 0, locTotal = 0;
  for (const block of xml.split('</url>')) {
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    if (!locMatch) continue;
    const loc = locMatch[1].trim();
    locTotal++;
    if (pages.has(loc)) locOk++;
    else err(loc, 'in sitemap but no matching page (sitemap URL form disagrees with canonical)');
    const am = new Map();
    for (const m of block.matchAll(/hreflang="([^"]*)"[^>]*href="([^"]*)"/g)) {
      if (m[1] !== 'x-default') am.set(m[1], m[2]);
    }
    smAlts.set(loc, am);
  }

  for (const [loc, info] of pages) {
    const sm = smAlts.get(loc);
    if (!sm) continue; // page not in sitemap (e.g. excluded) — not an error
    if (info.hreflangs.size === 0 && sm.size === 0) continue;
    for (const [hl, href] of info.hreflangs) {
      if (!sm.has(hl)) err(loc, `head hreflang "${hl}" → ${href} missing from sitemap alternates`);
      else if (sm.get(hl) !== href) err(loc, `sitemap alternate "${hl}" href disagrees: head=${href} sitemap=${sm.get(hl)}`);
    }
    for (const [hl, href] of sm) {
      if (!info.hreflangs.has(hl)) err(loc, `sitemap alternate "${hl}" → ${href} not declared in <head> hreflang`);
    }
  }

  const xmlAltCount = (xml.match(/<xhtml:link\b[^>]*\bhreflang=/g) || []).length;
  console.log(`sitemap: ${locOk}/${locTotal} locs resolved, ${xmlAltCount} hreflang alternates emitted`);
}

// --- report --------------------------------------------------------------

const withGroups = [...pages.values()].filter((p) => p.hreflangs.size > 0).length;
console.log(`\nchecked ${pages.size} pages, ${withGroups} have hreflang groups`);

if (errors.length) {
  console.error(`\n✗ ${errors.length} i18n SEO issue(s):\n`);
  for (const e of errors) console.error(`  • ${e}\n`);
  process.exit(1);
}
console.log('\n✓ i18n SEO invariants OK (canonical self-ref, hreflang symmetric, sitemap agrees)');
