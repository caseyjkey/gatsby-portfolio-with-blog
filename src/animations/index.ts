/**
 * Motion System - Public API
 *
 * Unified animation system powered by Framer Motion.
 * All animations respect the global timing, easing, and behavioral rules.
 */

// Note: React components (motion, useAnimation, etc.) should be imported directly from 'motion/react'
// The vanilla 'motion' package does not export these React APIs

// Hooks
export { useInViewAnimation } from './hooks/useInViewAnimation';
export { useReducedMotion } from './hooks/useReducedMotion';

// Utils
export {
  isMobile,
  shouldDisableLateral,
  useIsMobile,
  useShouldDisableLateral,
} from './utils/breakpoint';

export { EASING, easingOptions, createEasing } from './utils/easing';

// Transitions
export {
  fadeInUpKeyframes,
  fadeInUpOptions,
  fadeInUpVariants,
} from './transitions/fadeInUp';

export {
  inwardSnapKeyframes,
  inwardSnapOptions,
} from './transitions/inwardSnap';

export {
  calculateWaveDelay,
  horizontalWaveKeyframes,
  horizontalWaveOptions,
} from './transitions/horizontalWave';

// Config (re-export key values for convenience)
export {
  ANIMATION_CONFIG,
  TIMING,
  WAVE_STAGGER,
  STAGGER,
  HERO_TIMING,
  TEXT_HIERARCHY,
  MOBILE_TEXT_HIERARCHY,
  INWARD_SNAP,
  MOBILE_VERTICAL_STACK,
  TIMELINE_DRAW,
  ACCORDION,
  PROGRESSIVE_STAGGER,
} from './config';

// Types
export type { UseInViewAnimationOptions } from './hooks/useInViewAnimation';
export type { FadeInUpOptions } from './transitions/fadeInUp';
export type { InwardSnapOptions } from './transitions/inwardSnap';
export type { HorizontalWaveOptions } from './transitions/horizontalWave';
