/**
 * Breakpoint utilities
 *
 * Detects mobile/desktop viewport and provides mobile-specific behavior.
 */

import { useMemo } from 'react';
import { ANIMATION_CONFIG } from '../config';

/**
 * Check if current viewport is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
}

/**
 * Check if element width exceeds mobile constraint (90% viewport)
 * Used to disable lateral movement on narrow screens
 */
export function shouldDisableLateral(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return false;
  const elementWidth = element.offsetWidth;
  const viewportWidth = window.innerWidth;
  return elementWidth > viewportWidth * ANIMATION_CONFIG.mobileMaxWidthPercent;
}

/**
 * React hook for mobile detection
 */
export function useIsMobile(): boolean {
  return useMemo(isMobile, []);
}

/**
 * React hook to check if lateral movement should be disabled
 */
export function useShouldDisableLateral(element: HTMLElement | null): boolean {
  return useMemo(() => {
    if (!element) return false;
    return shouldDisableLateral(element);
  }, [element]);
}
