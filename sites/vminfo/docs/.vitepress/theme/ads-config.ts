/**
 * AdSense configuration — fill in your own values before going live.
 *
 * 1. adsClient: publisher ID from AdSense > Account information
 *    (looks like ca-pub-1234567890123456).
 * 2. slots.docBottom / slots.aside: the numeric ad-slot IDs from ad units you
 *    create in AdSense > Ads > By ad unit > "Display ads".
 * 3. Update public/ads.txt so the `pub-...` value matches adsClient (no ca- prefix).
 */
export const adsClient = 'ca-pub-6224508725077453'

export const slots = {
  docBottom: '0000000001', // TODO: replace with real ad-slot id (AdSense > By ad unit > Display ads)
  aside: '0000000002', // TODO: replace with real ad-slot id
} as const

/** localStorage key recording the visitor's cookie-consent choice. */
export const CONSENT_KEY = 'vminfo-cookie-consent'
export type Consent = 'accepted' | 'rejected'
