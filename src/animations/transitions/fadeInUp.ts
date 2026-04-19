/**
 * fadeInUp - Standard vertical fade-in animation
 *
 * Most common animation - elements slide up and fade in.
 * Used for: Section headers, cards, content blocks
 */

import type { Variants } from 'motion/react';
import { ANIMATION_CONFIG, TIMING } from '../config';

export interface FadeInUpOptions {
  delay?: number;
  duration?: number;
  distance?: number;
}

/**
 * Get keyframes for fadeInUp animation (for reference/useAnimate)
 */
export function fadeInUpKeyframes(options: FadeInUpOptions = {}) {
  const { distance = TIMING.sectionHeader.distance } = options;

  return [
    { opacity: 0, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: 'translateY(0)' },
  ] as const;
}

/**
 * Get animation options for fadeInUp (for useAnimate)
 */
export function fadeInUpOptions(options: FadeInUpOptions = {}) {
  const { delay = 0, duration = TIMING.sectionHeader.duration } = options;

  return {
    duration,
    delay,
    ease: ANIMATION_CONFIG.easing,
  } as const;
}

/**
 * Framer Motion variants for fadeInUp
 */
const FADE_IN_UP_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    willChange: 'opacity, transform',
  },
  visible: (custom?: { delay?: number; distance?: number }) => ({
    opacity: 1,
    y: 0,
    willChange: 'auto',
    transition: {
      duration: 0.6,
      delay: custom?.delay || 0,
      ease: FADE_IN_UP_EASE,
    },
  }),
};

export default fadeInUpVariants;
