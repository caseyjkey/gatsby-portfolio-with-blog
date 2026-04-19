import React, { useState, useEffect } from 'react'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import { fadeInUpVariants, MOBILE_VERTICAL_STACK, useIsMobile } from '../../animations'
import { motion } from 'motion/react'
import './navigation.scss'

// === Nav Container ===
interface NavProps {
  children: React.ReactNode
}

export function Nav({ children }: NavProps) {
  const [collapsed, setCollapsed] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [activeNavIndex, setActiveNavIndex] = useState<number | null>(null)
  const toggleNavbar = () => setCollapsed(!collapsed)
  const { isVisible } = useScrollDirection(5)
  const isMenuOpen = !collapsed

  // Current path (client-side only)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
  const isHomePage = currentPath === '/'

  // Handle ripple effect on click with navigation delay
  const handleRippleClick = (
    e: React.MouseEvent<HTMLElement>,
    index: number,
    callback?: () => void
  ) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 992
    if (isMobile && callback) {
      e.preventDefault()
    }

    const target = e.currentTarget
    target.classList.remove('ripple-effect')
    void target.offsetWidth // Trigger reflow
    target.classList.add('ripple-effect')

    setActiveNavIndex(index)

    // Short delay before navigation (150ms)
    if (isMobile && callback) {
      setTimeout(() => {
        callback()
        setCollapsed(true)
      }, 150)
    }

    // Remove ripple class after animation completes
    setTimeout(() => {
      target.classList.remove('ripple-effect')
    }, 600)
  }

  // Reset active state when menu closes
  useEffect(() => {
    if (collapsed) {
      setActiveNavIndex(null)
    }
  }, [collapsed])

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 992) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.classList.add('menu-show')
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('menu-show')
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('menu-show')
    }
  }, [isMenuOpen])

  // Track scroll state for glass effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)
      setAtTop(scrollY < 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="navbar"
      id="ftco-navbar"
      data-visible={isVisible ? 'true' : 'false'}
      data-scrolled={scrolled ? 'true' : 'false'}
      data-menu-open={isMenuOpen ? 'true' : 'false'}
    >
      <div className="nav-container">
        <a className="navbar-brand" href="/"><span>C</span>asey Key</a>
        <button
          className="hamburger-toggle"
          onClick={toggleNavbar}
          id="hamburger"
          aria-label="Toggle navigation"
          aria-expanded={!collapsed}
        >
          <div className={`hamburger-icon ${!collapsed ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div className="navbar-collapse" data-open={!collapsed ? 'true' : 'false'}>
          <ul className="navbar-nav">
            {React.Children.map(children, (child, index) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  isHomePage,
                  atTop,
                  currentPath,
                  onNavClick: handleRippleClick,
                  navIndex: index,
                  activeNavIndex,
                  collapsed,
                } as any)
              }
              return child
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}

// === Scroll Link (scrolls to DOM element by ID) ===
interface ScrollProps {
  to: string
  children: React.ReactNode
  offset?: number
  isHomePage?: boolean
  atTop?: boolean
  currentPath?: string
  onNavClick?: (e: React.MouseEvent<HTMLElement>, index: number, callback?: () => void) => void
  navIndex?: number
  activeNavIndex?: number | null
  collapsed?: boolean
}

export function Scroll({
  to,
  children,
  offset,
  isHomePage,
  atTop,
  currentPath,
  onNavClick,
  navIndex,
  activeNavIndex,
  collapsed,
}: ScrollProps) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 992
  const isMobile = useIsMobile()
  const shouldAnimate = !isDesktop && collapsed !== undefined ? !collapsed : false
  const isHomeActive = isDesktop && isHomePage && atTop && to === 'Introduction'
  const isClickActive = !isDesktop && activeNavIndex === navIndex
  const isActive = isHomeActive || isClickActive

  const scrollToElement = () => {
    const element = document.getElementById(to)
    if (element) {
      const offsetValue = offset ?? -80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset + offsetValue
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onNavClick !== undefined && navIndex !== undefined) {
      const isMobileView = typeof window !== 'undefined' && window.innerWidth < 992

      if (isMobileView) {
        e.preventDefault()
        onNavClick(e, navIndex, scrollToElement)
      } else {
        e.preventDefault()
        scrollToElement()
        onNavClick(e, navIndex)
      }
    }
  }

  const linkContent = (
    <a
      href={`#${to}`}
      className={`nav-link ${isActive ? 'react-scroll-active manual-active' : ''}`}
      onClick={handleClick}
    >
      <span>{children}</span>
    </a>
  )

  return isMobile ? (
    <motion.li
      className="nav-item"
      variants={fadeInUpVariants}
      initial={shouldAnimate ? 'hidden' : false}
      animate={shouldAnimate ? 'visible' : false}
      custom={{
        delay: navIndex !== undefined ? navIndex * MOBILE_VERTICAL_STACK.stagger / 1000 : 0,
        distance: MOBILE_VERTICAL_STACK.distance,
      }}
    >
      {linkContent}
    </motion.li>
  ) : (
    <li className="nav-item">
      {linkContent}
    </li>
  )
}

