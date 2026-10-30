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
  distance?: number;
}

/**
 * Get keyframes for inwardSnap animation
 */
export function inwardSnapKeyframes(options: InwardSnapOptions) {
  const { side, distance = 30 } = options;

  const x = side === 'left'
    ? distance === 30 ? INWARD_SNAP.left.x : -distance
    : distance === 30 ? INWARD_SNAP.right.x : distance;
  const y = distance === 30 ? INWARD_SNAP.left.y : Math.round(distance * 0.33);

  return [
    { opacity: 0, transform: `translate(${x}px, ${y}px)` },
    { opacity: 1, transform: 'translate(0, 0)' },
  ] as const;
}

/**
 * Get Motion One animate options for inwardSnap
 */
export function inwardSnapOptions(options: Partial<InwardSnapOptions> = {}) {
  const { delay = 0, duration = ANIMATION_CONFIG.defaultDuration } = options;

  return {
    duration,
    delay,
    easing: ANIMATION_CONFIG.easing,
  } as const;
}
