import { restoreKonamiMode, toggleKonamiMode } from '../lib/konamiMode';
import { trackKonamiUnlock } from '../lib/analytics';
import {
  canUseMobileHomeHeaderCode,
  registerMobileHomeHeaderTap,
  type HeaderTapState,
} from './mobileKonamiTap';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

export function nextKonamiIndex(currentIndex: number, key: string): number {
  const normalizedKey = key.length === 1 ? key.toLowerCase() : key;

  if (normalizedKey === KONAMI_SEQUENCE[currentIndex]) {
    return currentIndex + 1;
  }

  return normalizedKey === KONAMI_SEQUENCE[0] ? 1 : 0;
}

export function shouldPreventKonamiDefault(currentIndex: number, key: string): boolean {
  const normalizedKey = key.length === 1 ? key.toLowerCase() : key;
  return (
    normalizedKey === KONAMI_SEQUENCE[currentIndex] ||
    normalizedKey === KONAMI_SEQUENCE[0]
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

declare global {
  interface Window {
    __konamiListenerInstalled?: boolean;
  }
}

if (typeof window !== 'undefined' && !window.__konamiListenerInstalled) {
  window.__konamiListenerInstalled = true;
  let sequenceIndex = 0;
  let headerTapState: HeaderTapState = { count: 0, lastTapAt: 0 };

  restoreKonamiMode();
  document.addEventListener('astro:after-swap', () => {
    sequenceIndex = 0;
    headerTapState = { count: 0, lastTapAt: 0 };
    restoreKonamiMode();
  });
  document.addEventListener('astro:page-load', () => {
    sequenceIndex = 0;
    headerTapState = { count: 0, lastTapAt: 0 };
  });

  window.addEventListener('keydown', async (event) => {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) {
      return;
    }

    if (shouldPreventKonamiDefault(sequenceIndex, event.key)) {
      // Arrow keys normally scroll the page. Keep the viewport fixed while a
      // valid Konami sequence is being entered so the reveal does not jump
      // the hero 80px away from its intended layout.
      event.preventDefault();
    }

    sequenceIndex = nextKonamiIndex(sequenceIndex, event.key);

    if (sequenceIndex === KONAMI_SEQUENCE.length) {
      sequenceIndex = 0;
      const active = toggleKonamiMode();
      if (active) trackKonamiUnlock('keyboard');
      const { launchConfetti } = await import('./konamiConfetti');
      launchConfetti();
    }
  });

  window.addEventListener('click', async (event) => {
    if (!(event.target instanceof Element) || event.detail === 0) return;
    const brand = event.target.closest('.navbar-brand');
    if (!brand) return;

    const eligible = canUseMobileHomeHeaderCode(
      window.location.pathname,
      window.innerWidth,
      window.scrollY,
    );
    const result = registerMobileHomeHeaderTap(headerTapState, Date.now(), eligible);
    headerTapState = result.state;

    // On eligible mobile home taps, do not let the brand anchor navigate away
    // or reset the short tap sequence before its fifth activation.
    if (eligible) event.preventDefault();
    if (!result.activated) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const active = toggleKonamiMode();
    if (active) trackKonamiUnlock('mobile_header');
    const { launchConfetti } = await import('./konamiConfetti');
    launchConfetti();
  }, true);
}
