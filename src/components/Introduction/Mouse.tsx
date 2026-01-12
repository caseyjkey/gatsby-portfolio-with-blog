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
  const [hasEntranceCompleted, setHasEntranceCompleted] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Mouse>
        <Container>
          <FallDown
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: hasEntranceCompleted ? [0, 5, 0] : 0,
            }}
            transition={{
              opacity: {
                duration: HERO_TIMING.arrow.duration / 1000,
                delay: HERO_TIMING.arrow.delay / 1000,
                ease: EASING,
              },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: hasEntranceCompleted ? (HERO_TIMING.arrow.delay + HERO_TIMING.arrow.duration) / 1000 : 0,
              },
            }}
            onAnimationComplete={() => {
              if (!hasEntranceCompleted) {
                setHasEntranceCompleted(true);
              }
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
