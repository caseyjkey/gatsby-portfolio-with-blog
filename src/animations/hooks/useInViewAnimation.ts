/**
 * useInViewAnimation - IntersectionObserver wrapper for scroll-triggered animations
 *
 * Detects when an element enters the viewport and triggers animations.
 * Respects desktop/mobile different triggers and once-only behavior.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { ANIMATION_CONFIG } from '../config';

interface UseInViewAnimationOptions {
  /** Custom rootMargin override (uses desktop/mobile default if not specified) */
  rootMargin?: string;
  /** Custom threshold override */
  threshold?: number;
  /** Only trigger once (default: true) */
  once?: boolean;
  /** Force mobile mode */
  forceMobile?: boolean;
  /** Skip animation for elements above viewport (default: true) */
  skipAboveViewport?: boolean;
}

type ElementPosition = 'above' | 'in' | 'below' | 'unknown';

interface UseInViewAnimationReturn {
  ref: (node: HTMLElement | null) => void;
  isInView: boolean;
  hasAnimated: boolean;
  position: ElementPosition;
}

export function useInViewAnimation(
  options: UseInViewAnimationOptions = {}
): UseInViewAnimationReturn {
  const {
    rootMargin,
    threshold,
    once = true,
    forceMobile = false,
    skipAboveViewport = true,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false); // Track when ref has a value
  const [position, setPosition] = useState<ElementPosition>('unknown');

  const isMobile = forceMobile || (typeof window !== 'undefined' && window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint);

  const getRootMargin = useCallback(() => {
    if (rootMargin) return rootMargin;
    return ANIMATION_CONFIG.rootMargin; // Use global rootMargin by default
  }, [rootMargin]);

  const getThreshold = useCallback(() => {
    if (threshold !== undefined) return threshold;
    return 0; // Use 0 threshold by default for consistent behavior
  }, [threshold]);

  /**
   * Detect element position relative to viewport
   */
  const detectInitialPosition = useCallback((element: HTMLElement): ElementPosition => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom < 0) return 'above';  // Completely above viewport
    if (rect.top < window.innerHeight) return 'in';  // Partially or fully in viewport
    return 'below';  // Completely below viewport
  }, []);

  // Set up observer when ref is ready
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      setHasAnimated(true);
      setPosition('in');
      return;
    }

    // Delay position detection to account for browser scroll restoration
    const timeoutId = setTimeout(() => {
      const initialPosition = detectInitialPosition(node);
      setPosition(initialPosition);

      // Handle elements above viewport
      if (skipAboveViewport && initialPosition === 'above') {
        setIsInView(true);
        setHasAnimated(true);
        return;
      }

      // Handle elements in viewport
      if (initialPosition === 'in') {
        setIsInView(true);
        if (once) {
          setHasAnimated(true);
        }
      }
    }, 50);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (once && !hasAnimated) {
              setHasAnimated(true);
            }
          } else if (!once) {
            setIsInView(false);
          }
        });
      },
      {
        rootMargin: getRootMargin(),
        threshold: getThreshold(),
      }
    );

    observer.observe(node);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [once, isReady, getRootMargin, getThreshold, hasAnimated, detectInitialPosition, skipAboveViewport]);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
    setIsReady(!!node); // Trigger re-render when ref gets a value
  }, []);

  return {
    ref: setRef,
    isInView: once ? hasAnimated : isInView,
    hasAnimated,
    position,
  };
}
