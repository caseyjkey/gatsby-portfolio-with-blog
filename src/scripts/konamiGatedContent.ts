// Konami-gated content.
//
// Project and blog posts marked `konamiOnly` stay hidden until Konami mode is
// active. The mode lives on `<html data-konami-mode="active">`, so the gate is
// a single DOM attribute read rather than duplicated state. This script keeps
// the gate in sync with mode changes and applies the unlocked treatment that
// differentiates revealed content from ordinary entries.

const GATED_SELECTOR = '[data-konami-only]';
const UNLOCKED_CLASS = 'is-unlocked';

function isKonamiModeActive() {
  return document.documentElement.dataset.konamiMode === 'active';
}

function applyKonamiGate() {
  const active = isKonamiModeActive();

  document.querySelectorAll<HTMLElement>(GATED_SELECTOR).forEach((element) => {
    element.hidden = !active;
    element.classList.toggle(UNLOCKED_CLASS, active);
  });

  document.querySelectorAll<HTMLElement>('[data-konami-locked-hint]').forEach((element) => {
    element.hidden = active;
  });
}

export function initializeKonamiGatedContent() {
  applyKonamiGate();

  const gateWindow = window as Window & { __konamiGateInstalled?: boolean };
  if (gateWindow.__konamiGateInstalled) return;

  gateWindow.__konamiGateInstalled = true;
  // The mode event is dispatched on `window`, so listen there. A listener on
  // `document` never sees it because the custom event does not bubble down
  // from the window.
  window.addEventListener('portfolio-konami-mode-change', applyKonamiGate);
  document.addEventListener('astro:page-load', applyKonamiGate);
}

if (typeof document !== 'undefined') {
  initializeKonamiGatedContent();
}
