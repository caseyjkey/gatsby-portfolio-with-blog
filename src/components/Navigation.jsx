import React from 'react'
import { Nav, Link } from './Navigation/Nav'

export default function Navigation(props) {
  return (
    <Nav>
      <Link to="Home" offset={-70}>Home</Link>
      <Link to="About" offset={-70}>About</Link>
      <Link to="Resume">Resume</Link>
      <Link to="Services">Services</Link>
      <Link to="Projects">Projects</Link>
    </Nav>
  );
}