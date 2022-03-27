import React from 'react'
import { Nav, Scroll, TradLink } from './Navigation/Nav'

export default function Navigation(props) {
  return (
    <Nav>
      <Scroll to="Home" offset={-80}>Home</Scroll>
      <TradLink to="/resume">Resume</TradLink>
      <Scroll to="About" offset={-70}>About</Scroll>
      <Scroll to="Skills">Skills</Scroll>
      {/*<Scroll to="Services">Services</Scroll>*/}
      <Scroll to="Projects">Projects</Scroll>
      <Scroll to="Contact" offset={0}>Contact</Scroll>
    </Nav>
  );
}

