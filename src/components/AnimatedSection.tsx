import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ANIMATION_CONFIG } from '../animations/config';
import { fadeInUpVariants } from '../animations/transitions/fadeInUp';
import { getScrollAnimationTimingScale, trackScrollVelocity } from '../animations/scrollVelocity';

type Props = {
  children: ReactNode;
  delay?: number;       // in seconds, default 0
  initialViewportDelay?: number; // stagger used only for the initial visible batch
  duration?: number;    // in ms, default from ANIMATION_CONFIG
  once?: boolean;       // default true
  className?: string;
  rootMargin?: string;  // default from ANIMATION_CONFIG
  threshold?: number;
  trackViewportEdges?: boolean;
};

export default function AnimatedSection({
  children,
  delay = 0,
  initialViewportDelay,
  duration = ANIMATION_CONFIG.defaultDuration,
  once = true,
  className,
  rootMargin = ANIMATION_CONFIG.rootMargin,
  threshold = 0.1,
  trackViewportEdges = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [timing, setTiming] = useState({ delay, duration: duration / 1000 });

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement) return;
    const el: HTMLDivElement = currentElement;
    const stopTrackingScrollVelocity = trackScrollVelocity();
    let observer: IntersectionObserver | undefined;
    let directCheckFrame = 0;
    let isRevealed = false;

    function stopDirectTracking() {
      window.removeEventListener('scroll', scheduleDirectCheck);
      window.removeEventListener('resize', scheduleDirectCheck);
      if (directCheckFrame) cancelAnimationFrame(directCheckFrame);
      directCheckFrame = 0;
    }

    const reveal = (animationDelay: number) => {
      if (once && isRevealed) return;
      isRevealed = true;
      const timingScale = getScrollAnimationTimingScale();
      setTiming({
        delay: animationDelay * timingScale,
        duration: (duration / 1000) * timingScale,
      });
      setIsInView(true);
      if (once) {
        observer?.unobserve(el);
        stopDirectTracking();
      }
    };

    function checkActualViewport() {
      directCheckFrame = 0;
      const rect = el.getBoundingClientRect();
      if (rect.bottom <= 0 || (rect.top < window.innerHeight && rect.bottom > 0)) {
        reveal(delay);
      }
    }

    function scheduleDirectCheck() {
      if (!directCheckFrame) directCheckFrame = requestAnimationFrame(checkActualViewport);
    }

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return stopTrackingScrollVelocity;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        // If layout/auto-scroll moved the element above the waypoint before the
        // observer sampled an intersection, reveal it instead of leaving a hole.
        if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
          reveal(delay);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    const initialRect = el.getBoundingClientRect();
    const initiallyInViewport = initialRect.top < window.innerHeight && initialRect.bottom > 0;
    const initiallyAboveViewport = initialRect.bottom <= 0;

    if (initiallyInViewport || initiallyAboveViewport) {
      reveal(initialViewportDelay ?? delay);
      if (!once) observer.observe(el);
    } else {
      observer.observe(el);
      if (trackViewportEdges) {
        window.addEventListener('scroll', scheduleDirectCheck, { passive: true });
        window.addEventListener('resize', scheduleDirectCheck);
      }
    }
    return () => {
      observer.disconnect();
      stopDirectTracking();
      stopTrackingScrollVelocity();
    };
  }, [delay, duration, initialViewportDelay, once, rootMargin, threshold, trackViewportEdges]);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUpVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={timing}
      className={className}
    >
      {children}
    </motion.div>
  );
}
