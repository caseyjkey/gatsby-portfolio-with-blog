import React, { Component } from 'react'
import styled from 'styled-components'
import { theme } from '../style.js'
import { lighten } from 'polished'
import { Progress } from 'reactstrap'
import { Waypoint } from 'react-waypoint'
import { Animated } from 'react-animated-css'

export class Skillbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
    this.makeVisible = this.makeVisible.bind(this);
  }

  makeVisible() {
    this.setState({visible: true});
  }

  render() {
    let visible = this.state.visible;

    let skill = this.props.skill;
    let skillLevel = this.props.skillLevel; // Value between 1 and 4

    let skillLevels = ["Some", "Practiced", "Proficient", "Advanced"];
    let progressbarVariants = ["danger", "warning", "success", null];
    return (
      <Animated animationIn="fadeInUp" isVisible={visible}>
        <ProgressbarContainer>
          <h3>{skill}</h3>
          <Progress multi>
            {skillLevels.slice(0, skillLevel).map((value, index, arr) => {
              return (
                <Progress bar 
                          key={index} 
                          color={progressbarVariants[index]} 
                          value={25}>
                  {index === arr.length - 1 && <div className="level">{value}</div>}
                </Progress>
              );
            })}
          </Progress>
        </ProgressbarContainer>
        <Waypoint onEnter={() => this.makeVisible()} />
      </Animated>
    );
  }
}

const ProgressbarContainer = styled.div`
  width: 100%;
  margin-bottom: 30px;
	h3 {
    color: ${(props) => props.theme.black};
    clear: none;
		font-size: 16px;
		margin-bottom: 10px;
		font-weight: 500;
  }
  
  .progress {
    height: 15px;
    box-shadow: none;
    background: ${lighten(0.9, theme.black)};
    overflow: visible
  }
  .level {
    color: ${theme.white};
  }
  .progress-bar {
    background: ${theme.primaryColor};
    box-shadow: none;
    font-size: 14px;
    line-height: 1.0;
    color: ${theme.white};
    font-weight: 600;
    position: relative;
    overflow: visible;
    @include border-radius(2px);
    &:after{
      position: absolute;
      top: -2px;
      right: 0;
      width: 34px;
      height: 34px;
      content: '';
      background: ${theme.primaryColor};
      @include border-radius(2px);
      opacity: 0;
    }
    span{
      position: absolute;
      top: -38px;
      right: 0;
      font-size: 16px;
      font-weight: 500;
      color: ${theme.black};
    }
  }
`;