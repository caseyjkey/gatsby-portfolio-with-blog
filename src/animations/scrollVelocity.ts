const MIN_TIMING_SCALE = 0.35;
const MAX_TIMING_SCALE = 1;
const MAX_SPEED_PX_PER_SECOND = 2400;
const IDLE_RESET_MS = 160;

let subscriberCount = 0;
let animationFrame = 0;
let lastY = 0;
let lastSampleTime = 0;
let lastScrollTime = 0;
let smoothedSpeed = 0;

function sampleScroll() {
  animationFrame = 0;
  const now = performance.now();
  const y = window.scrollY;

  if (lastSampleTime > 0) {
    const elapsedSeconds = Math.max((now - lastSampleTime) / 1000, 0.001);
    const instantaneousSpeed = Math.abs(y - lastY) / elapsedSeconds;
    smoothedSpeed = smoothedSpeed * 0.55 + instantaneousSpeed * 0.45;
  }

  lastY = y;
  lastSampleTime = now;
  lastScrollTime = now;
}

function handleScroll() {
  if (!animationFrame) animationFrame = requestAnimationFrame(sampleScroll);
}

export function trackScrollVelocity() {
  subscriberCount += 1;

  if (subscriberCount === 1) {
    lastY = window.scrollY;
    lastSampleTime = performance.now();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  return () => {
    subscriberCount = Math.max(0, subscriberCount - 1);
    if (subscriberCount === 0) {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      smoothedSpeed = 0;
    }
  };
}

export function getScrollAnimationTimingScale() {
  if (performance.now() - lastScrollTime > IDLE_RESET_MS) return MAX_TIMING_SCALE;

  return getTimingScaleForSpeed(smoothedSpeed);
}

export function getTimingScaleForSpeed(speedPxPerSecond: number) {
  const normalizedSpeed = Math.min(Math.max(speedPxPerSecond, 0) / MAX_SPEED_PX_PER_SECOND, 1);
  return Math.max(MIN_TIMING_SCALE, MAX_TIMING_SCALE - normalizedSpeed * 0.65);
}
