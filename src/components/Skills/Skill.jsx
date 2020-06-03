import React, { useState, Suspense } from 'react'
import { Badge } from 'reactstrap'
import { FaPython } from 'react-icons/fa'
import { Waypoint } from 'react-waypoint'
import { Animated } from 'react-animated-css'
import { SkillContainer } from './style'

export function Skill({ skill, Icon }) {
  const [visible, setVisible] = useState(false);
  const isSSR = typeof window === "undefined"


  return (
    <SkillContainer>
      {!isSSR && ( 
        <Suspense fallback={<p>Loading...</p>}>
          <Animated animationIn="fadeInUp" isVisible={visible}>
            <Icon size={'4rem'} style={{textAlign: 'center'}}/>
            <Badge className="d-block">{skill}</Badge>
            <Waypoint onEnter={() => setVisible(true)} />
          </Animated>
        </Suspense>
      )}
    </SkillContainer>
  );
}

