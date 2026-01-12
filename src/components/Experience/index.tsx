import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from '../style.ts'
import { experienceData } from '../../data/experience'
import { lighten } from 'polished'

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

interface VerticalLineProps {
  $height?: number;
}

const VerticalLine = styled.div<VerticalLineProps>`
  position: absolute;
  left: 78px;
  top: 1px;
  height: ${props => props.$height ? `${props.$height}px` : '100%'};
  width: 2px;
  background-color: ${(props) => props.theme.black};
  z-index: 0;

  @media (max-width: 767.98px) {
    left: 59px;
  }
`

const TimelineRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.$isLast ? '0' : '3rem'};
  position: relative;
`

const Year = styled.div`
  min-width: 60px;
  text-align: right;
  padding-right: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.black};
  font-size: 1.1rem;

  @media (max-width: 767.98px) {
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
  position: absolute;
  left: 79px;
  transform: translateX(-50%);
  z-index: 2;
  flex-shrink: 0;

  @media (max-width: 767.98px) {
    left: 59px;
    width: 2rem;
    height: 2rem;
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

export default function Experience() {
  const [lineHeight, setLineHeight] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
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
    if (!timelineContainerRef.current || rowRefs.current.length === 0) {
      return 0;
    }

    const containerRect = timelineContainerRef.current.getBoundingClientRect();
    const lastRow = rowRefs.current[rowRefs.current.length - 1];

    if (!lastRow) return 0;

    const lastRowRect = lastRow.getBoundingClientRect();
    const dotCenterOffset = window.innerWidth <= 767.98 ? 40 : 50; // Approximate center of dot

    // Calculate from top of container to center of last dot
    const maxLineHeight = (lastRowRect.top - containerRect.top) + dotCenterOffset;

    return Math.max(0, maxLineHeight);
  };

  // Calculate current line height based on scroll position
  const calculateLineHeight = (): number => {
    if (!sectionRef.current || !timelineContainerRef.current) {
      return 0;
    }

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const maxLineHeight = getMaxLineHeight();

    if (maxLineHeight <= 0) {
      return 0;
    }

    // The line starts growing when the section top reaches viewport center
    // and completes when the section bottom passes viewport center
    const scrollableDistance = sectionRect.height - viewportHeight;

    // Avoid division by zero
    if (scrollableDistance <= 0) {
      return maxLineHeight;
    }

    const scrollProgress = (viewportHeight / 2 - sectionRect.top) / scrollableDistance;

    // Calculate line height based on scroll progress, clamped between 0 and maxLineHeight
    const currentHeight = Math.max(0, Math.min(scrollProgress * maxLineHeight, maxLineHeight));

    return Math.round(currentHeight);
  };

  // Optimized scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    // Throttle: only request animation frame if not already pending
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        const newHeight = calculateLineHeight();

        // Only update state if height actually changed
        setLineHeight(prevHeight => {
          if (prevHeight !== newHeight) {
            return newHeight;
          }
          return prevHeight;
        });
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
    <ExperienceSection name="Experience" ref={sectionRef}>
      <Container>
        <Row noGutters className="justify-content-center pb-2 pt-5">
          <Col md={12} className="heading-section text-center">
            <Heading>Experience</Heading>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={12}>
            <TimelineContainer ref={timelineContainerRef}>
              <VerticalLine $height={lineHeight > 0 ? lineHeight : undefined} />
              {experienceData.map((entry, index) => (
                <TimelineRow
                  key={index}
                  $isLast={index === experienceData.length - 1}
                  ref={(el) => { rowRefs.current[index] = el; }}
                >
                  <Year>{extractStartYear(entry.year)}</Year>
                  <TimelineDot />
                  <Content>
                    <CompanyHeader>
                      <Company>{entry.company}</Company>
                      <Location>{entry.location}</Location>
                    </CompanyHeader>
                    <Title>{entry.title}</Title>
                    <BulletList>
                      {entry.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </BulletList>
                  </Content>
                </TimelineRow>
              ))}
            </TimelineContainer>
          </Col>
        </Row>
      </Container>
    </ExperienceSection>
  );
}