// === TradLink (traditional anchor navigation) ===
interface TradLinkProps {
  to: string
  children: React.ReactNode
  isHomePage?: boolean
  atTop?: boolean
  currentPath?: string
  onNavClick?: (e: React.MouseEvent<HTMLElement>, index: number, callback?: () => void) => void
  navIndex?: number
  activeNavIndex?: number | null
  collapsed?: boolean
}

export function TradLink({
  to,
  children,
  isHomePage,
  atTop,
  currentPath,
  onNavClick,
  navIndex,
  activeNavIndex,
  collapsed,
}: TradLinkProps) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 992
  const isMobile = useIsMobile()
  const shouldAnimate = !isDesktop && collapsed !== undefined ? !collapsed : false

  // Normalize paths for comparison (handle trailing slashes)
  const normalizePath = (path: string) => path.replace(/\/$/, '') || '/'
  const isPathActive = normalizePath(currentPath) === normalizePath(to)
  const isClickActive = !isDesktop && activeNavIndex === navIndex

  // Build class list
  const classNames = ['nav-link']
  if (isPathActive) classNames.push('current-page')
  if (isClickActive) classNames.push('manual-active')

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onNavClick !== undefined && navIndex !== undefined) {
      const isMobileView = typeof window !== 'undefined' && window.innerWidth < 992

      if (isMobileView) {
        onNavClick(e, navIndex, () => {
          window.location.href = to
        })
      } else {
        onNavClick(e, navIndex)
      }
    }
  }

  const linkContent = (
    <a
      href={to}
      className={classNames.join(' ')}
      onClick={handleClick}
      aria-current={isPathActive ? 'page' : undefined}
    >
      <span>{children}</span>
    </a>
  )

  return isMobile ? (
    <motion.li
      className="nav-item"
      variants={fadeInUpVariants}
      initial={shouldAnimate ? 'hidden' : false}
      animate={shouldAnimate ? 'visible' : false}
      custom={{
        delay: navIndex !== undefined ? navIndex * MOBILE_VERTICAL_STACK.stagger / 1000 : 0,
        distance: MOBILE_VERTICAL_STACK.distance,
      }}
    >
      {linkContent}
    </motion.li>
  ) : (
    <li className="nav-item">
      {linkContent}
    </li>
  )
}

// Default export: Nav with hardcoded navigation links (matches original Gatsby Navigation.tsx)
export default function NavBar() {
  return (
    <Nav>
      <TradLink to="/">Home</TradLink>
      <TradLink to="/resume">Resume</TradLink>
      <TradLink to="/blog">Blog</TradLink>
      <TradLink to="/about">About</TradLink>
      <TradLink to="/projects">Projects</TradLink>
      <TradLink to="/contact">Contact</TradLink>
    </Nav>
  )
}
