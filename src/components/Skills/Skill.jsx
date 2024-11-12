import React, { useState, Suspense } from 'react'
import { Tooltip } from 'reactstrap'
import { Waypoint } from 'react-waypoint'
import { Animated } from 'react-animated-css'
import { SkillContainer } from './style'

export function Skill({ skill, Icon }) {
  const [visible, setVisible] = useState(false);
  const isSSR = typeof window === "undefined"
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const id = skill.replace(/[^a-z0-9]/gi, '') + 'Tooltip';
  return (
    <SkillContainer>
      {!isSSR && ( 
        <Suspense fallback={<p>Loading...</p>}>
          <Animated animationIn="fadeInUp" isVisible={visible}>
            <span id={id}>
              <Icon size={'2rem'} style={{textAlign: 'center'}}/>
            </span>
            <Tooltip placement="top" isOpen={tooltipOpen} target={id} toggle={() => setTooltipOpen(!tooltipOpen)}>
              {skill} 
            </Tooltip>
            <Waypoint onEnter={() => setVisible(true)} />
          </Animated>
        </Suspense>
      )}
    </SkillContainer>
  );
}

