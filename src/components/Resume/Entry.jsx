import React, { Component } from 'react'
import styled from 'styled-components'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'

export default class Entry extends Component {
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
    let Icon = this.props.icon;
    let date = this.props.date;
    let title = this.props.title;
    let subtitle = this.props.subtitle;
    let gpa = this.props.gpa;
    let text = this.props.children;

    return (
        <Animated animationIn="fadeInUp" isVisible={visible}>
          <ResumeWrap className="d-flex">
            <div className="icon d-flex align-items-center justify-content-center">
              <span><Icon /></span>
            </div>
            <div className="text pl-3">
              <span className="date">{date}</span>
              <h2>{title}</h2>
              <Waypoint onEnter={this.makeVisible}></Waypoint>
              <span className="subtitle">{subtitle}</span>
              {gpa && <span className="gpa">{gpa} GPA</span>}
              <Description>{text}</Description>
            </div>
          </ResumeWrap>
        </Animated>
    );
  };
}

const ResumeWrap = styled.div`
  width: 100%;
	margin-bottom: 30px;
	border-bottom: 1px solid rgba(0,0,0,.1);
	padding-bottom: 10px;
	.icon{
		width: 50px;
		height: 50px;
		background: ${(props) => props.theme.primaryColor};
		border-radius: 50%;	
		span{
			color: ${(props) => props.theme.white};
			font-size: 28px;
		}
	}
	.text{
    width: calc(100% - 50px);
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
		// letter-spacing: 3px;
    // text-transform: uppercase;
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