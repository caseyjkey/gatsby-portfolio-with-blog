import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { lighten } from 'polished'
import { theme } from '../style.ts'

import { IoMdArrowRoundDown } from 'react-icons/io'

const Container = styled.span`
  width: 70px;
  height: 70px;
  border: 1px solid transparent;
  @include border-radius(50%);
  cursor: pointer;
  position: relative;
  text-align: center;
  margin: 0 auto;
  display: block;
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    content: '';
    bottom: 0;
    background: ${lighten(0.343, theme.primaryColor)};
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

  @-webkit-keyframes wheel-up-down {
    100% {
        margin-top: 25px;
        opacity: 1;
    }
    30% {
        opacity: 1;
    }
    0% {
        margin-top: -10px;
        opacity: 0;
    }
  }@-moz-keyframes wheel-up-down {
    100% {
        margin-top: 25px;
        opacity: 1;
    }
    30% {
        opacity: 1;
    }
    0% {
        margin-top: -10px;
        opacity: 0;
    }
  }@keyframes wheel-up-down {
    100% {
        margin-top: 25px;
        opacity: 1;
    }
    30% {
        opacity: 1;
    }
    0% {
        margin-top: -10px;
        opacity: 0;
    }
  }
`;

const Mouse = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 120px;
  z-index: 0;
  @media (max-width: 767.98px) {
    display: none;
  }
`;


export default function FallingArrow(props) {
  let Scroll = require('react-scroll');
  let scroller = Scroll.scroller;

  return (
    <ThemeProvider theme={theme}>
      <Mouse>
        <Container>
          <FallDown>
            <IoMdArrowRoundDown color={theme.primaryColor}
                                fontSize="25px" 
                                onClick={() => scroller.scrollTo('Projects', {smooth: true})}
            />
          </FallDown>
        </Container>
      </Mouse>
    </ThemeProvider>
  );
}