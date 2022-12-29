import React, { useState } from 'react'
import { Container, NavbarToggler, Collapse } from 'reactstrap'
import { Link as ScrollLink } from 'react-scroll'
import Button from './Hamburger'
import { Link } from 'gatsby'

export function Nav({children}) {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <nav className="ftco-navbar-light navbar navbar-expand-lg ftco_navbar site-navbar-target" id="ftco-navbar">
      <Container>
        <a className="navbar-brand" href="/"><span>C</span>asey Key</a>
        <NavbarToggler onClick={toggleNavbar} className="js-fh5co-nav-toggle fh5co-nav-toggle" aria-label="Toggle navigation">
          <Button scrolled={false}/>
        </NavbarToggler>
        <Collapse isOpen={!collapsed} className="navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav nav ms-auto">
              {children}
            </ul>
        </Collapse>
      </Container>
    </nav>
  );
}

export function Scroll({ to, children, offset}) {
  return (
      <li className="nav-item">
        <ScrollLink to={to} activeClass="active" spy={true} smooth="true" offset={offset} className="nav-link">
          <span>{children}</span>
        </ScrollLink>
      </li>
  );
};

export function TradLink({ to, children}) {
  return (
      <li className="nav-item">
        <Link to={to} className="nav-link">
          <span>{children}</span>
        </Link>
      </li>
  );
}