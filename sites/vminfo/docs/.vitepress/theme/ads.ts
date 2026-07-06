import { adsClient, CONSENT_KEY, type Consent } from './ads-config'
import { gaId } from './ga-config'

export function getConsent(): Consent | null {
  try {
    return (localStorage.getItem(CONSENT_KEY) as Consent | null) ?? null
  } catch {
    return null
  }
}

// Everything that should only load after the visitor accepts cookies.
function loadConsentGated() {
  loadAdSense()
  loadGA()
}

export function setConsent(c: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, c)
  } catch {}
  window.dispatchEvent(new CustomEvent('consent-change', { detail: c }))
  if (c === 'accepted') loadConsentGated()
}

let adSenseRequested = false

/** Loads the AdSense script ONLY after the visitor has accepted cookies. */
export function loadAdSense() {
  if (adSenseRequested || getConsent() !== 'accepted') return
  if (document.getElementById('adsbygoogle-js')) return
  adSenseRequested = true
  const s = document.createElement('script')
  s.id = 'adsbygoogle-js'
  s.async = true
  s.crossOrigin = 'anonymous'
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`
  s.onload = () => window.dispatchEvent(new Event('adsense-loaded'))
  document.head.appendChild(s)
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

/** Called by each AdSlot: only activates the ad when consent has been given. */
export function pushAd() {
  if (getConsent() !== 'accepted') return
  const doPush = () => {
    try {
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      ;(window as any).adsbygoogle.push({})
    } catch {}
  }
  if ((window as any).adsbygoogle) doPush()
  else window.addEventListener('adsense-loaded', doPush, { once: true })
}

/** Fires a GA4 page_view for the given path (no-op without consent/gtag). */
export function trackPageview(path: string) {
  if (getConsent() !== 'accepted') return
  const gtag = (window as any).gtag
  if (typeof gtag === 'function') gtag('event', 'page_view', { page_path: path })
}
