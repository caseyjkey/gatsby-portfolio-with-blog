import React, { useState } from 'react'
import { Container, NavbarToggler, Collapse } from 'reactstrap'
import { Link as ScrollLink } from 'react-scroll'
import Button from './Hamburger'
import { Link } from 'gatsby'
import { useScrollDirection } from '../../hooks/useScrollDirection'

export function Nav({children}) {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const { isVisible } = useScrollDirection(10);

  return (
    <nav
      className="ftco-navbar-light navbar navbar-expand-lg ftco_navbar site-navbar-target"
      id="ftco-navbar"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        willChange: 'transform'
      }}
    >
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