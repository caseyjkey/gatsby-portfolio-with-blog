/**
 * Easing utilities
 *
 * Provides the "Power Out" cubic-bezier curve used throughout the site.
 */

// Easing string compatible with both CSS and Framer Motion
export const EASING = [0.2, 0.8, 0.2, 1] as const;

/**
 * Animation easing options for Framer Motion
 */
export const easingOptions = {
  duration: 0.8, // Framer Motion uses seconds, not milliseconds
  ease: EASING,
} as const;

/**
 * Create easing options with custom duration (in seconds for Framer Motion)
 */
export function createEasing(duration: number) {
  return {
    duration,
    ease: EASING,
  };
}
