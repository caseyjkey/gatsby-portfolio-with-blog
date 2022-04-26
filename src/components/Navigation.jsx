import React from 'react'
import { Nav, TradLink } from './Navigation/Nav'

export default function Navigation(props) {
  return (
    <Nav>
      <TradLink to="/">Home</TradLink>
      <TradLink to="/resume">Resume</TradLink>
      {/* commented out because it looks turrible 
        <TradLink to="/blog">Blog</TradLink>
      */}
      <TradLink to="/about">About</TradLink>
      {/*<Scroll to="Services">Services</Scroll>*/}
      <TradLink to="/projects">Projects</TradLink>
      <TradLink to="/contact">Contact</TradLink>
    </Nav>
  );
}

