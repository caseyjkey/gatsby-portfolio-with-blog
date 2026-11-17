import React, { useEffect, useRef } from 'react';
import {
  buildMobileMorphLinks,
  stepMobileNeighborMorph,
  type MorphLink,
  type MorphMote,
} from '../../animations/mobileAsciiMorph';

// === ASCII greeting particles ===
// Interaction adapted from the devlog~ hero: the rendered word is sampled into
// particles that fly in, settle, flicker between glyphs, and scatter away from
// the pointer. Mobile keeps the same dense glyph field, but instead of
// repainting all ~1300 glyphs every frame it caches the resting word as one
// bitmap and simulates a spring-linked subset of its glyphs. A finger directly
// moves the nearest glyphs; those glyphs pull their neighbors, and the motion
// travels through the word like the desktop field instead of stopping at the
// touch radius. The real heading stays in the DOM for assistive technology and
// reserves its layout box, so nothing shifts.

const SPRING_STRENGTH = 0.04;
const DAMPING = 0.88;
const ALPHA_LERP = 0.04;
// Frame pacing. The particle loop is the only continuously animating thing
// on the page, so it is capped rather than left on an unbounded rAF: mobile
// gets 30fps, and once the particles have settled the idle flicker drops
// further. Both keep the main thread free without visibly changing the effect.
const MOBILE_FPS = 30;
const DESKTOP_FPS = 60;
const MOBILE_SETTLED_FPS = 20;
const DESKTOP_SETTLED_FPS = 30;
const SETTLE_AFTER_SECONDS = 2.5;
// Keep the earlier readable density: a capped field gives the local pointer
// push room to move visible characters without turning the word into noise.
const MAX_DESKTOP_PARTICLES = 1500;
const MAX_MOBILE_PARTICLES = 320;
const GLYPH_SET_DESKTOP = '.:+-=*#@&~<>{}[]|/\\';
// Mobile uses the reference implementation's binary set. It renders lighter
// than a mixed set, but the marks are small and dense enough that the
// letterforms still read correctly, and it keeps the effect cheap on a phone.
const GLYPH_SET_MOBILE = '01';
// Sampling and mark geometry, following the reference implementation: a
// 2px sample step with 5px marks reproduces the letterforms faithfully.
// The previous setup sampled at 3px and then thinned the result down to a
// particle budget, and that thinning is what destroyed the letterforms: an
// evenly strided subset of the sample points no longer traces the strokes,
// so the "e" lost its crossbar and the word turned into lumps.
const MOBILE_SAMPLE_STEP = 4;
const MOBILE_GLYPH_SIZE = 6;
const DESKTOP_SAMPLE_STEP = 4;
const DESKTOP_GLYPH_SIZE = 6;
const MOBILE_BREAKPOINT = 600;
// Mobile touch physics. Direct contact recruits only a small local set, then
// the spring mesh promotes neighbors as displacement reaches them. The larger
// total budget is still bounded, but no longer traps motion beneath a finger.
const MOBILE_MAX_ACTIVE = 500;
const MOBILE_DIRECT_ACTIVE = 52;
const MOBILE_INTERACTION_FPS = 24;
const MOBILE_SIMULATION_STEPS = 6;
const MOBILE_KICK = 1.55;
const MOBILE_REPULSION_SCALE = 1.18;
const MOBILE_RELEASE_DAMPING = 0.82;

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

type MobileGlyphPoint = {
  char: string;
  x: number;
  y: number;
};

type Props = {
  text: string;
};

