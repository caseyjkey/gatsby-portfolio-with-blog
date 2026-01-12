/**
 * useReducedMotion - Detect user's reduced motion preference
 *
 * Returns true if the user prefers reduced motion, which should
 * disable or simplify animations.
 */

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Safari < 14 doesn't support addEventListener on MediaQueryList
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    } else {
      // Fallback for older Safari
      const legacyListener = () => {
        setPrefersReducedMotion(mediaQuery.matches);
      };
      mediaQuery.addListener(legacyListener);
      return () => {
        mediaQuery.removeListener(legacyListener);
      };
    }
  }, []);

  return prefersReducedMotion;
}
