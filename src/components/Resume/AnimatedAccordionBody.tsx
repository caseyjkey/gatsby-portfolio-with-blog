import React, { useRef, useEffect, forwardRef } from 'react'
import { AccordionBody } from 'reactstrap'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { ANIMATION_CONFIG, ACCORDION, EASING } from '../../animations/config'

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
    const [shouldAnimate, setShouldAnimate] = React.useState(false);

    // Check if mobile
    const isMobile = () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
    };

    useEffect(() => {
      const checkState = () => {
        // The show class is on .accordion-collapse (grandparent of our div)
        const accordionCollapse = containerRef.current?.parentElement?.parentElement;
        if (accordionCollapse && accordionCollapse.classList.contains('accordion-collapse')) {
          const hasShowClass = accordionCollapse.classList.contains('show');

          if (hasShowClass && !isOpen) {
            // Accordion just opened
            setIsOpen(true);
            setShouldAnimate(true);
            setAnimationKey(prev => prev + 1);
          } else if (!hasShowClass && isOpen) {
            // Accordion just closed
            setIsOpen(false);
            setShouldAnimate(false);
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
            <motion.div
              key={`${animationKey}-${index}`}
              initial={{ opacity: 0, y: ACCORDION.contentLift }}
              animate={{
                opacity: shouldAnimate ? 1 : 0,
                y: shouldAnimate ? 0 : ACCORDION.contentLift,
              }}
              transition={{
                duration: ACCORDION.duration,
                delay: shouldAnimate ? index * ACCORDION.staggerDelay : 0,
                ease: EASING.standard,
              }}
              style={index === 0 ? { marginTop: '10px' } : undefined}
            >
              {child}
            </motion.div>
          ))}
        </div>
      </StyledAccordionBody>
    )
  }
)
