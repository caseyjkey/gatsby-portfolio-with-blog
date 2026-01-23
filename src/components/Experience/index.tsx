import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from '../style'
import { experienceData } from '../../data/experience'
import { lighten } from 'polished'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../../animations'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG, TIMING, TIMELINE, EASING, SECONDARY_DELAYS } from '../../animations/config'
import { isSectionHeaderVisible } from '../../animations/utils/headerVisibility'

const ExperienceSection = styled.section`
  position: relative;
  @media (max-width: 767.98px) {
    padding: 6em 0;
  }
  padding: 6em 0;
  background-color: ${(props) => props.theme.white};
`

const TimelineContainer = styled.div`
  max-width: 900px;
  position: relative;

  @media (min-width: 768px) {
    margin-left: -3.6rem;
  }
`

const VerticalLine = styled.div`
  /* Map the height to the CSS variable */
  height: var(--line-height, 0px);
  transition: height 0.15s linear;
  will-change: height;
  position: absolute;
  left: 78px;
  top: 1px;
  width: 2px;
  background: linear-gradient(
    to bottom,
    #3e64ff 0%,
    #3e64ff calc(100% - 20px),
    rgba(62, 100, 255, 0) 100%
  );

  @media (max-width: 767.98px) {
    left: 69px;
  }
`

const TimelineRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.$isLast ? '0' : '3rem'};
  position: relative;

  ${props => props.$isLast && `
    &::after {
      content: '';
      position: absolute;
      left: 76px;
      top: calc(2.5rem + 5px);
      bottom: -50px;
      width: 8px;
      background-color: ${props.theme.white};
      z-index: 1;

      @media (max-width: 767.98px) {
        left: 57px;
        top: calc(2rem + 4px);
      }
    }
  `}
`

const Year = styled.div`
  min-width: 60px;
  text-align: right;
  padding-right: 0.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.black};
  font-size: 1.1rem;

  margin-top: 5px;
  @media (max-width: 767.98px) {
    margin-top: 3px;
    min-width: 50px;
    padding-right: 1.5rem;
    font-size: 1rem;
  }
`

const TimelineDot = styled.div<{ animate?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.primaryColor};
  left: -18px;
  position: absolute;
  z-index: 2;
  flex-shrink: 0;

  @media (max-width: 767.98px) {
    left: -14px;
    width: 2rem;
    height: 2rem;
  }
`

const TimelineDotWrapper = styled.div`
  position: absolute;
  left: 77px;
  top: 0;
  transform: translateX(-50%);

  @media (max-width: 767.98px) {
    left: 68px;
  }
`

const Content = styled.div`
  flex: 1;
  padding-left: 3.5rem;
  min-width: 0;
  padding-top: 0.1rem;

  @media (max-width: 767.98px) {
    padding-left: 3rem;
  }
`

const Company = styled.h3`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0;
  margin-right: 0.75rem;
  color: ${(props) => props.theme.black};
  display: inline;

  @media (max-width: 767.98px) {
    font-size: 1.25rem;
  }
`

