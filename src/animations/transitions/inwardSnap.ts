/**
 * inwardSnap - Diagonal inward animation for split-row layouts
 *
 * Used for: Core Expertise rows where illustration and text meet in the middle
 */

import { ANIMATION_CONFIG, INWARD_SNAP } from '../config';

export interface InwardSnapOptions {
  side: 'left' | 'right';
  delay?: number;
  duration?: number;
}

/**
 * Get keyframes for inwardSnap animation
 */
export function inwardSnapKeyframes(options: InwardSnapOptions) {
  const { side, distance = 30 } = options;

  const x = side === 'left' ? INWARD_SNAP.left.x : INWARD_SNAP.right.x;
  const y = INWARD_SNAP.left.y;

  return [
    { opacity: 0, transform: `translate(${x}px, ${y}px)` },
    { opacity: 1, transform: 'translate(0, 0)' },
  ] as const;
}

/**
 * Get Motion One animate options for inwardSnap
 */
export function inwardSnapOptions(options: InwardSnapOptions = {}) {
  const { delay = 0, duration = ANIMATION_CONFIG.defaultDuration } = options;

  return {
    duration,
    delay,
    easing: ANIMATION_CONFIG.easing,
  } as const;
}
