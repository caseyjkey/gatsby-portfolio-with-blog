/**
 * horizontalWave - Grid stagger animation for card layouts
 *
 * Used for: Skills, Projects, Blog cards
 * Calculates delay based on data-col and data-row attributes
 */

import { ANIMATION_CONFIG, WAVE_STAGGER, MOBILE_VERTICAL_STACK } from '../config';

export interface HorizontalWaveOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  isMobile?: boolean;
}

/**
 * Calculate stagger delay from data-col and data-row attributes
 */
export function calculateWaveDelay(element: HTMLElement): number {
  const col = parseInt(element.getAttribute('data-col') || '0', 10);
  const row = parseInt(element.getAttribute('data-row') || '0', 10);

  return (col * WAVE_STAGGER.columnDelay) + (row * WAVE_STAGGER.rowDelay);
}

/**
 * Get keyframes for horizontalWave animation
 */
export function horizontalWaveKeyframes(options: HorizontalWaveOptions = {}) {
  const { distance = 30 } = options;

  return [
    { opacity: 0, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: 'translateY(0)' },
  ] as const;
}

/**
 * Get Motion One animate options for horizontalWave with calculated delay
 */
export function horizontalWaveOptions(element: HTMLElement, options: HorizontalWaveOptions = {}) {
  const { duration = ANIMATION_CONFIG.defaultDuration, isMobile } = options;

  // Mobile: use simple vertical stack, no stagger calculation
  if (isMobile) {
    return {
      duration,
      delay: 0, // Stagger handled by sequential animation calls
      easing: ANIMATION_CONFIG.easing,
    } as const;
  }

  // Desktop: calculate stagger from data attributes
  const delay = calculateWaveDelay(element);

  return {
    duration,
    delay,
    easing: ANIMATION_CONFIG.easing,
  } as const;
}
