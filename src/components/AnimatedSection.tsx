import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ANIMATION_CONFIG, SECONDARY_DELAYS } from '../animations/config';
import { fadeInUpVariants } from '../animations/transitions/fadeInUp';

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUpVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