const thinParticles = (items: Particle[], limit: number) => {
  if (items.length <= limit) return items.slice();
  if (limit <= 0) return [];

  const step = items.length / limit;
  return Array.from({ length: limit }, (_, index) => items[Math.floor(index * step)]);
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

    // A text change tears down and rebuilds the particle field. Remove the
    // previous run's visibility classes before reading the heading color,
    // otherwise the new canvas inherits `color: transparent`.
    container.classList.remove('is-ready');
    heading.classList.remove('is-ascii');

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
    const ink = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')
      .trim() || '#3e64ff';

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const glyphs = isMobile ? GLYPH_SET_MOBILE : GLYPH_SET_DESKTOP;
    const activeFps = isMobile ? MOBILE_FPS : DESKTOP_FPS;
    const settledFps = isMobile ? MOBILE_SETTLED_FPS : DESKTOP_SETTLED_FPS;
    const maxParticles = isMobile ? MAX_MOBILE_PARTICLES : MAX_DESKTOP_PARTICLES;
    // Glyph density is derived from the rendered ASCII size, matching the
    // reference implementation's ratio of sample step to font size.
    let sampleStep = 4;
    let glyphSize = 6;
    const repulsionRadius = Math.max(40, fontSize * 1.6);
    const repulsionForce = isMobile ? 5 : 3;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const lines = text.split('\n');

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let lastFrameAt = 0;
    let lastMobileFrameAt = 0;
    // Anchor elapsed time to the rAF clock itself. In some Chromium builds,
    // performance.now() and the callback timestamp use different origins;
    // mixing them leaves every text particle stuck in its faint pre-roll.
    let startedAt = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let previousPointerX = -9999;
    let previousPointerY = -9999;
    let activeContactPointer: number | null = null;
    let pointerVelocityX = 0;
    let pointerVelocityY = 0;
    let mobileStaticLayer: HTMLCanvasElement | null = null;
    const mobileGlyphSprites = new Map<string, HTMLCanvasElement>();
    let mobileGlyphPoints: MobileGlyphPoint[] = [];
    let mobileMorphLinks: MorphLink[] = [];
    let mobileMotes: MorphMote[] = [];
    let inView = true;
    let cancelled = false;

    // Repaint the cached mobile word, fade only the home glyphs that actually
    // moved, then draw those displaced glyphs at their live spring positions.
    // This keeps the response directly under the finger without an eraser
    // hole or a traveling concentric wave.
    const paintMobile = () => {
      if (!mobileStaticLayer) return;

      context.clearRect(0, 0, width, height);
      context.globalAlpha = 1;
      context.drawImage(mobileStaticLayer, 0, 0, width, height);
      if (mobileMotes.length === 0) return;

      context.save();
      context.globalCompositeOperation = 'destination-out';
      for (const mote of mobileMotes) {
        const point = mobileGlyphPoints[mote.pointIndex];
        const sprite = point ? mobileGlyphSprites.get(point.char) : undefined;
        if (!sprite) continue;
        const displacement = Math.hypot(mote.x - point.x, mote.y - point.y);
        context.globalAlpha = Math.min(0.94, 0.45 + displacement / 14);
        context.drawImage(
          sprite,
          point.x,
          point.y - glyphSize * 0.62,
          glyphSize * 0.78,
          glyphSize * 1.24
        );
      }
      context.restore();

      for (const mote of mobileMotes) {
        const point = mobileGlyphPoints[mote.pointIndex];
        const sprite = point ? mobileGlyphSprites.get(point.char) : undefined;
        if (!sprite) continue;
        context.globalAlpha = Math.min(1, 0.64 + Math.hypot(mote.vx, mote.vy) * 0.12);
        context.drawImage(
          sprite,
          mote.x,
          mote.y - glyphSize * 0.62,
          glyphSize * 0.78,
          glyphSize * 1.24
        );
      }
      context.globalAlpha = 1;
    };

    // Apply the direct finger force, then let the linked spring mesh carry
    // that displacement into glyphs outside the touch radius.
    const stepMobileMotes = () => {
      if (mobileMotes.length === 0) return false;

      const radius = repulsionRadius * MOBILE_REPULSION_SCALE;

      for (const mote of mobileMotes) {
        const dx = mote.x - pointerX;
        const dy = mote.y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (pointerX > -1000 && distance < radius) {
          const falloff = (1 - distance / radius) ** 2;
          const angle = distance > 0 ? Math.atan2(dy, dx) : 0;
          mote.vx += Math.cos(angle) * falloff * MOBILE_KICK;
          mote.vy += Math.sin(angle) * falloff * MOBILE_KICK;
        }
        if (pointerX < -1000) {
          mote.vx *= MOBILE_RELEASE_DAMPING;
          mote.vy *= MOBILE_RELEASE_DAMPING;
        }
      }

      for (let step = 0; step < MOBILE_SIMULATION_STEPS; step += 1) {
        mobileMotes = stepMobileNeighborMorph(
          mobileGlyphPoints,
          mobileMorphLinks,
          mobileMotes,
          MOBILE_MAX_ACTIVE,
        );
      }
      return mobileMotes.length > 0;
    };

    // Promote the glyphs under the finger into motes so they can be pushed.
    const disturbMobile = (
      touchX: number,
      touchY: number,
      gestureX: number,
      gestureY: number
    ) => {
      const radius = repulsionRadius * MOBILE_REPULSION_SCALE;
      const candidates: Array<{
        pointIndex: number;
        x: number;
        y: number;
        distance: number;
      }> = [];

      mobileGlyphPoints.forEach((point, pointIndex) => {
        const dx = point.x - touchX;
        const dy = point.y - touchY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < radius) candidates.push({ pointIndex, x: point.x, y: point.y, distance });
      });

      // Only direct-contact glyphs are added here. Neighbor activation happens
      // during the physics step, so the response grows outward continuously.
      candidates.sort((a, b) => a.distance - b.distance);
      for (const candidate of candidates.slice(0, MOBILE_DIRECT_ACTIVE)) {
        const existing = mobileMotes.find((mote) => mote.pointIndex === candidate.pointIndex);
        if (existing) {
          // Already disturbed: reinforce the local pointer-following motion.
          const dx = candidate.x - touchX;
          const dy = candidate.y - touchY;
          const distance = Math.hypot(dx, dy);
          const angle = distance > 0 ? Math.atan2(dy, dx) : 0;
          existing.vx += Math.cos(angle) * MOBILE_KICK * 0.55 + gestureX * 0.12;
          existing.vy += Math.sin(angle) * MOBILE_KICK * 0.55 + gestureY * 0.12;
          continue;
        }
        if (mobileMotes.length >= MOBILE_MAX_ACTIVE) {
          const farthestIndex = mobileMotes.reduce(
            (farthest, mote, index, motes) =>
              Math.hypot(
                mobileGlyphPoints[mote.pointIndex].x - touchX,
                mobileGlyphPoints[mote.pointIndex].y - touchY,
              ) >
              Math.hypot(
                mobileGlyphPoints[motes[farthest].pointIndex].x - touchX,
                mobileGlyphPoints[motes[farthest].pointIndex].y - touchY,
              ) ? index : farthest,
            0,
          );
          const farthestPoint = mobileGlyphPoints[mobileMotes[farthestIndex].pointIndex];
          if (Math.hypot(farthestPoint.x - touchX, farthestPoint.y - touchY) <= candidate.distance) continue;
          mobileMotes.splice(farthestIndex, 1);
        }

        const dx = candidate.x - touchX;
        const dy = candidate.y - touchY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = distance > 0 ? Math.atan2(dy, dx) : 0;
        const falloff = (1 - distance / radius) ** 2;
        mobileMotes.push({
          pointIndex: candidate.pointIndex,
          vx: Math.cos(angle) * MOBILE_KICK * falloff + gestureX * 0.18,
          vy: Math.sin(angle) * MOBILE_KICK * falloff + gestureY * 0.18,
          x: candidate.x,
          y: candidate.y,
        });
      }
    };

    const drawMobile = (now: number) => {
      frame = 0;
      const minFrameTime = 1000 / MOBILE_INTERACTION_FPS;
      if (lastMobileFrameAt !== 0 && now - lastMobileFrameAt < minFrameTime) {
        frame = window.requestAnimationFrame(drawMobile);
        return;
      }
      lastMobileFrameAt = now;
      const active = stepMobileMotes();
      paintMobile();
      if ((active || activeContactPointer !== null) && inView && !document.hidden) {
        frame = window.requestAnimationFrame(drawMobile);
      }
    };

    const startMobile = () => {
      if (!frame) frame = window.requestAnimationFrame(drawMobile);
    };

    const toLocalPoint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width === 0 ? 1 : width / rect.width;
      return {
        x: (clientX - rect.left) * scale,
        y: (clientY - rect.top) * scale,
      };
    };

    const clearPointer = () => {
      pointerX = -9999;
      pointerY = -9999;
      previousPointerX = -9999;
      previousPointerY = -9999;
      pointerVelocityX = 0;
      pointerVelocityY = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerId !== activeContactPointer) return;
      const point = toLocalPoint(event.clientX, event.clientY);
      const gestureX = previousPointerX < -1000 ? 0 : Math.max(-24, Math.min(24, point.x - previousPointerX));
      const gestureY = previousPointerY < -1000 ? 0 : Math.max(-24, Math.min(24, point.y - previousPointerY));
      pointerX = point.x;
      pointerY = point.y;
      pointerVelocityX = gestureX;
      pointerVelocityY = gestureY;
      if (isMobile) {
        disturbMobile(pointerX, pointerY, gestureX, gestureY);
        paintMobile();
        previousPointerX = point.x;
        previousPointerY = point.y;
        startMobile();
      } else {
        previousPointerX = point.x;
        previousPointerY = point.y;
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      activeContactPointer = event.pointerId;
      // Capture keeps the effect alive while the finger drags outside the
      // canvas. It throws if the pointer is already gone, so guard it: a
      // failed capture must never break the tap itself.
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        /* pointer already released; the tap still works without capture */
      }
      handlePointerMove(event);
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') clearPointer();
    };

    const handlePointerRelease = (event: PointerEvent) => {
      if (event.pointerId !== activeContactPointer) return;
      activeContactPointer = null;
      try {
        if (canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }
      } catch {
        /* capture was already released by the browser */
      }

      clearPointer();
      if (isMobile) startMobile();
    };

    const draw = (now: number) => {
      if (startedAt === 0) startedAt = now;
      const elapsed = (now - startedAt) / 1000;

      // Frame pacing: skip the frame entirely when the budget has not elapsed
      // yet, so a slow device burns fewer cycles than a fast one.
      const targetFps = elapsed > SETTLE_AFTER_SECONDS ? settledFps : activeFps;
      const minFrameTime = 1000 / targetFps;
      if (lastFrameAt !== 0 && now - lastFrameAt < minFrameTime) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      const frameDelta = lastFrameAt === 0 ? 1000 / DESKTOP_FPS : now - lastFrameAt;
      const simulationSteps = Math.min(
        4,
        Math.max(1, Math.round(frameDelta / (1000 / DESKTOP_FPS)))
      );
      lastFrameAt = now;

      context.clearRect(0, 0, width, height);
      context.fillStyle = ink;

      for (const particle of particles) {
        const active = Math.max(0, elapsed - particle.delay);

        if (particle.isText && active < 0.01) {
          context.globalAlpha = 0.02;
          context.fillText(particle.char, particle.x, particle.y);
          continue;
        }

        // Keep the original 60fps physics cadence even when paint is paced
        // down. Extra simulation steps are cheap; extra fillText calls are not.
        for (let step = 0; step < simulationSteps; step += 1) {
          particle.vx += (particle.tx - particle.x) * SPRING_STRENGTH;
          particle.vy += (particle.ty - particle.y) * SPRING_STRENGTH;

          const dx = particle.x - pointerX;
          const dy = particle.y - pointerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < repulsionRadius && distance > 0) {
            const falloff = (1 - distance / repulsionRadius) ** 2;
            const push = falloff * repulsionForce;
            particle.vx += (dx / distance) * push + pointerVelocityX * falloff * 0.08;
            particle.vy += (dy / distance) * push + pointerVelocityY * falloff * 0.08;
          }

          particle.vx *= DAMPING;
          particle.vy *= DAMPING;
          particle.x += particle.vx;
          particle.y += particle.vy;
        }
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

      pointerVelocityX *= 0.82;
      pointerVelocityY *= 0.82;
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (isMobile) {
        paintMobile();
        if (mobileMotes.length > 0) startMobile();
        return;
      }
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      lastFrameAt = 0;
      lastMobileFrameAt = 0;
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

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('pointerup', handlePointerRelease);
    canvas.addEventListener('pointercancel', handlePointerRelease);
    canvas.addEventListener('lostpointercapture', handlePointerRelease);

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
      // The reference lets the word span the full column. Capping it at 80%
      // shrank the letterforms and made the strokes ambiguous.
      const availableWidth = Math.max(180, columnWidth);

      // Fit the ASCII block inside the CSS-reserved band so nothing reflows.
      const reservedHeight = wrapper.getBoundingClientRect().height || height;
      const baseTextWidth = Math.max(
        1,
        ...lines.map((line) => measureContext.measureText(line).width),
      );
      const lineHeightRatio = 1.02;
      const bandFontSize = Math.max(16, reservedHeight / (lineHeightRatio * lines.length));
      const bandTextWidth = baseTextWidth * (bandFontSize / fontSize);
      const displayFontSize =
        bandTextWidth > availableWidth
          ? Math.round(bandFontSize * (availableWidth / bandTextWidth))
          : Math.round(bandFontSize);

      // Sample every 2px on mobile and 4px on desktop, matching the
      // reference. Sampling densely and keeping every point is what keeps the
      // letterforms intact.
      sampleStep = isMobile ? MOBILE_SAMPLE_STEP : DESKTOP_SAMPLE_STEP;
      glyphSize = isMobile ? MOBILE_GLYPH_SIZE : DESKTOP_GLYPH_SIZE;

      measureContext.font = `${fontWeight} ${displayFontSize}px ${fontFamily}`;
      if ('letterSpacing' in measureContext) {
        measureContext.letterSpacing = `${letterSpacing === '0px' ? 0 : Number.parseFloat(letterSpacing) * (displayFontSize / fontSize)}px`;
      }
      const scaledTextWidth = Math.max(
        1,
        ...lines.map((line) => Math.ceil(measureContext.measureText(line).width)),
      );
      width = scaledTextWidth;
      height = Math.ceil(displayFontSize * lineHeightRatio * lines.length);

      // Anchor to the full greeting band rather than the plain heading's text
      // width. This keeps both one- and two-line variants truly centered on
      // narrow screens.
      container.style.left = '50%';
      container.style.right = 'auto';
      container.style.top = `${headingBox.top - wrapperBox.top}px`;
      container.style.bottom = 'auto';
      container.style.width = `${width}px`;
      container.style.transform = 'translateX(-50%)';

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
      samplerContext.textAlign = 'center';
      samplerContext.textBaseline = 'middle';
      const lineHeight = displayFontSize * lineHeightRatio;
      lines.forEach((line, index) => {
        const y = lineHeight * (index + 0.5);
        samplerContext.fillText(line, width / 2, y);
      });

      const pixels = samplerContext.getImageData(0, 0, width, height).data;

      if (isMobile) {
        const staticLayer = document.createElement('canvas');
        staticLayer.width = canvas.width;
        staticLayer.height = canvas.height;
        const staticContext = staticLayer.getContext('2d');
        if (!staticContext) return;

        staticContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        staticContext.font = `500 ${glyphSize}px ${fontFamily}`;
        staticContext.textAlign = 'left';
        staticContext.textBaseline = 'middle';
        staticContext.fillStyle = ink;
        staticContext.globalAlpha = 0.98;
        context.font = `500 ${glyphSize}px ${fontFamily}`;
        context.textAlign = 'left';
        context.textBaseline = 'middle';

        for (const glyph of glyphs) {
          const sprite = document.createElement('canvas');
          const spriteWidth = glyphSize * 0.78;
          const spriteHeight = glyphSize * 1.24;
          sprite.width = Math.ceil(spriteWidth * pixelRatio);
          sprite.height = Math.ceil(spriteHeight * pixelRatio);
          const spriteContext = sprite.getContext('2d');
          if (!spriteContext) continue;
          spriteContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          spriteContext.font = `500 ${glyphSize}px ${fontFamily}`;
          spriteContext.textAlign = 'left';
          spriteContext.textBaseline = 'middle';
          spriteContext.fillStyle = ink;
          spriteContext.globalAlpha = 0.98;
          spriteContext.fillText(glyph, 0, spriteHeight / 2);
          mobileGlyphSprites.set(glyph, sprite);
        }

        // Cache a moderate-resolution glyph field; this was the mobile
        // density used by the earlier direct-follow interaction.
        for (let y = 0; y < height; y += sampleStep) {
          for (let x = 0; x < width; x += sampleStep) {
            if (pixels[(y * width + x) * 4 + 3] <= 100) continue;
            const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
            staticContext.fillText(glyph, x, y);
            mobileGlyphPoints.push({ char: glyph, x, y });
          }
        }
        mobileMorphLinks = buildMobileMorphLinks(mobileGlyphPoints, sampleStep);

        mobileStaticLayer = staticLayer;
        startedAt = 0;
        container.classList.add('is-ready');
        heading.classList.add('is-ascii');
        paintMobile();
        return;
      }

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
            targetAlpha: 0.85 + Math.random() * 0.05,
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
            x: x + (Math.random() - 0.5) * width * 0.5,
            y: y + (Math.random() - 0.5) * height * 2.5,
          });
        }
      }

      // Cap desktop particle density. The earlier, lower density makes
      // motion visible without turning the whole greeting into visual noise.
      const dustRatio = 0.15;
      const dustCount = Math.max(20, Math.floor(collected.length * dustRatio));
      const textParticles = thinParticles(collected, maxParticles - dustCount);
      collected.length = 0;
      collected.push(...textParticles);
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

      startedAt = 0;
      container.classList.add('is-ready');
      heading.classList.add('is-ascii');
      start();
    };

    void setup();

    return () => {
      cancelled = true;
      stop();
      container.classList.remove('is-ready');
      heading.classList.remove('is-ascii');
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('pointerup', handlePointerRelease);
      canvas.removeEventListener('pointercancel', handlePointerRelease);
      canvas.removeEventListener('lostpointercapture', handlePointerRelease);
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
