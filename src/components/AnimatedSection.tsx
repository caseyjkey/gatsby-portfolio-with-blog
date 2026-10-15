import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ANIMATION_CONFIG } from '../animations/config';
import { fadeInUpVariants } from '../animations/transitions/fadeInUp';
import { getScrollAnimationTimingScale, trackScrollVelocity } from '../animations/scrollVelocity';

type Props = {
  children: ReactNode;
  delay?: number;       // in seconds, default 0
  duration?: number;    // in ms, default from ANIMATION_CONFIG
  once?: boolean;       // default true
  className?: string;
  rootMargin?: string;  // default from ANIMATION_CONFIG
};

export default function AnimatedSection({
  children,
  delay = 0,
  duration = ANIMATION_CONFIG.defaultDuration,
  once = true,
  className,
  rootMargin = ANIMATION_CONFIG.rootMargin,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [timing, setTiming] = useState({ delay, duration: duration / 1000 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stopTrackingScrollVelocity = trackScrollVelocity();

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return stopTrackingScrollVelocity;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timingScale = getScrollAnimationTimingScale();
          setTiming({
            delay: delay * timingScale,
            duration: (duration / 1000) * timingScale,
          });
          setIsInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      stopTrackingScrollVelocity();
    };
  }, [delay, duration, once, rootMargin]);

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
