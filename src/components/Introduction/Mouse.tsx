import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { lighten } from 'polished'
import { theme } from '../style.ts'

import { IoMdArrowRoundDown } from 'react-icons/io'

const Container = styled.span`
  width: 70px;
  height: 70px;
  background: transparent;
  cursor: pointer;
  position: relative;
  margin: 0 auto;
  display: block;
  overflow: visible; /* Change to visible — no need to hide overflow anymore */

  @media (max-width: 767.98px) {
    width: 100px;
    height: 100px;
  }

&:after {
    position: absolute;
    top: 35px;
    left: 50%;
    content: '';
    width: 70px;
    height: 38px;
    background: #3e64ff;
    opacity: 0.08;
    transform: translate(-50%, 0);
    z-index: -1;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
  }
`;

const FallDown = styled.div`
  width: 70px; /* Match the triangle width */
  height: 70px;
  margin: 0 auto; /* Perfectly centers the container */
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  position: relative;
  
  /* The Arrow Icon itself */
  color: #3e64ff; 
  font-size: 24px;

  animation: wheel-up-down 1.6s ease infinite;

  @keyframes wheel-up-down {
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    100% {
      transform: translateY(17px);
      opacity: 0;
    }
  }
`;

const Mouse = styled.div`
  display: flex;
  justify-content: center;
  z-index: 10;
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
              onClick={() => scroller.scrollTo('Skills', { smooth: true, offset: -80, delay: 0 })}
            />
          </FallDown>
        </Container>
      </Mouse>
    </ThemeProvider>
  );
}