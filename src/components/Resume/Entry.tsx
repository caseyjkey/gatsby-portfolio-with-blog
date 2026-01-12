import React, { useMemo, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { motion, useScroll, useTransform } from 'motion/react'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG } from '../../animations/config'

interface EntryProps {
  icon: React.ComponentType<any>;
  date?: string;
  title: string;
  subtitle: string;
  graduationDate?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  index?: number;
  totalEntries?: number;
}

export default function Entry({ icon: Icon, date, title, subtitle, graduationDate, children, style }: EntryProps) {
  const [nodePopped, setNodePopped] = useState(false);
  const [hasDimensions, setHasDimensions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the optimized hook for viewport detection
  const { ref: setContainerRef, isInView: isVisible } = useInViewAnimation({
    once: true,
  });

  // Merge refs to handle both the hook and our local ref
  useEffect(() => {
    if (containerRef.current) {
      setContainerRef(containerRef.current);
    }
  }, [setContainerRef]);

  // Memoize mobile detection
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  }, []);

  // Scroll-linked progress for desktop timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Line grows based on scroll progress (desktop)
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Use ResizeObserver to detect when accordion opens (element gets dimensions)
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        if (height > 0 && !hasDimensions) {
          setHasDimensions(true);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Check initial dimensions in case it's already open
    if (containerRef.current.offsetHeight > 0) {
      setHasDimensions(true);
    }

    return () => resizeObserver.disconnect();
  }, [hasDimensions]);

  // Trigger node pop after entry becomes visible and has dimensions
  useEffect(() => {
    if (isVisible && hasDimensions) {
      const timer = setTimeout(() => {
        setNodePopped(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasDimensions]);

  return (
    <EntryContainer ref={containerRef}>
      {/* Vertical Timeline Line */}
      <TimelineLineWrapper>
        <motion.div
          className="timeline-line"
          style={{
            scaleY: isMobile ? (isVisible && hasDimensions ? 1 : 0) : lineScaleY,
            transformOrigin: "top"
          }}
          transition={{ duration: isMobile ? 0.4 : 0 }}
        />
      </TimelineLineWrapper>

      {/* Blue Node/Dot */}
      <BlueNodeWrapper>
        <motion.div
          className="blue-node"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: nodePopped ? [0, 1.2, 1] : 0,
            opacity: nodePopped ? 1 : 0,
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.7, 1],
          }}
        />
      </BlueNodeWrapper>

      {/* Content with slide animation */}
      <motion.div
        className="entry-content"
        initial={{ x: isMobile ? -15 : 15, opacity: 0 }}
        animate={{ x: 0, opacity: nodePopped ? 1 : 0 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          ease: [0.2, 0.8, 0.2, 1]
        }}
      >
        <ResumeWrap className="d-flex" style={style}>
          <div className="text pl-3">
            {date && <span className="date">{date}</span>}
            {graduationDate && <span className="gpa">{graduationDate}</span>}
            <h2>{title}</h2>
            <span className="subtitle">{subtitle}</span>
            <Description>{children}</Description>
          </div>
        </ResumeWrap>
      </motion.div>
    </EntryContainer>
  );
}

const EntryContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,.1);

  &:last-child {
    border-bottom: none;
  }
`;

const TimelineLineWrapper = styled.div`
  position: absolute;
  left: 25px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(0,0,0,0.1);
  overflow: hidden;

  .timeline-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.primaryColor};
    transform-origin: top;
  }

  @media (max-width: 767.98px) {
    left: 20px;
  }
`;

const BlueNodeWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 15px;
  width: 20px;
  height: 20px;
  z-index: 2;

  .blue-node {
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.primaryColor};
    border-radius: 50%;
    box-shadow: 0 0 0 4px ${(props) => props.theme.white};
  }

  @media (max-width: 767.98px) {
    left: 11px;
    top: 12px;
    width: 18px;
    height: 18px;

    .blue-node {
      box-shadow: 0 0 0 3px ${(props) => props.theme.white};
    }
  }
`;

const ResumeWrap = styled.div`
  width: 100%;
  margin-left: 60px;

  @media (max-width: 767.98px) {
    margin-left: 50px;
  }

  .text{
    width: 100%;
    p {
      margin-top: 0.5rem;
      @media (max-width: 767.98px) {
        clear: both;
      }
    }
    @media (max-width: 767.98px) {
      position: relative;
    }
  }

  .date{
    font-weight: 700;
    font-size: 16px;
    color: rgba(0,0,0,.6);
    float: right;
    color: ${(props) => props.theme.primaryColor};
    @media (max-width: 767.98px) {
      float: left;
    }
  }

  .gpa {
    font-weight: 700;
    font-size: 18px;
    color: ${(props) => props.theme.black};
    float: right;
    @media (max-width: 767.98px) {
      font-size: 16px;
      clear: both;
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }

  h2{
    color: ${(props) => props.theme.black};
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 0px;
    @media (max-width: 767.98px) {
      clear: both;
    }
  }

  .subtitle{
    font-size: 18px;
    font-weight: 700;
    color: ${(props) => props.theme.black};
  }
`;

const Description = styled.div`
  color: ${(props) => props.theme.black};
  ul {
    padding-left: 0px;
  }
  @media (max-width: 375px) {
    word-wrap: break-word;
  }
`;
