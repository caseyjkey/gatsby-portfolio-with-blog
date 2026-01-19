import React, { useRef, useEffect, forwardRef } from 'react'
import { AccordionBody } from 'reactstrap'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { ACCORDION } from '../../animations/config'
import { fadeInUpVariants } from '../../animations'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'

// Track which accordions are currently open
const openAccordions = new Set<string>();

interface AnimatedAccordionBodyProps {
  accordionId: string
  children: React.ReactNode
}

// Track animation state per accordion globally (persists across close/re-open)
const accordionAnimationState = new Map<string, Set<number>>();

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

    // Initialize state for this accordion if not exists
    if (!accordionAnimationState.has(accordionId)) {
      accordionAnimationState.set(accordionId, new Set());
    }

    useEffect(() => {
      const checkState = () => {
        // The show class is on .accordion-collapse (grandparent of our div)
        const accordionCollapse = containerRef.current?.parentElement?.parentElement;
        if (accordionCollapse && accordionCollapse.classList.contains('accordion-collapse')) {
          const hasShowClass = accordionCollapse.classList.contains('show');

          if (hasShowClass && !isOpen) {
            // Accordion just opened - mark it as open to allow animations to trigger
            setIsOpen(true);
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

    const childCount = React.Children.count(children);

    return (
      <StyledAccordionBody accordionId={accordionId}>
        <div ref={ref || containerRef}>
          {React.Children.map(children, (child, index) => (
            <AccordionAnimatedChild
              key={`${accordionId}-${index}`}
              accordionId={accordionId}
              index={index}
              isOpen={isOpen}
              childCount={childCount}
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
  accordionId,
  index,
  isOpen,
  childCount,
}: {
  children: React.ReactNode;
  accordionId: string;
  index: number;
  isOpen: boolean;
  childCount: number;
}) => {
  const animatedEntries = accordionAnimationState.get(accordionId) || new Set();
  const hasAlreadyAnimated = animatedEntries.has(index);
  const entryRef = useRef<HTMLDivElement>(null);

  // Track if this entry should be visible (for scroll-triggered animations)
  const [isInView, setIsInView] = React.useState(false);
  const [position, setPosition] = React.useState<'above' | 'in' | 'below' | 'unknown'>('unknown');

  // Set up IntersectionObserver when accordion is open and entry hasn't animated yet
  React.useEffect(() => {
    if (!isOpen || hasAlreadyAnimated || !entryRef.current) return;

    // Wait for accordion to expand (350ms) + stagger delay before setting up observer
    const totalDelay = 350 + (index * ACCORDION.staggerDelay * 1000);

    const timer = setTimeout(() => {
      if (!entryRef.current) return;

      // Check initial position
      const rect = entryRef.current.getBoundingClientRect();
      let initialPos: 'above' | 'in' | 'below';
      if (rect.bottom < 0) initialPos = 'above';
      else if (rect.top < window.innerHeight) initialPos = 'in';
      else initialPos = 'below';

      setPosition(initialPos);

      // If above or in viewport, mark as in view (will animate immediately)
      if (initialPos === 'above' || initialPos === 'in') {
        setIsInView(true);
        return; // Don't set up observer if already in/above viewport
      }

      // Set up IntersectionObserver for entries below viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0, rootMargin: '0px' }
      );

      observer.observe(entryRef.current);

      return () => observer.disconnect();
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [isOpen, index, hasAlreadyAnimated]);

  // Track when animation completes
  const handleAnimationComplete = () => {
    if (!hasAlreadyAnimated) {
      animatedEntries.add(index);
    }
  };

  // Determine if entry should be shown
  // - Already animated: show immediately
  // - Above viewport (already scrolled past): show immediately
  // - In viewport after stagger: show and animate
  // - Below viewport: DON'T show yet - wait for scroll
  const shouldShow = isOpen && (hasAlreadyAnimated || position === 'above' || isInView);

  // If already animated, skip animation - show immediately
  // If not animated, animate in when viewport conditions are met
  const shouldAnimate = !hasAlreadyAnimated && (position !== 'above');

  return (
    <motion.div
      ref={entryRef}
      initial={shouldAnimate ? 'hidden' : false}
      animate={shouldShow ? 'visible' : 'hidden'}
      onAnimationComplete={handleAnimationComplete}
      variants={shouldAnimate ? fadeInUpVariants : undefined}
      custom={{
        delay: 0, // No additional delay - timing is handled by when shouldShow becomes true
        distance: ACCORDION.contentLift,
      }}
      style={index === 0 ? { marginTop: '10px' } : undefined}
    >
      {children}
    </motion.div>
  );
};
