import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function Button(props) {
  const [open, setOpen] = useState(false);
  const toggleButton = () => setOpen(!open);
  const [scrolled, setScrolled] = useState( props.scrolled );
  useEffect(() => {
    setScrolled(props.scrolled);
  }, [scrolled]);
  
  return (
    <HamburgerButton onClick={toggleButton} className={open && "open"} id="hamburger" scrolled={scrolled}>
      <p>{props.scrolled}</p>
      <div className={open && "open"}>
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

  /* Icon 1 */
    width: 30px;
    height: 22px;
    position: relative;
    margin: 25px auto;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .5s ease-in-out;
    -moz-transition: .5s ease-in-out;
    -o-transition: .5s ease-in-out;
    transition: .5s ease-in-out;
    cursor: pointer;

 span {
    display: block;
    position: absolute;
    height: 4px;
    width: 100%;
    background: ${props => !props.scrolled || props.scrolled === false ? props.theme.white : props.theme.black};
    border-radius: 3px;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .05s ease-in-out;
    -moz-transition: .1s ease-in-out;
    -o-transition: .1s ease-in-out;
    transition: .1s ease-in-out;
  }

   span:nth-child(1) {
    top: 0px;
  }

   span:nth-child(2) {
    top: 9px;
  }

   span:nth-child(3) {
    top: 18px;
  }

  .open {
    span:nth-child(1) {
      top: 9px;
      -webkit-transform: rotate(135deg);
      -moz-transform: rotate(135deg);
      -o-transform: rotate(135deg);
      transform: rotate(135deg);
    }

    span:nth-child(2) {
      opacity: 0;
      left: -30px;
    }

    span:nth-child(3) {
      top: 9px;
      -webkit-transform: rotate(-135deg);
      -moz-transform: rotate(-135deg);
      -o-transform: rotate(-135deg);
      transform: rotate(-135deg);
    }
  }
`;