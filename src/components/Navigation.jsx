import React from 'react'
import { Nav, Scroll, TradLink } from './Navigation/Nav'

export default function Navigation(props) {
  return (
    <Nav>
      <TradLink to="/">Home</TradLink>
      <TradLink to="/resume">Resume</TradLink>
      <TradLink to="/blog">Blog</TradLink>
      <TradLink to="/about">About</TradLink>
      <Scroll to="Skills">Skills</Scroll>
      {/*<Scroll to="Services">Services</Scroll>*/}
      <TradLink to="/projects">Projects</TradLink>
      <Scroll to="Contact" offset={0}>Contact</Scroll>
    </Nav>
  );
}

