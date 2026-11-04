import React, { useEffect, useRef } from 'react';

// === ASCII greeting particles ===
// Interaction adapted from the devlog~ hero: the rendered word is sampled into
// particles that fly in, settle, flicker between glyphs, and scatter away from
// the pointer. The real heading stays in the DOM for assistive technology and
// keeps reserving its layout box, so nothing on the page shifts.

const SPRING_STRENGTH = 0.04;
const DAMPING = 0.88;
const ALPHA_LERP = 0.04;
const GLYPH_SET_DESKTOP = '.:+-=*#@&~<>{}[]|/\\';
const GLYPH_SET_MOBILE = '01';
const MOBILE_BREAKPOINT = 600;

type Particle = {
  alpha: number;
  char: string;
  delay: number;
  isText: boolean;
  phase: number;
  targetAlpha: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

type Props = {
  text: string;
};

export default function AsciiGreeting({ text }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const heading = headingRef.current;
    if (!wrapper || !container || !canvas || !heading) return undefined;

    // Reduced motion keeps the plain heading and never starts the effect.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const headingStyle = window.getComputedStyle(heading);
    const fontSize = Number.parseFloat(headingStyle.fontSize) || 36;
    const fontFamily = headingStyle.fontFamily || 'monospace';
    const fontWeight = headingStyle.fontWeight || '600';
    const letterSpacing =
      headingStyle.letterSpacing === 'normal' ? '0px' : headingStyle.letterSpacing;
    const ink = headingStyle.color;

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const glyphs = isMobile ? GLYPH_SET_MOBILE : GLYPH_SET_DESKTOP;
    // Glyph density is derived from the rendered ASCII size, matching the
    // reference implementation's ratio of sample step to font size.
    let sampleStep = 4;
    let glyphSize = 6;
    const repulsionRadius = Math.max(40, fontSize * 1.6);
    const repulsionForce = isMobile ? 5 : 3;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let startedAt = performance.now();
    let pointerX = -9999;
    let pointerY = -9999;
    let inView = true;
    let cancelled = false;

    const toLocalPoint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width === 0 ? 1 : width / rect.width;
      return {
        x: (clientX - rect.left) * scale,
        y: (clientY - rect.top) * scale,
      };
    };

    const handlePointerMove = (event: MouseEvent) => {
      const point = toLocalPoint(event.clientX, event.clientY);
      pointerX = point.x;
      pointerY = point.y;
    };

    const handlePointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const point = toLocalPoint(touch.clientX, touch.clientY);
      pointerX = point.x;
      pointerY = point.y;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const point = toLocalPoint(touch.clientX, touch.clientY);
      pointerX = point.x;
      pointerY = point.y;
    };

    const handleTouchEnd = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    const draw = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      context.clearRect(0, 0, width, height);
      context.fillStyle = ink;

      for (const particle of particles) {
        const active = Math.max(0, elapsed - particle.delay);

        if (particle.isText && active < 0.01) {
          context.globalAlpha = 0.02;
          context.fillText(particle.char, particle.x, particle.y);
          continue;
        }

        particle.vx += (particle.tx - particle.x) * SPRING_STRENGTH;
        particle.vy += (particle.ty - particle.y) * SPRING_STRENGTH;

        const dx = particle.x - pointerX;
        const dy = particle.y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius && distance > 0) {
          const push = ((1 - distance / repulsionRadius) ** 2) * repulsionForce;
          particle.vx += (dx / distance) * push;
          particle.vy += (dy / distance) * push;
        }

        particle.vx *= DAMPING;
        particle.vy *= DAMPING;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha += (particle.targetAlpha - particle.alpha) * ALPHA_LERP;

        if (particle.isText) {
          particle.alpha = particle.targetAlpha + Math.sin(elapsed * 0.8 + particle.phase) * 0.08;
          if (active < 0.8 || Math.random() < 0.0008) {
            particle.char = glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        } else {
          particle.tx += (Math.random() - 0.5) * 0.2;
          particle.ty += (Math.random() - 0.5) * 0.2;
          if (particle.x < -20) particle.x = particle.tx = width + 10;
          if (particle.x > width + 20) particle.x = particle.tx = -10;
          if (particle.y < -20) particle.y = particle.ty = height + 10;
          if (particle.y > height + 20) particle.y = particle.ty = -10;
          if (Math.random() < 0.003) {
            particle.char = glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }

        context.globalAlpha = Math.max(0, particle.alpha);
        context.fillText(particle.char, particle.x, particle.y);
      }

      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    canvas.addEventListener('mousemove', handlePointerMove, { passive: true });
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    const setup = async () => {
      await document.fonts.ready;
      if (cancelled) return;

      const measureCanvas = document.createElement('canvas');
      const measureContext = measureCanvas.getContext('2d');
      if (!measureContext) return;

      measureContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      if ('letterSpacing' in measureContext) {
        measureContext.letterSpacing = letterSpacing;
      }

      // Scale the greeting up so it reads as ASCII art instead of a few faint
      // marks, the same way the reference fills its canvas with the word.
      const headingBox = heading.getBoundingClientRect();
      const wrapperBox = wrapper.getBoundingClientRect();
      const columnWidth = wrapper.parentElement?.getBoundingClientRect().width ?? wrapperBox.width;
      const availableWidth = Math.max(180, Math.min(columnWidth * 0.8, 460));

      // Fit the ASCII block inside the CSS-reserved band so nothing reflows.
      const reservedHeight = wrapper.getBoundingClientRect().height || height;
      const baseMetrics = measureContext.measureText(text);
      const baseTextWidth = Math.max(1, baseMetrics.width);
      const bandFontSize = Math.max(16, reservedHeight / 1.3);
      const bandTextWidth = baseTextWidth * (bandFontSize / fontSize);
      const displayFontSize =
        bandTextWidth > availableWidth
          ? Math.round(bandFontSize * (availableWidth / bandTextWidth))
          : Math.round(bandFontSize);

      sampleStep = Math.max(1, Math.round(displayFontSize / 20));
      glyphSize = Math.max(3, Math.round(displayFontSize / 13));

      measureContext.font = `${fontWeight} ${displayFontSize}px ${fontFamily}`;
      if ('letterSpacing' in measureContext) {
        measureContext.letterSpacing = `${letterSpacing === '0px' ? 0 : Number.parseFloat(letterSpacing) * (displayFontSize / fontSize)}px`;
      }
      const displayMetrics = measureContext.measureText(text);
      const scaledTextWidth = Math.max(1, Math.ceil(displayMetrics.width));
      width = scaledTextWidth;
      height = Math.ceil(displayFontSize * 1.3);

      // Center the wider ASCII block on the greeting it replaces.
      const headingCenterX = headingBox.left + headingBox.width / 2;
      container.style.left = `${headingCenterX - width / 2 - wrapperBox.left}px`;
      container.style.top = `${headingBox.top - wrapperBox.top}px`;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      // Sample the rendered word so each opaque pixel becomes a particle target.
      const sampler = document.createElement('canvas');
      sampler.width = width;
      sampler.height = height;
      const samplerContext = sampler.getContext('2d');
      if (!samplerContext) return;

      samplerContext.font = `${fontWeight} ${displayFontSize}px ${fontFamily}`;
      if ('letterSpacing' in samplerContext) {
        samplerContext.letterSpacing = `${letterSpacing === '0px' ? 0 : Number.parseFloat(letterSpacing) * (displayFontSize / fontSize)}px`;
      }
      samplerContext.fillStyle = '#ffffff';
      samplerContext.textAlign = 'left';
      samplerContext.textBaseline = 'middle';
      samplerContext.fillText(text, 0, height / 2);

      const pixels = samplerContext.getImageData(0, 0, width, height).data;
      const collected: Particle[] = [];

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          if (pixels[(y * width + x) * 4 + 3] <= 100) continue;
          collected.push({
            alpha: 0,
            char: glyphs[Math.floor(Math.random() * glyphs.length)],
            delay: (x / width) * 1.2,
            isText: true,
            phase: Math.random() * Math.PI * 2,
            targetAlpha: 0.85 + Math.random() * 0.15,
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
            x: x + (Math.random() - 0.5) * width * 0.5,
            y: y + (Math.random() - 0.5) * height * 2.5,
          });
        }
      }

      const dustCount = Math.max(30, Math.floor(collected.length * 0.15));
      for (let index = 0; index < dustCount; index += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        collected.push({
          alpha: 0,
          char: glyphs[Math.floor(Math.random() * glyphs.length)],
          delay: Math.random() * 0.6,
          isText: false,
          phase: Math.random() * Math.PI * 2,
          targetAlpha: 0.04 + Math.random() * 0.07,
          tx: x,
          ty: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          x,
          y,
        });
      }

      particles = collected;

      context.font = `500 ${glyphSize}px ${fontFamily}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      startedAt = performance.now();
      container.classList.add('is-ready');
      heading.classList.add('is-ascii');
      start();
    };

    void setup();

    return () => {
      cancelled = true;
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseleave', handlePointerLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [text]);

  return (
    <div className="hero-greeting" ref={wrapperRef}>
      <div className="ascii-hero" ref={containerRef} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      <h3 className="hero-subheader" ref={headingRef}>
        {text}
      </h3>
    </div>
  );
}
