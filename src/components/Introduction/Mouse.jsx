import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'

import MdArrowRoundDown from 'react-ionicons/lib/MdArrowRoundDown'

const Mouse = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 120px;
  z-index: 2;
`;

const Container = styled.span`
  width: 70px;
  height: 70px;
  border: 1px solid transparent;
  // @include border-radius(50%);
  // background: ${props => props.theme.primaryColor};
  cursor: pointer;
  position: relative;
  text-align: center;
  margin: 0 auto;
  display: block;
  // z-index: 0;
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    background: lighten(${props => props.theme.primaryColor},34.3%);
    z-index: -1;
    transform: rotate(45deg);
  }
`;

const FallDown = styled.div`
  height: 70px;
  margin: 2px auto 0;
  display: block;
  width: 30px;
  background: transparent;
  @include border-radius(50%);
  -webkit-animation: 1.6s ease infinite wheel-up-down;
  -moz-animation: 1.6s ease infinite wheel-up-down;
  animation: 1.6s ease infinite wheel-up-down;
  color: ${props => props.theme.primaryColor};
  font-size: 30px;
`;

export default class FallingArrow extends Component  {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Mouse>
          <Container>
            <FallDown>
              <MdArrowRoundDown color={theme.primaryColor}
                                fontSize="25px" 
                                onClick={console.log(theme.primaryColor)}/>
            </FallDown>
          </Container>
        </Mouse>
      </ThemeProvider>
    );
  }
}