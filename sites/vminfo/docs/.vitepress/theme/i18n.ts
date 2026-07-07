// Lightweight per-locale UI message dictionary.
//
// We deliberately avoid vue-i18n: the translatable UI surface is tiny (the
// cookie-consent banner today). When you add a language to ../languages.ts,
// add a matching entry here (keyed by its `vpLang`, i.e. what useData().lang
// returns) — falling back to en-US keeps unmapped languages functional.
import { computed } from 'vue';
import { useData } from 'vitepress';

export type ConsentMessages = {
  /** text leading up to the privacy-policy link */
  before: string;
  /** privacy-policy link label */
  privacy: string;
  /** text after the link (e.g. closing period) — handles per-language punctuation */
  after: string;
  accept: string;
  reject: string;
  /** screen-reader label for the banner dialog */
  ariaLabel: string;
};

const consentDict: Record<string, ConsentMessages> = {
  'en-US': {
    before:
      'We use cookies to serve ads via Google AdSense and to measure traffic with Google Analytics. You can accept or reject these cookies at any time. See our ',
    privacy: 'Privacy Policy',
    after: '.',
    accept: 'Accept',
    reject: 'Reject',
    ariaLabel: 'Cookie consent',
  },
  'zh-CN': {
    before:
      '我们通过 Google AdSense 投放广告、使用 Google Analytics 统计流量，因此会使用 Cookie。您可以随时接受或拒绝。详见',
    privacy: '隐私政策',
    after: '。',
    accept: '接受',
    reject: '拒绝',
    ariaLabel: 'Cookie 同意',
  },
  'ja-JP': {
    before:
      '当サイトは Google AdSense による広告配信と Google Analytics によるアクセス解析のため Cookie を使用します。いつでも許可・拒否できます。',
    privacy: 'プライバシーポリシー',
    after: 'をご覧ください。',
    accept: '同意する',
    reject: '拒否',
    ariaLabel: 'Cookie の同意',
  },
  'ru-RU': {
    before:
      'Мы используем cookie для показа рекламы через Google AdSense и измерения трафика с помощью Google Analytics. Вы можете в любой момент принять или отклонить их. См. ',
    privacy: 'Политику конфиденциальности',
    after: '.',
    accept: 'Принять',
    reject: 'Отклонить',
    ariaLabel: 'Согласие на использование cookie',
  },
  'es-ES': {
    before:
      'Usamos cookies para mostrar anuncios mediante Google AdSense y medir el tráfico con Google Analytics. Puedes aceptar o rechazar estas cookies en cualquier momento. Consulta nuestra ',
    privacy: 'Política de privacidad',
    after: '.',
    accept: 'Aceptar',
    reject: 'Rechazar',
    ariaLabel: 'Consentimiento de cookies',
  },
  'pt-BR': {
    before:
      'Usamos cookies para exibir anúncios do Google AdSense e medir o tráfego com o Google Analytics. Você pode aceitar ou rejeitar esses cookies a qualquer momento. Consulte nossa ',
    privacy: 'Política de privacidade',
    after: '.',
    accept: 'Aceitar',
    reject: 'Rejeitar',
    ariaLabel: 'Consentimento de cookies',
  },
  'ko-KR': {
    before:
      'Google AdSense 광고 게재와 Google Analytics 트래픽 측정을 위해 쿠키를 사용합니다. 언제든지 수락하거나 거부할 수 있습니다. ',
    privacy: '개인정보 처리방침',
    after: '을 참조하세요.',
    accept: '수락',
    reject: '거부',
    ariaLabel: '쿠키 동의',
  },
};

const FALLBACK = 'en-US';

export function useConsentMessages() {
  const { lang } = useData();
  return computed(() => consentDict[lang.value] ?? consentDict[FALLBACK]);
}
