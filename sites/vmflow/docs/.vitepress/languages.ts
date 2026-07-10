// Single source of truth for the site's languages.
//
// Adding a language = add one object to LANGUAGES below (+ register its
// translated pages in `translations` in config.mts). Everything else — the
// VitePress `locales` map, <html lang>, hreflang/og metadata, the locale
// switcher, and hreflang group construction — derives from this array, so there
// is no second place to keep in sync.

export type Language = {
  /** stable code, also the URL prefix segment: 'en' | 'zh' | 'ja' ... */
  code: string;
  /** true for the root locale (no URL prefix). Exactly one language is root. */
  root?: boolean;
  /** label shown in the locale switcher / VitePress `locales[].label`. */
  label: string;
  /** <html lang> value, e.g. 'zh-CN'. */
  vpLang: string;
  /** hreflang value used in <link>/sitemap, e.g. 'zh-CN'. */
  hreflang: string;
  /** og:locale value, e.g. 'zh_CN'. */
  og: string;
  /** URL prefix, '' for root, '/zh' otherwise. */
  route: string;
};

export const LANGUAGES: Language[] = [
  { code: 'en', root: true, label: 'English', vpLang: 'en-US', hreflang: 'en-US', og: 'en_US', route: '' },
  { code: 'zh', label: '中文', vpLang: 'zh-CN', hreflang: 'zh-CN', og: 'zh_CN', route: '/zh' },
  { code: 'ja', label: '日本語', vpLang: 'ja-JP', hreflang: 'ja-JP', og: 'ja_JP', route: '/ja' },
  { code: 'ru', label: 'Русский', vpLang: 'ru-RU', hreflang: 'ru-RU', og: 'ru_RU', route: '/ru' },
  { code: 'es', label: 'Español', vpLang: 'es-ES', hreflang: 'es-ES', og: 'es_ES', route: '/es' },
  { code: 'pt-BR', label: 'Português (BR)', vpLang: 'pt-BR', hreflang: 'pt-BR', og: 'pt_BR', route: '/pt-BR' },
  { code: 'ko', label: '한국어', vpLang: 'ko-KR', hreflang: 'ko-KR', og: 'ko_KR', route: '/ko' },
];

/** The root (English) language — no URL prefix. */
export const ROOT_LANG = LANGUAGES.find((l) => l.root) ?? LANGUAGES[0];

/** All non-root languages (those living under a URL prefix). */
export const TRANSLATED_LANGS = LANGUAGES.filter((l) => !l.root);

export const languageByCode = (code: string): Language | undefined =>
  LANGUAGES.find((l) => l.code === code);

/**
 * Per-locale hreflang/og metadata, keyed by language code. Consumed by
 * <head> hreflang, og:locale, and sitemap alternates.
 */
export const localeMeta: Record<string, { hreflang: string; og: string }> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, { hreflang: l.hreflang, og: l.og }])
);

/**
 * Detect a page's language from its path. Matches an exact prefix segment so
 * a code can't be a false prefix of another (e.g. 'en' vs 'en-gb').
 */
export function detectLocale(path: string): string {
  for (const l of TRANSLATED_LANGS) {
    const seg = l.route.slice(1); // 'zh' | 'ja' (route is '/zh')
    if (path === seg || path.startsWith(seg + '/')) return l.code;
  }
  return ROOT_LANG.code;
}
