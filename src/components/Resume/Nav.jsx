import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { Link as ScrollLink } from 'react-scroll'

export class Nav extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Navi id="navi">
          <ul>
            {this.props.children}
          </ul>
        </Navi>
      </ThemeProvider>
    );
  };
}

export class Link extends Component {
  render() {
    let to = this.props.to;
    let activeClass = this.props.activeClass;
    let spy = this.props.spy;
    let smooth = this.props.smooth;

    return (
      <ThemeProvider theme={theme}>
        <li><ScrollLink to={to} activeClass={activeClass} spy={spy} smooth={smooth} offset={-185}>{this.props.children}</ScrollLink></li>
      </ThemeProvider>
    );
  };
};

const Navi = styled.nav`
  top: 180px;
  position: -webkit-sticky;
  position: sticky;
  margin: 0;
  padding-bottom: 50px;
  @media (max-width: 767.98px) {
    display: none;
    padding: 0;
  }
  ul {
  	margin: 0;
  	padding: 0;
  }
  li {
  	font-weight: 700;
  	list-style: none;
    margin-bottom: 10px;
    a:not([href]):not([tabindex]) {
      color: ${(props) => props.theme.black};
  		&.current {
			  // border-bottom: 4px solid $primary;
			  color: ${(props) => props.theme.primaryColor};
			  margin-left: 20px;
			  position: relative;
			  &:after{
			  	position: absolute;
			  	top: 50%;
			  	left: -24px;
			  	width: 20px;
			  	height: 2px;
			  	content: '';
			  	transform: translateY(-50%);
			  	background: ${(props) => props.theme.primaryColor};
			  }
			}
    }
    
    
  }
  `;