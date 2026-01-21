import React, { useRef, useEffect, forwardRef, useState } from 'react';
import { AccordionBody } from 'reactstrap';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ACCORDION, ANIMATION_CONFIG } from '../../animations/config';
import { fadeInUpVariants } from '../../animations';
import { useInView } from 'react-intersection-observer';

interface AnimatedAccordionBodyProps {
  accordionId: string;
  children: React.ReactNode;
  isOpen: boolean;
  isScrolling: boolean;
}

const StyledAccordionBody = styled(AccordionBody)`
  padding: 0 !important;

  .accordion-body {
    padding-left: 0;
  }
`;

export const AnimatedAccordionBody = forwardRef<HTMLDivElement, AnimatedAccordionBodyProps>(
  ({ accordionId, children, isOpen, isScrolling }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [animatedEntries, setAnimatedEntries] = useState(new Set<number>());

    useEffect(() => {
      if (!isOpen) {
        const timer = setTimeout(() => {
          setAnimatedEntries(new Set<number>());
        }, ACCORDION.expansionDelay);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    return (
      <StyledAccordionBody accordionId={accordionId}>
        <div ref={ref || containerRef}>
          {React.Children.map(children, (child, index) => (
            <AccordionAnimatedChild
              key={`${accordionId}-${index}`}
              index={index}
              isOpen={isOpen}
              isScrolling={isScrolling}
              hasAnimated={animatedEntries.has(index)}
              onAnimationComplete={() => {
                setAnimatedEntries(prev => new Set(prev).add(index));
              }}
            >
              {child}
            </AccordionAnimatedChild>
          ))}
        </div>
      </StyledAccordionBody>
    );
  }
);

const AccordionAnimatedChild = ({
  children,
  index,
  isOpen,
  isScrolling,
  hasAnimated,
  onAnimationComplete,
}: {
  children: React.ReactNode;
  index: number;
  isOpen: boolean;
  isScrolling: boolean;
  hasAnimated: boolean;
  onAnimationComplete: () => void;
}) => {
  const { ref, inView, entry } = useInView({
    threshold: 0.1,
    rootMargin: ANIMATION_CONFIG.rootMargin,
    triggerOnce: true,
  });

  const [wasVisible, setWasVisible] = useState(false);
  const [position, setPosition] = useState<'above' | 'in' | 'below'>('below');

  useEffect(() => {
    if (isOpen && !isScrolling && !hasAnimated) {
      const timer = setTimeout(() => {
        if (entry) {
          const rect = entry.boundingClientRect;
          if (rect.bottom < 0) {
            setPosition('above');
          } else if (rect.top < window.innerHeight) {
            setPosition('in');
          } else {
            setPosition('below');
          }
        }
      }, ACCORDION.scrollSettleTime);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isScrolling, hasAnimated, entry]);

  useEffect(() => {
    if (inView && !wasVisible) {
      setWasVisible(true);
    }
  }, [inView, wasVisible]);

  const shouldAnimate = isOpen && !isScrolling && !hasAnimated && wasVisible;
  const initial = (hasAnimated || position === 'above') ? 'visible' : 'hidden';
  const animate = shouldAnimate ? 'visible' : initial;
  
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      variants={fadeInUpVariants}
      custom={{
        delay: index * ACCORDION.staggerDelay,
        distance: ACCORDION.contentLift,
      }}
      onAnimationComplete={onAnimationComplete}
      style={index === 0 ? { marginTop: '10px' } : undefined}
    >
      {children}
    </motion.div>
  );
};