const CompanyHeader = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;

  @media (max-width: 767.98px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Location = styled.span`
  font-weight: 400;
  font-size: 1.1rem;
  color: ${(props) => lighten(0.3, props.theme.black)};
  display: inline;

  @media (max-width: 767.98px) {
    display: block;
    font-size: 1rem;
  }
`

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: ${(props) => lighten(0.2, props.theme.black)};

  @media (max-width: 767.98px) {
    font-size: 1rem;
  }
`

const BulletList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    color: ${(props) => props.theme.black};
    line-height: 1.6;

    &:before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${(props) => props.theme.primaryColor};
      font-size: 1.2rem;
      font-weight: bold;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`

// Timeline row item with animations
interface TimelineRowItemProps {
  entry: ExperienceEntry;
  index: number;
  totalEntries: number;
  onAnimated?: (index: number) => void;
  onFirstItemReached?: () => void;
  rowRef?: (el: HTMLDivElement | null) => void;
  dotRef?: React.RefObject<HTMLDivElement | null>;
  timelineContainerRef: React.RefObject<HTMLDivElement | null>;
  triggeredScroll?: boolean;
}

function TimelineRowItem({ entry, index, totalEntries, onAnimated, onFirstItemReached, rowRef, dotRef, timelineContainerRef, triggeredScroll = false }: TimelineRowItemProps) {
  const [nodePopped, setNodePopped] = useState(false);
  const [hasBeenReached, setHasBeenReached] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger when entry is 1/3 to 1/2 up viewport (negative margin means above bottom edge)
  const { ref: inViewRef, isInView } = useInViewAnimation({
    once: true,
  });

  // Call onFirstItemReached when first item is reached
  useEffect(() => {
    if (hasBeenReached && index === 0 && onFirstItemReached) {
      onFirstItemReached();
    }
  }, [hasBeenReached, index, onFirstItemReached]);

  useEffect(() => {
    if (isInView && !nodePopped) {
      setNodePopped(true);
      onAnimated?.(index);
    }
  }, [isInView, nodePopped, index, onAnimated]);

  // Calculate dot's top offset for line intersection
  const myTopOffset = useMemo(() => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return rect.top;
  }, [containerRef]);

  // Check if line has reached this dot by reading CSS variable
  useEffect(() => {
    const checkLineIntersection = () => {
      if (timelineContainerRef.current && containerRef.current) {
        const lineHeight = parseInt(timelineContainerRef.current.style.getPropertyValue('--line-height') || '0');
        const containerRect = timelineContainerRef.current.getBoundingClientRect();
        const dotRect = containerRef.current.getBoundingClientRect();

        // Calculate the dot's position relative to the container
        const dotPositionRelativeToContainer = dotRect.top - containerRect.top;

        // For first item, require both line reaches dot AND item is in view
        // For other items, only require line reaches dot
        const shouldTrigger = index === 0
          ? lineHeight >= dotPositionRelativeToContainer && isInView
          : lineHeight >= dotPositionRelativeToContainer;

        if (shouldTrigger) {
          setHasBeenReached(true); // Once this is true, it never goes back to false
        }
      }
    };

    checkLineIntersection();

    // Listen for scroll events to recheck
    const handleScroll = () => checkLineIntersection();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [timelineContainerRef, containerRef, isInView, index]);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  }, []);

  const extractStartYear = (dateString: string): string => {
    const match = dateString.match(/[A-Za-z]+ (\d{4})/);
    return match ? match[1] : dateString;
  };

  const isLast = index === totalEntries - 1;
  const isFirst = index === 0;
  const isSecond = index === 1;

  // Calculate delay: first item has delay, second item has stagger if triggered by button
  // Header-aware: if header is not visible (scrolled past), start immediately
  const getYearDelay = () => {
    if (isFirst) {
      const headerVisible = typeof window !== 'undefined' && isSectionHeaderVisible('Experience');
      return headerVisible ? TIMELINE.year.firstDelay : 0;
    }
    if (isSecond && triggeredScroll) return TIMELINE.year.firstDelay + 0.5; // 0.5s stagger after first
    return TIMELINE.year.delay;
  };

  const getDotDelay = () => {
    if (isFirst) {
      const headerVisible = typeof window !== 'undefined' && isSectionHeaderVisible('Experience');
      return headerVisible ? TIMELINE.dot.firstDelay : 0;
    }
    if (isSecond && triggeredScroll) return TIMELINE.dot.firstDelay + 0.5;
    return TIMELINE.dot.delay;
  };

  const getEntryDelay = () => {
    if (isFirst) {
      const headerVisible = typeof window !== 'undefined' && isSectionHeaderVisible('Experience');
      return headerVisible ? TIMELINE.entry.firstDelay : 0;
    }
    if (isSecond && triggeredScroll) return TIMELINE.entry.firstDelay + TIMELINE.entry.delay;
    return TIMELINE.entry.delay;
  };

  // Combined ref handler
  const setRefs = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
    inViewRef(el);
    rowRef?.(el);
  }, [inViewRef, rowRef]);

  return (
    <div ref={setRefs}>
      <TimelineRow $isLast={isLast}>
        <Year>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: hasBeenReached ? 1 : 0, y: 0 }}
            transition={{
              duration: TIMELINE.year.duration,
              delay: getYearDelay(),
              ease: EASING.standard,
            }}
          >
            {extractStartYear(entry.year)}
          </motion.span>
        </Year>
        <TimelineDotWrapper>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: hasBeenReached ? 1 : 0,
              scale: hasBeenReached ? 1 : 0,
            }}
            transition={{
              duration: TIMELINE.dot.duration,
              delay: getDotDelay(),
              ease: TIMELINE.dot.ease,
            }}
          >
            <TimelineDot ref={dotRef} />
          </motion.div>
        </TimelineDotWrapper>
        <motion.div
          layout="position"
          initial={{ opacity: 0, x: isMobile ? -50 : 50, scale: 0.8 }}
          animate={{ opacity: hasBeenReached ? 1 : 0, x: 0, scale: 1 }}
          transition={{
            duration: TIMELINE.entry.duration,
            delay: getEntryDelay(),
            ease: EASING.standard,
          }}
          style={{
            flex: 1,
            paddingLeft: '3.5rem',
            paddingTop: '0.1rem',
            minWidth: 0
          }}
        >
          <CompanyHeader>
            <Company>{entry.company}</Company>
            <Location>{entry.location}</Location>
          </CompanyHeader>
          <Title>{entry.title}</Title>
          <BulletList>
            {entry.bullets.map((bullet, bulletIndex) => (
              <motion.li
                key={bulletIndex}
                initial="hidden"
                animate={hasBeenReached ? "visible" : "hidden"}
                custom={{
                  delay: TIMELINE.bullet.baseDelay + (bulletIndex * TIMELINE.bullet.staggerIncrement),
                  distance: isMobile ? 10 : 10
                }}
                variants={fadeInUpVariants}
              >
                {bullet}
              </motion.li>
            ))}
          </BulletList>
        </motion.div>
      </TimelineRow>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstDotRef = useRef<HTMLDivElement>(null);
  const lastDotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(0);

  // Track if scroll was triggered by "View Experience" button
  const [triggeredScroll, setTriggeredScroll] = useState(false);

  // Use the optimized hook for header viewport detection
  const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({
    once: true,
  });

  // Use the optimized hook for subheader viewport detection
  const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation({
    once: true,
  });

  // Use the optimized hook for vertical line viewport detection
  const { ref: verticalLineRef, isInView: isVerticalLineVisible } = useInViewAnimation({
    once: true,
  });

  // Track first timeline item's reached state for fade-in trigger
  const [firstItemReached, setFirstItemReached] = useState(false);

  // Extract start year from date string
  const extractStartYear = (dateString: string): string => {
    // Match patterns like "April 2024", "August 2022", etc.
    const match = dateString.match(/[A-Za-z]+ (\d{4})/);
    return match ? match[1] : dateString;
  };

  // Calculate the maximum line height (distance to last dot)
  const getMaxLineHeight = (): number => {
    if (!timelineContainerRef.current || !lastDotRef.current) {
      return 0;
    }

    // Get the absolute positioning in the viewport
    const containerRect = timelineContainerRef.current.getBoundingClientRect();
    const dotRect = lastDotRef.current.getBoundingClientRect();

    /**
     * MATH: Top of Dot - Top of Container 
     * This gives the exact distance from the start of the line 
     * to the top edge of the last blue circle.
     */
    const maxLineHeight = dotRect.top - containerRect.top + 20; // Add 20px to account for line gradient

    return Math.max(0, maxLineHeight);
  };

  // Calculate current line height based on scroll position
  const calculateLineHeight = (): number => {
    if (!sectionRef.current || !firstDotRef.current || !lastDotRef.current) {
      return 0;
    }

    const viewportHeight = window.innerHeight;
    // This matches your -40% bottom margin (100% - 40% = 60% from top)
    const triggerPoint = viewportHeight * 0.6;

    const firstDotRect = firstDotRef.current.getBoundingClientRect();
    const lastDotRect = lastDotRef.current.getBoundingClientRect();
    const maxLineHeight = getMaxLineHeight();

    // 1. Total distance the line is physically capable of growing
    // (The distance between the center of the first dot and the center of the last dot)
    const totalGrowthDistance = lastDotRect.top - firstDotRect.top;

    if (totalGrowthDistance <= 0) return 0;

    // 2. How far has the first dot traveled past our 60% trigger point?
    const distancePassedTrigger = triggerPoint - firstDotRect.top;

    // 3. Calculate progress (0 to 1) based ONLY on the distance between dots
    const progress = distancePassedTrigger / totalGrowthDistance;

    // 4. Clamp between 0 and 1, then apply to your max pixel height
    const currentHeight = Math.max(0, Math.min(progress, 1)) * maxLineHeight;

    return Math.round(currentHeight);
  };

  // Optimized scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    // Throttle: only request animation frame if not already pending
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        const height = calculateLineHeight();

        // Target the container and set a CSS variable
        if (timelineContainerRef.current) {
          timelineContainerRef.current.style.setProperty('--line-height', `${height}px`);
        }

        rafRef.current = null;
      });
    }
    lastScrollYRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    // Set initial line height
    handleScroll();

    // Always attach scroll listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize events
    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // Recalculate when experience data changes
  useEffect(() => {
    handleScroll();
  }, [experienceData.length]);

  // Listen for "View Experience" button click
  useEffect(() => {
    const handleScrollTrigger = () => {
      setTriggeredScroll(true);
      // Reset flag after 3 seconds (enough time for animations to complete)
      const timer = setTimeout(() => setTriggeredScroll(false), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('experience-scroll-trigger', handleScrollTrigger);
    return () => window.removeEventListener('experience-scroll-trigger', handleScrollTrigger);
  }, []);

  return (
    <ExperienceSection ref={sectionRef} id="Experience">
      <Container>
        <Row className="g-0 justify-content-center pb-5">
          <Col md={12} className="heading-section text-center">
            <motion.div
              ref={headerRef}
              initial="hidden"
              animate={isHeaderVisible ? "visible" : "hidden"}
              custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
              variants={fadeInUpVariants}
            >
              <Heading>Professional Journey</Heading>
            </motion.div>
            <motion.p
              ref={subheaderRef}
              initial="hidden"
              animate={isSubheaderVisible ? 'visible' : 'hidden'}
              custom={{ delay: SECONDARY_DELAYS.default }}
              variants={fadeInUpVariants}
            >
              Engineering scalable systems, high-availability cloud solutions, and technical leadership.
            </motion.p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={12}>
            <TimelineContainer ref={timelineContainerRef}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: firstItemReached ? 1 : 0 }}
                transition={{
                  duration: TIMELINE.line.duration,
                  ease: EASING.standard,
                }}
              >
                <div ref={verticalLineRef}>
                  <VerticalLine />
                </div>
              </motion.div>
              {experienceData.map((entry, index) => (
                <TimelineRowItem
                  key={index}
                  entry={entry}
                  index={index}
                  totalEntries={experienceData.length}
                  onAnimated={index === 0 ? () => setFirstItemReached(true) : undefined}
                  onFirstItemReached={index === 0 ? () => setFirstItemReached(true) : undefined}
                  rowRef={(el) => { rowRefs.current[index] = el; }}
                  dotRef={index === 0 ? firstDotRef : index === experienceData.length - 1 ? lastDotRef : undefined}
                  timelineContainerRef={timelineContainerRef}
                  triggeredScroll={triggeredScroll}
                />
              ))}
            </TimelineContainer>
          </Col>
        </Row>
      </Container>
    </ExperienceSection>
  );
}
