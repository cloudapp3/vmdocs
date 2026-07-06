import { gaId } from './ga-config'

const CONSENT_KEY = 'vmflow-cookie-consent'
export type Consent = 'accepted' | 'rejected'

export function getConsent(): Consent | null {
  try {
    return (localStorage.getItem(CONSENT_KEY) as Consent | null) ?? null
  } catch {
    return null
  }
}

export function setConsent(c: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, c)
  } catch {}
  window.dispatchEvent(new CustomEvent('consent-change', { detail: c }))
  if (c === 'accepted') loadGA()
}

let gaRequested = false

/** Loads GA4 ONLY after the visitor has accepted cookies. IP is anonymized. */
export function loadGA() {
  if (gaRequested || getConsent() !== 'accepted') return
  if (document.getElementById('gtag-js')) return
  gaRequested = true
  const w = window as any
  const s = document.createElement('script')
  s.id = 'gtag-js'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  s.onload = () => window.dispatchEvent(new Event('ga-loaded'))
  document.head.appendChild(s)
  w.dataLayer = w.dataLayer || []
  w.gtag = function (...args: any[]) {
    w.dataLayer.push(args)
  }
  w.gtag('js', new Date())
  w.gtag('config', gaId, { anonymize_ip: true })
}

/** Fires a GA4 page_view for the given path (no-op without consent/gtag). */
export function trackPageview(path: string) {
  if (getConsent() !== 'accepted') return
  const gtag = (window as any).gtag
  if (typeof gtag === 'function') gtag('event', 'page_view', { page_path: path })
}
