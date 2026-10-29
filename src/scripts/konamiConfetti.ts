type Particle = {
  color: string;
  height: number;
  rotation: number;
  rotationSpeed: number;
  velocityX: number;
  velocityY: number;
  width: number;
  x: number;
  y: number;
};

const COLORS = ['#0d6efd', '#43a5ff', '#ffc857', '#ff5f6d', '#52d273', '#ffffff'];
const EFFECT_DURATION_MS = 2200;

let activeCleanup: (() => void) | undefined;

export function launchConfetti(): void {
  activeCleanup?.();

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    inset: '0',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: '2147483647',
  });
  document.body.appendChild(canvas);

  let animationFrame = 0;
  let cleanupTimer = 0;
  let width = 0;
  let height = 0;

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = reducedMotion ? 45 : Math.min(140, Math.max(80, Math.round(width / 9)));
  const particles: Particle[] = Array.from({ length: particleCount }, (_, index) => {
    const angle = Math.random() * Math.PI - Math.PI;
    const speed = 7 + Math.random() * 11;

    return {
      color: COLORS[index % COLORS.length],
      height: 5 + Math.random() * 7,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.35,
      velocityX: Math.sin(angle) * speed,
      velocityY: Math.cos(angle) * speed - 5,
      width: 4 + Math.random() * 6,
      x: width / 2 + (Math.random() - 0.5) * Math.min(width * 0.18, 120),
      y: height * 0.42,
    };
  });

  const startedAt = performance.now();
  const duration = reducedMotion ? 700 : EFFECT_DURATION_MS;

  const cleanup = () => {
    window.cancelAnimationFrame(animationFrame);
    window.clearTimeout(cleanupTimer);
    window.removeEventListener('resize', resize);
    canvas.remove();
    if (activeCleanup === cleanup) activeCleanup = undefined;
  };

  activeCleanup = cleanup;
  cleanupTimer = window.setTimeout(cleanup, duration + 250);

  const draw = (now: number) => {
    const elapsed = now - startedAt;
    const opacity = Math.max(0, 1 - elapsed / duration);
    context.clearRect(0, 0, width, height);
    context.globalAlpha = opacity;

    for (const particle of particles) {
      particle.velocityY += 0.22;
      particle.velocityX *= 0.992;
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.rotation += particle.rotationSpeed;

      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;
      context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
      context.restore();
    }

    if (elapsed < duration) {
      animationFrame = window.requestAnimationFrame(draw);
    } else {
      cleanup();
    }
  };

  animationFrame = window.requestAnimationFrame(draw);
}
