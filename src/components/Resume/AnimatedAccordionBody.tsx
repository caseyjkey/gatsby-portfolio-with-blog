import React, { useRef, useEffect, forwardRef } from 'react'
import { AccordionBody } from 'reactstrap'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { ACCORDION } from '../../animations/config'
import { fadeInUpVariants } from '../../animations'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'

interface AnimatedAccordionBodyProps {
  accordionId: string
  children: React.ReactNode
}

const StyledAccordionBody = styled(AccordionBody)`
  padding: 0 !important;

  .accordion-body {
    padding-left: 0;
  }
`

export const AnimatedAccordionBody = forwardRef<HTMLDivElement, AnimatedAccordionBodyProps>(
  ({ accordionId, children }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [animationKey, setAnimationKey] = React.useState(0);

    useEffect(() => {
      const checkState = () => {
        // The show class is on .accordion-collapse (grandparent of our div)
        const accordionCollapse = containerRef.current?.parentElement?.parentElement;
        if (accordionCollapse && accordionCollapse.classList.contains('accordion-collapse')) {
          const hasShowClass = accordionCollapse.classList.contains('show');

          if (hasShowClass && !isOpen) {
            // Accordion just opened
            setIsOpen(true);
            setAnimationKey(prev => prev + 1);
          } else if (!hasShowClass && isOpen) {
            // Accordion just closed
            setIsOpen(false);
          }
        }
      };

      const observer = new MutationObserver(() => {
        checkState();
      });

      if (containerRef.current) {
        // Observe the grandparent .accordion-collapse element for class changes
        const accordionCollapse = containerRef.current.parentElement?.parentElement;
        if (accordionCollapse) {
          observer.observe(accordionCollapse, {
            attributes: true,
            attributeFilter: ['class']
          });

          // Check initial state immediately
          checkState();
        }
      }

      return () => observer.disconnect();
    }, [accordionId, isOpen]);

    return (
      <StyledAccordionBody accordionId={accordionId}>
        <div ref={ref || containerRef}>
          {React.Children.map(children, (child, index) => (
            <AccordionAnimatedChild
              key={`${animationKey}-${index}`}
              index={index}
              isOpen={isOpen}
            >
              {child}
            </AccordionAnimatedChild>
          ))}
        </div>
      </StyledAccordionBody>
    )
  }
)

const AccordionAnimatedChild = ({
  children,
  index,
  isOpen,
}: {
  children: React.ReactNode;
  index: number;
  isOpen: boolean;
}) => {
  const { ref, isInView, position } = useInViewAnimation({
    skipAboveViewport: true,
    once: true,
  });

  const shouldShow = isOpen && (position === 'above' || isInView);

  return (
    <motion.div
      ref={ref}
      initial={position === 'above' ? false : 'hidden'}
      animate={shouldShow ? 'visible' : 'hidden'}
      custom={{
        delay: index * ACCORDION.staggerDelay,
        distance: ACCORDION.contentLift,
      }}
      variants={fadeInUpVariants}
      style={index === 0 ? { marginTop: '10px' } : undefined}
    >
      {children}
    </motion.div>
  );
};
