import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from '../style'
import { experienceData } from '../../data/experience'
import { lighten } from 'polished'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../../animations'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG } from '../../animations/config'

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
  margin: 0 auto;
  position: relative;
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
    left: 59px;
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
  padding-right: 2rem;
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
    left: 58px;
  }
`

const Content = styled.div`
  flex: 1;
  padding-left: 3rem;
  min-width: 0;

  @media (max-width: 767.98px) {
    padding-left: 2.5rem;
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
    color: ${(props) => lighten(0.4, props.theme.black)};
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
  entry: {
    year: string;
    company: string;
    location: string;
    title: string;
    bullets: string[];
  };
  index: number;
  totalEntries: number;
  onAnimated?: (index: number) => void;
  rowRef?: (el: HTMLDivElement | null) => void;
  dotRef?: React.RefObject<HTMLDivElement | null>;
  timelineContainerRef: React.RefObject<HTMLDivElement | null>;
}

function TimelineRowItem({ entry, index, totalEntries, onAnimated, rowRef, dotRef, timelineContainerRef }: TimelineRowItemProps) {
  const [nodePopped, setNodePopped] = useState(false);
  const [hasBeenReached, setHasBeenReached] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger when entry is 1/3 to 1/2 up viewport (negative margin means above bottom edge)
  const { ref: inViewRef, isInView } = useInViewAnimation({
    once: true,
    rootMargin: ANIMATION_CONFIG.rootMargin, // Trigger when center 1/3 of viewport
  });

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
      if (timelineContainerRef.current) {
        const lineHeight = parseInt(timelineContainerRef.current.style.getPropertyValue('--line-height') || '0');
        if (lineHeight >= myTopOffset) {
          setHasBeenReached(true); // Once this is true, it never goes back to false
        }
      }
    };

    checkLineIntersection();

    // Listen for scroll events to recheck
    const handleScroll = () => checkLineIntersection();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [myTopOffset]);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  }, []);

  const extractStartYear = (dateString: string): string => {
    const match = dateString.match(/[A-Za-z]+ (\d{4})/);
    return match ? match[1] : dateString;
  };

  const isLast = index === totalEntries - 1;

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
            initial={{ opacity: 0, x: isMobile ? -15 : 15 }}
            animate={{ opacity: nodePopped ? 1 : 0, x: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.2, 0.8, 0.2, 1]
            }}
          >
            {extractStartYear(entry.year)}
          </motion.span>
        </Year>
        <TimelineDotWrapper>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: nodePopped ? 1 : 0,
              scale: nodePopped ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <TimelineDot ref={dotRef} animate={hasBeenReached} />
          </motion.div>
        </TimelineDotWrapper>
        <Content>
          <motion.div
            initial={{ opacity: 0, x: isMobile ? -15 : 15 }}
            animate={{ opacity: nodePopped ? 1 : 0, x: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.2, 0.8, 0.2, 1]
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
                  animate={nodePopped ? "visible" : "hidden"}
                  custom={{ delay: 0.2 + (bulletIndex * 0.1), distance: isMobile ? 10 : 10 }}
                  variants={fadeInUpVariants}
                >
                  {bullet}
                </motion.li>
              ))}
            </BulletList>
          </motion.div>
        </Content>
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

  return (
    <ExperienceSection ref={sectionRef}>
      <Container>
        <Row noGutters className="justify-content-center pb-2 pt-5">
          <Col md={12} className="heading-section text-center">
            <Heading>Experience</Heading>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={12}>
            <TimelineContainer ref={timelineContainerRef}>
              <VerticalLine />
              {experienceData.map((entry, index) => (
                <TimelineRowItem
                  key={index}
                  entry={entry}
                  index={index}
                  totalEntries={experienceData.length}
                  rowRef={(el) => { rowRefs.current[index] = el; }}
                  dotRef={index === 0 ? firstDotRef : index === experienceData.length - 1 ? lastDotRef : undefined}
                  timelineContainerRef={timelineContainerRef}
                />
              ))}
            </TimelineContainer>
          </Col>
        </Row>
      </Container>
    </ExperienceSection>
  );
}
