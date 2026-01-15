import React, { useState } from 'react'
import styled from 'styled-components'

export default function Button() {
  const [open, setOpen] = useState(false);
  const toggleButton = () => setOpen(!open);

  return (
    <HamburgerButton onClick={toggleButton} id="hamburger">
      <div className={open ? "open" : undefined}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </HamburgerButton>
  );
}

const HamburgerButton = styled.div`
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  background: transparent;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  /* Icon wrapper */
  width: 30px;
  height: 22px;
  position: relative;
  margin: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .5s ease-in-out;
  -moz-transition: .5s ease-in-out;
  -o-transition: .5s ease-in-out;
  transition: .5s ease-in-out;

  .open {
    span:nth-child(1) {
      top: 11px;
      height: 3.5px;
      -webkit-transform: translateX(-50%) rotate(135deg);
      -moz-transform: translateX(-50%) rotate(135deg);
      -o-transform: translateX(-50%) rotate(135deg);
      transform: translateX(-50%) rotate(135deg);
    }

    span:nth-child(2) {
      opacity: 0;
      left: 50%;
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -o-transform: translateX(-50%);
      transform: translateX(-50%);
    }

    span:nth-child(3) {
      top: 11px;
      height: 3.5px;
      -webkit-transform: translateX(-50%) rotate(-135deg);
      -moz-transform: translateX(-50%) rotate(-135deg);
      -o-transform: translateX(-50%) rotate(-135deg);
      transform: translateX(-50%) rotate(-135deg);
    }
  }

  span {
    display: block;
    position: absolute;
    height: 5px;
    width: 100%;
    background: ${(props) => props.theme.black};
    border-radius: 2px;
    opacity: 1;
    left: 50%;
    -webkit-transform: translateX(-50%) rotate(0deg);
    -moz-transform: translateX(-50%) rotate(0deg);
    -o-transform: translateX(-50%) rotate(0deg);
    transform: translateX(-50%) rotate(0deg);
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out, height 0.25s ease-in-out;
  }

  span:nth-child(1) {
    top: 0px;
  }

  span:nth-child(2) {
    top: 11px;
  }

  span:nth-child(3) {
    top: 22px;
  }
`;
