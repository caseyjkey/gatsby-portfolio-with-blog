import React, { useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { lighten } from 'polished'
import { theme } from '../style.ts'
import { motion } from 'motion/react'
import { HERO_TIMING, EASING } from '../../animations'

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

const FallDown = styled(motion.div)`
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
`;

const Mouse = styled.div`
  display: flex;
  justify-content: center;
  z-index: 10;
`;


export default function FallingArrow(props) {
  let Scroll = require('react-scroll');
  let scroller = Scroll.scroller;

  // Match main branch behavior: arrow moves from -10px to 17px with fade in/out
  // This replicates the CSS keyframe animation using Motion
  return (
    <ThemeProvider theme={theme}>
      <Mouse>
        <Container>
          <FallDown
            animate={{
              y: [-10, 17],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.6,
              times: [0, 0.3, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <IoMdArrowRoundDown
              color={theme.primaryColor}
              fontSize="25px"
              onClick={() => scroller.scrollTo('Skills', { smooth: true, offset: -80, delay: 0 })}
            />
          </FallDown>
        </Container>
      </Mouse>
    </ThemeProvider>
  );
}
