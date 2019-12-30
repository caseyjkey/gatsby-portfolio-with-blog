import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { Animated } from 'react-animated-css'

export default class Entry extends Component {
  constructor(props) {
    super(props);
  }; 

  render() {
    let visible = this.props.visible;
    let date = this.props.date;
    let title = this.props.title;
    let subtitle = this.props.title;
    let text = this.props.children;

    return (
      <ThemeProvider theme={theme}>
        <Animated animationIn="fadeInUp" isVisible={visible}>
          <ResumeWrap className="d-flex">
            <div className="icon d-flex align-items-center justify-content-center">
              <span className="flaticon-ideas"></span>
            </div>
            <div className="text pl-3">
              <span className="date">{date}</span>
              <h2>{title}</h2>
              <span className="position">{subtitle}</span>
              <p>{text}</p>
            </div>
          </ResumeWrap>
        </Animated>
      </ThemeProvider>
    )
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
		background: $primary;
		@include border-radius(50%);	
		span{
			color: $white;
			font-size: 28px;
		}
	}
	.text{
		width: calc(100% - 50px);
	}
	.date{
		font-weight: 700;
		font-size: 16px;
		color: rgba(0,0,0,.6);
		color: $primary;
	}
	h2{
		font-size: 24px;
		font-weight: 700;
	}
	.position{
		font-size: 18px;
		font-weight: 700;
		// letter-spacing: 3px;
		// text-transform: uppercase;
		color: $black;
	}
`;