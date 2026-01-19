import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { fadeInUpVariants } from '../animations';
import { ANIMATION_CONFIG, TIMING, STAGGER } from '../animations/config';
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation';
import { useAnimationContext } from './AnimationContext';

interface AnimatedSectionProps {
  children: React.ReactNode;
  index: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, index }) => {
  const { isCalculated, shouldDelayForHeader, initialBatchCount } = useAnimationContext();
  
  const { ref, isInView, position } = useInViewAnimation({
    rootMargin: ANIMATION_CONFIG.rootMargin,
    skipAboveViewport: true,
  });

  const isInitialBatch = isCalculated && index < initialBatchCount;
  
  let delay = 0;
  if (isInitialBatch) {
    const baseDelay = shouldDelayForHeader ? 0.5 : 0;
    const staggerDelay = index * (STAGGER / 1000);
    delay = baseDelay + staggerDelay;
  }

  const animateState = isCalculated && isInView ? 'visible' : 'hidden';

  return (
    <motion.div
      ref={ref}
      className="animated-section"
      initial={position === 'above' ? false : 'hidden'}
      animate={animateState}
      custom={{ delay, distance: TIMING.primaryUnit.distance }}
      variants={fadeInUpVariants}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;