import React, { useState, useEffect } from 'react'
import { Container, NavbarToggler, Collapse } from 'reactstrap'
import Button from './Hamburger'
import { Link } from 'gatsby'
import { useLocation } from '@reach/router'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import { StyledNav, StyledCollapse } from './NavStyles'
import { motion } from 'motion/react'
import { fadeInUpVariants, MOBILE_VERTICAL_STACK, useIsMobile } from '../../animations'

export function Nav({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [activeNavIndex, setActiveNavIndex] = useState<number | null>(null);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const { isVisible } = useScrollDirection(5);
  const location = useLocation();
  const isMenuOpen = !collapsed;
  const isHomePage = location.pathname === '/';

  // Handle ripple effect on click with navigation delay
  const handleRippleClick = (
    e: React.MouseEvent<HTMLElement>,
    index: number,
    callback?: () => void
  ) => {
    // Prevent immediate navigation for mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 992;
    if (isMobile && callback) {
      e.preventDefault();
    }

    const target = e.currentTarget;
    target.classList.remove('ripple-effect');
    void target.offsetWidth; // Trigger reflow
    target.classList.add('ripple-effect');

    // Set active state based on clicked item
    setActiveNavIndex(index);

    // Short delay before navigation (150ms - enough to see ripple start, not feel laggy)
    if (isMobile && callback) {
      setTimeout(() => {
        callback();
        // Close menu after navigation on mobile
        setCollapsed(true);
      }, 150);
    }

    // Remove ripple class after animation completes
    setTimeout(() => {
      target.classList.remove('ripple-effect');
    }, 600);
  };

  // Reset active state when menu closes
  useEffect(() => {
    if (collapsed) {
      setActiveNavIndex(null);
    }
  }, [collapsed]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 992) {
      // Simple overflow hidden - preserves scroll position
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Track scroll state for glass effect and top position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      setAtTop(scrollY < 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledNav
      className="ftco-navbar-light navbar navbar-expand-lg ftco_navbar site-navbar-target"
      id="ftco-navbar"
      $isVisible={isVisible}
      $scrolled={scrolled}
      $menuOpen={isMenuOpen}
    >
      <Container>
        <a className="navbar-brand" href="/"><span>C</span>asey Key</a>
        <NavbarToggler onClick={toggleNavbar} className="js-fh5co-nav-toggle fh5co-nav-toggle" aria-label="Toggle navigation">
          <Button />
        </NavbarToggler>
        <Collapse isOpen={!collapsed} navbar className="navbar-collapse" id="ftco-nav">
          <StyledCollapse $isOpen={!collapsed}>
            <ul className="navbar-nav nav ms-auto">
              {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    isHomePage,
                    atTop,
                    currentPath: location.pathname,
                    onNavClick: handleRippleClick,
                    navIndex: index,
                    activeNavIndex,
                    collapsed
                  } as any);
                }
                return child;
              })}
            </ul>
          </StyledCollapse>
        </Collapse>
      </Container>
    </StyledNav>
  );
}

interface ScrollProps {
  to: string;
  children: React.ReactNode;
  offset?: number;
  isHomePage?: boolean;
  atTop?: boolean;
  currentPath?: string;
  onNavClick?: (e: React.MouseEvent<HTMLElement>, index: number, callback?: () => void) => void;
  navIndex?: number;
  activeNavIndex?: number | null;
  collapsed?: boolean;
}

export function Scroll({ to, children, offset, isHomePage, atTop, currentPath, onNavClick, navIndex, activeNavIndex, collapsed }: ScrollProps) {
  // Desktop: Home link is active when on homepage and at top
  // Mobile: Active state is based on click
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 992;
  const isMobile = useIsMobile();
  const shouldAnimate = !isDesktop && collapsed !== undefined ? !collapsed : false;
  const isHomeActive = isDesktop && isHomePage && atTop && to === 'Introduction';
  const isClickActive = !isDesktop && activeNavIndex === navIndex;

  const isActive = isHomeActive || isClickActive;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onNavClick !== undefined && navIndex !== undefined) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 992;

      if (isMobile) {
        // For mobile: prevent default and manually scroll after delay
        e.preventDefault();
        onNavClick(e, navIndex, () => {
          const element = document.getElementById(to);
          if (element) {
            const offsetValue = offset ?? -80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset + offsetValue;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      } else {
        // For desktop: smooth scroll to element
        e.preventDefault();
        const element = document.getElementById(to);
        if (element) {
          const offsetValue = offset ?? -80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset + offsetValue;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
        onNavClick(e, navIndex);
      }
    }
  };

  const linkContent = (
    <a
      href={`#${to}`}
      className={`nav-link ${isActive ? 'react-scroll-active manual-active' : ''}`}
      onClick={handleClick}
    >
      <span>{children}</span>
    </a>
  );

  return isMobile ? (
    <motion.li
      className="nav-item"
      variants={fadeInUpVariants}
      initial={shouldAnimate ? 'hidden' : false}
      animate={shouldAnimate ? 'visible' : false}
      custom={{
        delay: navIndex !== undefined ? navIndex * MOBILE_VERTICAL_STACK.stagger / 1000 : 0,
        distance: MOBILE_VERTICAL_STACK.distance
      }}
    >
      {linkContent}
    </motion.li>
  ) : (
    <li className="nav-item">
      {linkContent}
    </li>
  );
};

interface TradLinkProps {
  to: string;
  children: React.ReactNode;
  isHomePage?: boolean;
  atTop?: boolean;
  currentPath?: string;
  onNavClick?: (e: React.MouseEvent<HTMLElement>, index: number, callback?: () => void) => void;
  navIndex?: number;
  activeNavIndex?: number | null;
  collapsed?: boolean;
}

export function TradLink({ to, children, isHomePage, atTop, currentPath, onNavClick, navIndex, activeNavIndex, collapsed }: TradLinkProps) {
  // Desktop: Active based on current path
  // Mobile: Active state is based on click OR current page
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 992;
  const isMobile = useIsMobile();
  const shouldAnimate = !isDesktop && collapsed !== undefined ? !collapsed : false;

  // Normalize paths for comparison (handle trailing slashes)
  const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';
  const isPathActive = normalizePath(currentPath) === normalizePath(to);

  const isClickActive = !isDesktop && activeNavIndex === navIndex;

  // Build class list
  const classNames = ['nav-link'];
  if (isPathActive) classNames.push('current-page'); // Always show current page as active
  if (isClickActive) classNames.push('manual-active'); // Click ripple active state

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onNavClick !== undefined && navIndex !== undefined) {
      // For mobile: pass a callback that manually navigates after delay
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 992;

      if (isMobile) {
        onNavClick(e, navIndex, () => {
          window.location.href = to;
        });
      } else {
        onNavClick(e, navIndex);
      }
    }
  };

  const linkContent = (
    <Link
      to={to}
      className={classNames.join(' ')}
      onClick={handleClick}
      // Add aria-current for better accessibility and as a fallback
      aria-current={isPathActive ? 'page' : undefined}
    >
      <span>{children}</span>
    </Link>
  );

  return isMobile ? (
    <motion.li
      className="nav-item"
      variants={fadeInUpVariants}
      initial={shouldAnimate ? 'hidden' : false}
      animate={shouldAnimate ? 'visible' : false}
      custom={{
        delay: navIndex !== undefined ? navIndex * MOBILE_VERTICAL_STACK.stagger / 1000 : 0,
        distance: MOBILE_VERTICAL_STACK.distance
      }}
    >
      {linkContent}
    </motion.li>
  ) : (
    <li className="nav-item">
      {linkContent}
    </li>
  );
}
