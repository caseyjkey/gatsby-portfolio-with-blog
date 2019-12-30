import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'

export class Nav extends Component {
  constructor(props) {
    super(props);
  };

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
  constructor(props) {
    super(props);
  };

  render() {
    let page = this.props.page;
    let currentPage = this.props.current;
    let isCurrent = (currentPage == page) ? "current" : "";

    return (
      <ThemeProvider theme={theme}>
        <li><a href={'#' + page} className={isCurrent}>{this.props.children}</a></li>
      </ThemeProvider>
    );
  };
}

const Navi = styled.nav`
  top: 180px;
  position: -webkit-sticky;
  position: sticky;
  margin: 0;
  ul{
  	margin: 0;
  	padding: 0;
  }
  li{
  	font-weight: 700;
  	list-style: none;
  	margin-bottom: 10px;
  	a{
  		color: $black;
  		&.current {
			  // border-bottom: 4px solid $primary;
			  color: $primary;
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
			  	background: $primary;
			  }
			}
  	}
  }
  `;