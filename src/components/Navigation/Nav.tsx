import React, { useState, useEffect } from 'react'
import { Container, NavbarToggler, Collapse } from 'reactstrap'
import { Link as ScrollLink } from 'react-scroll'
import Button from './Hamburger'
import { Link } from 'gatsby'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import { StyledNav, StyledCollapse } from './NavStyles'

export function Nav({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const { isVisible } = useScrollDirection(5);
  const isMenuOpen = !collapsed;

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 992) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Track scroll state for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledNav
      className="ftco-navbar-light navbar navbar-expand-lg ftco_navbar site-navbar-target"
      id="ftco-navbar"
      isVisible={isVisible}
      scrolled={scrolled}
      menuOpen={isMenuOpen}
    >
      <Container>
        <a className="navbar-brand" href="/"><span>C</span>asey Key</a>
        <NavbarToggler onClick={toggleNavbar} className="js-fh5co-nav-toggle fh5co-nav-toggle" aria-label="Toggle navigation">
          <Button />
        </NavbarToggler>
        <Collapse isOpen={!collapsed} navbar className="navbar-collapse" id="ftco-nav">
          <StyledCollapse isOpen={!collapsed}>
            <ul className="navbar-nav nav ms-auto">
              {children}
            </ul>
          </StyledCollapse>
        </Collapse>
      </Container>
    </StyledNav>
  );
}

export function Scroll({ to, children, offset }) {
  return (
    <li className="nav-item">
      <ScrollLink to={to} activeClass="active" spy={true} smooth="true" offset={offset} className="nav-link">
        <span>{children}</span>
      </ScrollLink>
    </li>
  );
};

export function TradLink({ to, children }) {
  return (
    <li className="nav-item">
      <Link to={to} className="nav-link">
        <span>{children}</span>
      </Link>
    </li>
  );
}
