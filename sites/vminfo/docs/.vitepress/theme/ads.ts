import { adsClient, CONSENT_KEY, type Consent } from './ads-config'

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
  if (c === 'accepted') loadAdSense()
}

let adSenseRequested = false

/**
 * Loads the AdSense script ONLY after the visitor has accepted cookies.
 * Called from setConsent() and on first mount when consent was previously given.
 */
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
