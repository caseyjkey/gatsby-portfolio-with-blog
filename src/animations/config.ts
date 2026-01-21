/**
 * Motion System - Global Configuration
 *
 * All site animations use these constants for consistent timing, easing, and behavior.
 */

/**
 * Standard easing curves
 */
export const EASING = {
  // Power Out curve - used for most animations
  standard: [0.2, 0.8, 0.2, 1],
  // Spring easing - used for scale effects
  spring: [0.34, 1.56, 0.64, 1],
} as const;

/**
 * Global animation constants
 */
export const ANIMATION_CONFIG = {
  // Easing: "Power Out" curve
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',

  // Unified rootMargin for all scroll-triggered animations
  // Bottom-relative: triggers when element is 1/3 to 1/2 from viewport bottom
  // i.e., element bottom between 33% and 50% from bottom (or 66% to 50% from top)
  rootMargin: '0px 0px -15% 0px',

  // Mobile threshold: 5% (mobile users scroll faster)
  mobileThreshold: 0.05,

  // Animation should only trigger once
  once: true,

  // Duration varies by element type (see TIMING below)
  defaultDuration: 800,

  // Mobile constraint: Disable lateral movement if width > 90% viewport
  mobileMaxWidthPercent: 0.9,

  // Breakpoint for mobile detection
  mobileBreakpoint: 768,
} as const;

/**
 * Standardized timing for all pages
 * Delay is relative to the element entering the viewport
 */
export const TIMING = {
  sectionHeader: {
    delay: 0,
    duration: 800,
    distance: 30,
  },
  primaryUnit: {
    delay: 150,
    duration: 700,
    distance: 20,
  },
  secondaryUnit: {
    delay: 250, // primary + 100ms
    duration: 700,
    distance: 20,
  },
} as const;

/**
 * Horizontal Wave stagger calculation
 * delay = (column_index * 150ms) + (row_index * 50ms)
 */
export const WAVE_STAGGER = {
  columnDelay: 150, // ms
  rowDelay: 50,     // ms
} as const;

/**
 * Sequential stagger (applies to both desktop and mobile)
 */
export const STAGGER = 100; // ms between sequential elements

/**
 * Hero entrance timing (all in milliseconds)
 */
export const HERO_TIMING = {
  hello: { delay: 0, duration: 800, distance: 30 },
  intro: { delay: 150, duration: 800, distance: 20 },
  typewriter: { delay: 300, duration: 800, distance: 10 },
  subtext: { delay: 450, duration: 800, distance: 10 },
  portrait: { delay: 400, duration: 1200, distance: 30, scaleFrom: 0.95, scaleTo: 1.0 },
  cta: { delay: 600, duration: 800, distance: 20 },
  arrow: { delay: 1000, duration: 800, distance: 0 },
} as const;

/**
 * Down arrow bob loop (infinite)
 */
export const ARROW_BOB = {
  distance: 5, // px (+/-)
  duration: 1600, // ms
} as const;

/**
 * Focus Scale text hierarchy distances (all upward lift in px)
 */
export const TEXT_HIERARCHY = {
  sectionHeader: 40,
  mainTitle: 30,
  subheader: 20,
  body: 10,
} as const;

/**
 * Mobile text hierarchy
 */
export const MOBILE_TEXT_HIERARCHY = {
  sectionHeader: 30,
  subheader: 20,
  body: 10,
} as const;

/**
 * Inward Snap vectors (desktop)
 */
export const INWARD_SNAP = {
  left: { x: -20, y: 30 },
  right: { x: 20, y: 30 },
  illustrationDelay: 150, // ms follow-through
} as const;

/**
 * Mobile Vertical Stack
 */
export const MOBILE_VERTICAL_STACK = {
  distance: 20, // px
  stagger: STAGGER, // ms
} as const;

/**
 * Timeline Draw (mobile)
 */
export const TIMELINE_DRAW = {
  distance: 15, // px (slide from left)
} as const;

/**
 * Accordion animations
 */
export const ACCORDION = {
  contentLift: 10, // px (desktop: also 5px right)
  repeat: true, // Always animate on open
  duration: 0.5, // seconds
  staggerDelay: 0.1, // seconds per child item
  // Time to wait for accordion expansion before scrolling (ms)
  // Should be longer than the Bootstrap accordion animation (~350ms)
  expansionDelay: 700, // ms
  // Scroll animation duration when switching accordion sections (ms)
  scrollDuration: 500, // ms
  // Time to wait after scroll completes for viewport to settle before checking positions (ms)
  scrollSettleTime: 100, // ms
} as const;

/**
 * Timeline animations
 */
export const TIMELINE = {
  year: {
    duration: 0.5, // seconds
    delay: 0, // seconds
    firstDelay: 0.5, // seconds (for first timeline item)
  },
  dot: {
    duration: 0.4, // seconds
    delay: 0, // seconds
    firstDelay: 0.5, // seconds (for first timeline item)
    ease: [0.34, 1.56, 0.64, 1], // spring easing for scale effect
  },
  entry: {
    duration: 1, // seconds
    delay: 0, // seconds
    firstDelay: 0.5, // seconds (for first timeline item)
  },
  bullet: {
    baseDelay: 0.2, // seconds
    staggerIncrement: 0.1, // seconds per bullet
  },
  line: {
    duration: 0.5, // seconds
    ease: [0.2, 0.8, 0.2, 1], // standard easing
  },
} as const;

/**
 * Illustration element animations
 * Used for individual parts within illustrations (SVG groups, images, etc.)
 */
export const ILLUSTRATION = {
  element: {
    duration: 0.6, // seconds
    delay: 0.15, // seconds
  },
} as const;

/**
 * Progressive stagger animations
 * Used for lists, grids, and sequential elements
 */
export const PROGRESSIVE_STAGGER = {
  about: {
    baseDelay: 0.1, // seconds
    staggerIncrement: 0.08, // seconds per item
  },
  skills: {
    baseDelay: 0.6, // seconds
    staggerIncrement: 0.05, // seconds per item
  },
  contact: {
    fieldBase: 0, // seconds
    fieldIncrement: 0.05, // seconds (0, 0.05, 0.10, 0.15, 0.20...)
  },
  services: {
    baseDelay: 0.15, // seconds
    staggerIncrement: 0.15, // seconds per item (0.15, 0.30, 0.45...)
  },
  bullets: {
    baseDelay: 0.2, // seconds
    staggerIncrement: 0.1, // seconds per bullet
  },
  cards: {
    baseDelay: 0.15, // seconds
    staggerIncrement: 0.1, // seconds per card
  },
} as const;

/**
 * Secondary content delays
 * Used for subheaders, descriptions, and supporting text
 */
export const SECONDARY_DELAYS = {
  immediate: 0, // seconds
  short: 0.1, // seconds
  default: 0.2, // seconds (most common)
  medium: 0.3, // seconds
  long: 0.4, // seconds
  extended: 0.45, // seconds
} as const;

/**
 * CSS transition delays
 * Used for CSS-based animations (not Framer Motion)
 */
export const CSS_TRANSITIONS = {
  viewLayer: {
    delay: 0.3, // seconds
    duration: 0.6, // seconds
  },
  socialView: {
    delay: 0.6, // seconds
  },
} as const;

/**
 * Tooltip delays
 */
export const TOOLTIP = {
  show: 100, // ms
  hide: 0, // ms
} as const;
