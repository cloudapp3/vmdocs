export type Language = {
  code: string;
  root?: boolean;
  label: string;
  vpLang: string;
  hreflang: string;
  og: string;
  route: string;
};

export const LANGUAGES: Language[] = [
  {
    code: 'en',
    root: true,
    label: 'English',
    vpLang: 'en-US',
    hreflang: 'en-US',
    og: 'en_US',
    route: '',
  },
  {
    code: 'zh',
    label: '中文',
    vpLang: 'zh-CN',
    hreflang: 'zh-CN',
    og: 'zh_CN',
    route: '/zh',
  },
];

export const ROOT_LANG = LANGUAGES.find((language) => language.root) ?? LANGUAGES[0];
export const TRANSLATED_LANGS = LANGUAGES.filter((language) => !language.root);

export const localeMeta: Record<string, { hreflang: string; og: string }> =
  Object.fromEntries(
    LANGUAGES.map((language) => [
      language.code,
      { hreflang: language.hreflang, og: language.og },
    ])
  );

export function detectLocale(path: string): string {
  for (const language of TRANSLATED_LANGS) {
    const segment = language.route.slice(1);
    if (path === segment || path.startsWith(`${segment}/`)) {
      return language.code;
    }
  }
  return ROOT_LANG.code;
}
