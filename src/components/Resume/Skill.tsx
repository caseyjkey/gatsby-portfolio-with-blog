import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import { Badge } from 'reactstrap'
import { FaPython } from 'react-icons/fa'
import { motion } from 'motion/react'
import { fadeInUpVariants, getRootMargin, getThreshold } from '../../animations'
import { ANIMATION_CONFIG } from '../../animations/config'

interface SkillProps {
  skill: string;
}

export function Skill({ skill }: SkillProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: isMobile() ? getThreshold(true) : 0,
        rootMargin: getRootMargin(isMobile()),
      }
    );

    const skillElement = document.getElementById(`skill-${skill.replace(/\s+/g, '-')}`);
    if (skillElement) {
      observer.observe(skillElement);
    }

    return () => observer.disconnect();
  }, [skill]);

  return (
    <motion.div
      id={`skill-${skill.replace(/\s+/g, '-')}`}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={fadeInUpVariants}
    >
      <SkillContainer>
        <FaPython size={'4rem'} style={{textAlign: 'center'}}/>
        <Badge className="d-block">{skill}</Badge>
      </SkillContainer>
    </motion.div>
  );
}

const SkillContainer = styled.div`
  width: 25%;
  margin: 0 0.5rem 1.5rem 0.5rem;
  display: block;
  #middleSection {
    background-color: ${(props) => props.theme.black}
  }
  h3 {
    color: ${(props) => props.theme.black};
    clear: none;
		font-size: 16px;
		margin-bottom: 10px;
		font-weight: 500;
  }
  svg {
    display: block;
    color: ${(props) => props.theme.primaryColor}
    margin: auto;
  }
  span {
    background-color: ${(props) => props.theme.black}
    width: 5m;
  }
`;
