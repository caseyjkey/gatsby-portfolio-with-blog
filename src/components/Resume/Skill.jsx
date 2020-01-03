import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { lighten } from 'polished'
import { Container, Row, Col, Progress } from 'reactstrap'
import VisibilitySensor from 'react-visibility-sensor'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Waypoint } from 'react-waypoint'
import { Animated } from 'react-animated-css'

export class SkillCircle extends Component {
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
    let percentTotal = this.props.percentTotal;
    let percentWeek = this.props.percentMonth;
    let percentMonth = this.props.percentWeek;


    return (
      <SkillCircleContainer>
        <Animated animationIn="fadeInUp" isVisible={visible}>      
          
          <h2 className="h5 font-weight-bold text-center mb-4">{skill}</h2>
          {/* Progress bar */}
          <VisibilitySensor >
            {( {isVisible} ) => {
              const percentage = isVisible ? percentTotal : 0;
              return (
                <ProgressCircle className="mx-auto">
                  <CircularProgressbar
                    value={percentage}
                    text={`${Math.round(percentage)}%`}
                    strokeWidth={5}
                    styles={buildStyles({
                      textColor: theme.black,
                      pathColor: theme.primaryColor,
                      trailColor: lighten(0.95, theme.black),
                    })}
                  />  
                </ProgressCircle>
              );
            }}
          </VisibilitySensor>
          <Waypoint onEnter={this.makeVisible}></Waypoint>

          {/* Demo info */}
          {percentWeek && percentMonth &&
            <Container>
              <Row className="text-center mt-4">
                <Col xs={6} className="border-right">
                  <div className="h4 font-weight-bold mb-0">{percentWeek}%</div><span className="small text-gray">Last week</span>
                </Col>
                <Col xs={6}>
                  <div className="h4 font-weight-bold mb-0">{percentMonth}%</div><span className="small text-gray">Last month</span>
                </Col>
              </Row>
            </Container>}
          {/* END */}
            
        </Animated>
      </SkillCircleContainer>
    );
  };
};

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
            {console.log(skillLevels.slice(0, skillLevel))}
            {skillLevels.slice(0, skillLevel).map((value, index, arr) => {
              return <Progress bar color={progressbarVariants[index]} value={25}>{index === arr.length - 1 && value}</Progress>
            })}
          </Progress>
        </ProgressbarContainer>
        <Waypoint onEnter={() => this.makeVisible()} />
      </Animated>
    );
  }
}

const SkillCircleContainer = styled.div`
  // bg-white
  background-color: ${(props) => props.theme.white};
  // rounded-lg
  border-radius: 0.3rem;
  // shadow
  -webkit-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  // p 4
  padding: 1.5rem;

`;

const ProgressCircle = styled.div`
    width: 150px;
	  height: 150px;
	  background: none;
	  position: relative
`;

const ProgressbarContainer = styled.div`
  width: 100%;
  margin-bottom: 30px;
	h3 {
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