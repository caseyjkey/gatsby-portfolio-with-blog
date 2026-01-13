import React, { useState, useEffect } from 'react'
import { Container, NavbarToggler, Collapse } from 'reactstrap'
import { Link as ScrollLink } from 'react-scroll'
import Button from './Hamburger'
import { Link } from 'gatsby'
import { useScrollDirection } from '../../hooks/useScrollDirection'

export function Nav({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const { isVisible } = useScrollDirection(10);
  const isMenuOpen = !collapsed;

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine header background based on scroll and menu state
  const getHeaderStyle = () => {
    const isMobile = window.innerWidth < 768;

    if (isMenuOpen) {
      // Menu open: solid background (black on mobile, white on desktop)
      return {
        backgroundColor: isMobile ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(0px)',
        borderBottom: isMobile ? 'none' : '1px solid #e2e8f0'
      };
    } else if (scrolled) {
      // Scrolled: semi-transparent with blur
      return {
        backgroundColor: isMobile ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: isMobile ? 'none' : '1px solid #f1f5f9'
      };
    } else {
      // Initial state: transparent (let SCSS handle mobile black bg)
      return {
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        borderBottom: 'none'
      };
    }
  };

  return (
    <nav
      className="ftco-navbar-light navbar navbar-expand-lg ftco_navbar site-navbar-target"
      id="ftco-navbar"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out, border-color 0.3s ease-in-out',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        willChange: 'transform',
        ...getHeaderStyle()
      }}
    >
      <Container>
        <a className="navbar-brand" href="/"><span>C</span>asey Key</a>
        <NavbarToggler onClick={toggleNavbar} className="js-fh5co-nav-toggle fh5co-nav-toggle" aria-label="Toggle navigation">
          <Button scrolled={scrolled} />
        </NavbarToggler>
        <Collapse isOpen={!collapsed} className="navbar-collapse" id="ftco-nav" style={{
          backgroundColor: isMenuOpen ? (window.innerWidth < 768 ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)') : 'transparent',
          backdropFilter: isMenuOpen ? 'blur(0px)' : 'none'
        }}>
          <ul className="navbar-nav nav ms-auto">
            {children}
          </ul>
        </Collapse>
      </Container>
    </nav>
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