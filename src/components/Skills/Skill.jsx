import React, { useState } from 'react'
import { Badge } from 'reactstrap'
import { FaPython } from 'react-icons/fa'
import { Waypoint } from 'react-waypoint'
import { Animated } from 'react-animated-css'
import { SkillContainer } from './style'

export function Skill({ skill, Icon }) {
  const [visible, setVisible] = useState(false);

  return (
    <SkillContainer>
      <Animated animationIn="fadeInUp" isVisible={visible}>
        <FaPython size={'4rem'} style={{textAlign: 'center'}}/>
        <Badge className="d-block">{skill}</Badge>
        <Waypoint onEnter={() => setVisible(true)} />
      </Animated>
    </SkillContainer>
  );
}

