import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from '../style.ts'
import { experienceData } from '../../data/experience'
import { lighten } from 'polished'
import { motion } from 'motion/react'
import { ANIMATION_CONFIG } from '../../animations/config'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'

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

const VerticalLine = styled(motion.div)`
  position: absolute;
  left: 77px;
  top: 1px;
  width: 2px;
  background-color: ${(props) => props.theme.black};
  z-index: 0;
  transform-origin: top;
  will-change: height;
  transition: height 0.15s ease-out;

  @media (max-width: 767.98px) {
    left: 58px;
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

const TimelineDot = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.primaryColor};
  z-index: 2;
  flex-shrink: 0;

  @media (max-width: 767.98px) {
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
}

function TimelineRowItem({ entry, index, totalEntries, onAnimated }: TimelineRowItemProps) {
  const [nodePopped, setNodePopped] = useState(false);

  // Trigger when entry is 1/3 to 1/2 up the viewport (negative margin means above bottom edge)
  const { ref: containerRef, isInView } = useInViewAnimation({
    once: true,
    rootMargin: '-20% 0px -40% 0px', // Trigger when center 1/3 of viewport
  });

  useEffect(() => {
    if (isInView && !nodePopped) {
      setNodePopped(true);
      onAnimated?.(index);
    }
  }, [isInView, nodePopped, index, onAnimated]);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  }, []);

  const extractStartYear = (dateString: string): string => {
    const match = dateString.match(/[A-Za-z]+ (\d{4})/);
    return match ? match[1] : dateString;
  };

  const isLast = index === totalEntries - 1;

  return (
    <div ref={containerRef}>
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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: nodePopped ? 1 : 0.8,
            opacity: nodePopped ? 1 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <TimelineDot />
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
                initial={{ opacity: 0, x: isMobile ? -10 : 10 }}
                animate={{ opacity: nodePopped ? 1 : 0, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: nodePopped ? 0.2 + (bulletIndex * 0.1) : 0,
                  ease: [0.2, 0.8, 0.2, 1]
                }}
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
  const [animatedIndices, setAnimatedIndices] = useState<Set<number>>(new Set());
  const lineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const handleEntryAnimated = useCallback((index: number) => {
    setAnimatedIndices(prev => {
      const newSet = new Set(prev).add(index);

      // Smooth line height update using requestAnimationFrame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (lineRef.current) {
          // Calculate height: extend to the center of the last dot when all entries are animated
          // For 8 entries, the last dot's center is at 7.5/8 = 93.75%
          const targetSize = newSet.size === experienceData.length
            ? experienceData.length - 0.5  // 7.5 instead of 7 to reach center of last dot
            : newSet.size;
          const percentage = (targetSize / experienceData.length) * 100;
          lineRef.current.style.height = `${Math.max(0, percentage)}%`;
        }
      });

      return newSet;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <ExperienceSection name="Experience">
      <Container>
        <Row noGutters className="justify-content-center pb-2 pt-5">
          <Col md={12} className="heading-section text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <Heading>Experience</Heading>
            </motion.div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={12}>
            <TimelineContainer>
              <VerticalLine
                ref={lineRef}
                style={{ height: '0%' }}
              />
              {experienceData.map((entry, index) => (
                <TimelineRowItem
                  key={index}
                  entry={entry}
                  index={index}
                  totalEntries={experienceData.length}
                  onAnimated={handleEntryAnimated}
                />
              ))}
            </TimelineContainer>
          </Col>
        </Row>
      </Container>
    </ExperienceSection>
  );
}
