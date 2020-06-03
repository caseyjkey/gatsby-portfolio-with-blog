import React, { useState } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import { Badge } from 'reactstrap'
import { FaPython } from 'react-icons/fa'
import { Waypoint } from 'react-waypoint'
import { Animated } from 'react-animated-css'

export function Skill({ skill }) {
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