import React, { useRef, forwardRef } from 'react';
import { AccordionBody } from 'reactstrap';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ACCORDION } from '../../animations/config';
import { fadeInUpVariants } from '../../animations';
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation';

interface AnimatedAccordionBodyProps {
  accordionId: string;
  children: React.ReactNode;
  isOpen: boolean;
  isScrolling: boolean;
  animatedEntries: Set<number>;
  updateAnimatedEntries: (accordionId: string, entryIndex: number) => void;
}

const StyledAccordionBody = styled(AccordionBody)`
  padding: 0 !important;

  .accordion-body {
    padding-left: 0;
  }
`;

export const AnimatedAccordionBody = forwardRef<HTMLDivElement, AnimatedAccordionBodyProps>(
  ({ accordionId, children, isOpen, isScrolling, animatedEntries, updateAnimatedEntries }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
      <StyledAccordionBody accordionId={accordionId}>
        <div ref={ref || containerRef}>
          {React.Children.map(children, (child, index) => (
            <AccordionAnimatedChild
              key={`${accordionId}-${index}`}
              accordionId={accordionId}
              index={index}
              isOpen={isOpen}
              isScrolling={isScrolling}
              hasAnimated={animatedEntries.has(index)}
              onAnimationComplete={() => {
                updateAnimatedEntries(accordionId, index);
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
  accordionId,
  index,
  isOpen,
  isScrolling,
  hasAnimated,
  onAnimationComplete,
}: {
  children: React.ReactNode;
  accordionId: string;
  index: number;
  isOpen: boolean;
  isScrolling: boolean;
  hasAnimated: boolean;
  onAnimationComplete: () => void;
}) => {
  const { ref, isInView, position } = useInViewAnimation({
    enabled: isOpen && !isScrolling && !hasAnimated,
  });

  const shouldAnimate = isInView && !hasAnimated;
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