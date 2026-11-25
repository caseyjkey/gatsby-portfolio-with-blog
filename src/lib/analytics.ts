export type KonamiUnlockMethod = 'keyboard' | 'mobile_header';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackKonamiUnlock(method: KonamiUnlockMethod): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'konami_unlock', {
    method,
  });
}
