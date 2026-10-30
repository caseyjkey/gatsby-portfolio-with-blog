import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { experienceData } from '../../data/experience'
import type { ExperienceEntry } from '../../data/experience'
import { fadeInUpVariants } from '../../animations'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG, TIMING, TIMELINE, EASING, SECONDARY_DELAYS } from '../../animations/config'
import { isSectionHeaderVisible } from '../../animations/utils/headerVisibility'
import './experience.scss'

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
      <div className={`timeline-row${isLast ? ' timeline-row--last' : ''}`}>
        <div className="timeline-year">
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
        </div>
        <div className="timeline-dot-wrapper">
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
            <div className="timeline-dot" ref={dotRef} />
          </motion.div>
        </div>
        <motion.div
          layout="position"
          initial={{ opacity: 0, x: isMobile ? -50 : 50, scale: 0.8 }}
          animate={{ opacity: hasBeenReached ? 1 : 0, x: 0, scale: 1 }}
          transition={{
            duration: TIMELINE.entry.duration,
            delay: getEntryDelay(),
            ease: EASING.standard,
          }}
          className="timeline-entry"
        >
          <div className="timeline-company-header">
            <h3 className="timeline-company">{entry.company}</h3>
            <span className="timeline-location">{entry.location}</span>
          </div>
          <div className="timeline-title">{entry.title}</div>
          <ul className="timeline-bullet-list">
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
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default function ExperienceTimeline() {
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
  const { ref: verticalLineRef } = useInViewAnimation({
    once: true,
  });

  // Track first timeline item's reached state for fade-in trigger
  const [firstItemReached, setFirstItemReached] = useState(false);

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
    <section ref={sectionRef} id="Experience" className="experience-section">
      <div className="experience-section__header-row">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderVisible ? "visible" : "hidden"}
          custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
          variants={fadeInUpVariants}
        >
          <h2 className="experience-section__heading">Professional Journey</h2>
        </motion.div>
        <motion.p
          ref={subheaderRef}
          initial="hidden"
          animate={isSubheaderVisible ? 'visible' : 'hidden'}
          custom={{ delay: SECONDARY_DELAYS.default }}
          variants={fadeInUpVariants}
          className="experience-section__subheader"
        >
          Engineering scalable systems, high-availability cloud solutions, and technical leadership.
        </motion.p>
      </div>
      <div className="experience-section__content-row">
        <div className="timeline-container" ref={timelineContainerRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: firstItemReached ? 1 : 0 }}
            transition={{
              duration: TIMELINE.line.duration,
              ease: EASING.standard,
            }}
          >
            <div ref={verticalLineRef}>
              <div className="timeline-vertical-line" />
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
        </div>
      </div>
    </section>
  );
}
