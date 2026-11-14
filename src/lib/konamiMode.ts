export const KONAMI_MODE_EVENT = 'portfolio-konami-mode-change';
export const KONAMI_MODE_STORAGE_KEY = 'portfolio-konami-mode';

export function isKonamiModeActive(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.konamiMode === 'active';
}

export function applyKonamiMode(active: boolean): void {
  if (typeof document === 'undefined') return;

  if (active) {
    document.documentElement.dataset.konamiMode = 'active';
  } else {
    delete document.documentElement.dataset.konamiMode;
  }
}

export function restoreKonamiMode(): boolean {
  if (typeof window === 'undefined') return false;

  const active = window.sessionStorage.getItem(KONAMI_MODE_STORAGE_KEY) === 'active';
  applyKonamiMode(active);
  window.dispatchEvent(new CustomEvent<boolean>(KONAMI_MODE_EVENT, { detail: active }));
  return active;
}

export function setKonamiMode(active: boolean): void {
  if (typeof window === 'undefined') return;

  applyKonamiMode(active);
  if (active) {
    window.sessionStorage.setItem(KONAMI_MODE_STORAGE_KEY, 'active');
  } else {
    window.sessionStorage.removeItem(KONAMI_MODE_STORAGE_KEY);
  }

  window.dispatchEvent(new CustomEvent<boolean>(KONAMI_MODE_EVENT, { detail: active }));
}

export function toggleKonamiMode(): boolean {
  const active = !isKonamiModeActive();
  setKonamiMode(active);
  return active;
}
