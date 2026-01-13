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
}

interface UseInViewAnimationReturn {
  ref: (node: HTMLElement | null) => void;
  isInView: boolean;
  hasAnimated: boolean;
}

export function useInViewAnimation(
  options: UseInViewAnimationOptions = {}
): UseInViewAnimationReturn {
  const {
    rootMargin,
    threshold,
    once = true,
    forceMobile = false,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false); // Track when ref has a value

  const isMobile = forceMobile || (typeof window !== 'undefined' && window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint);

  const getRootMargin = useCallback(() => {
    if (rootMargin) return rootMargin;
    return isMobile ? ANIMATION_CONFIG.mobileRootMargin : ANIMATION_CONFIG.desktopRootMargin;
  }, [rootMargin, isMobile]);

  const getThreshold = useCallback(() => {
    if (threshold !== undefined) return threshold;
    return isMobile ? ANIMATION_CONFIG.mobileThreshold : 0;
  }, [threshold, isMobile]);

  // Set up observer when ref is ready
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    console.log('[useInViewAnimation] Setting up observer for node:', node.tagName, 'isReady:', isReady);

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('[useInViewAnimation] Reduced motion detected, skipping animation');
      setIsInView(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('[useInViewAnimation] Observer callback:', {
            isIntersecting: entry.isIntersecting,
            once,
            hasAnimated,
            intersectionRatio: entry.intersectionRatio,
            rootMargin: getRootMargin(),
          });
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
    console.log('[useInViewAnimation] Observer created with rootMargin:', getRootMargin(), 'threshold:', getThreshold());

    return () => {
      observer.disconnect();
    };
  }, [once, isReady, getRootMargin, getThreshold, hasAnimated]);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
    setIsReady(!!node); // Trigger re-render when ref gets a value
  }, []);

  return {
    ref: setRef,
    isInView: once ? hasAnimated : isInView,
    hasAnimated,
  };
}
