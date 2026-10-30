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

  window.addEventListener('keydown', async (event) => {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) {
      return;
    }

    sequenceIndex = nextKonamiIndex(sequenceIndex, event.key);

    if (sequenceIndex === KONAMI_SEQUENCE.length) {
      sequenceIndex = 0;
      const { launchConfetti } = await import('./konamiConfetti');
      launchConfetti();
    }
  });
}
