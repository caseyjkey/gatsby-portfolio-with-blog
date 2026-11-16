import { restoreKonamiMode, toggleKonamiMode } from '../lib/konamiMode';

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

  restoreKonamiMode();
  document.addEventListener('astro:after-swap', restoreKonamiMode);

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
      toggleKonamiMode();
      const { launchConfetti } = await import('./konamiConfetti');
      launchConfetti();
    }
  });
}
