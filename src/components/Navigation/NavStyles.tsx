import styled from 'styled-components'

// Header glass opacity values (shared across header and dropdown)
const HEADER_GLASS_OPACITY = 0.85; // Decreased from 0.8
const MENU_OPEN_OPACITY = 0.90; // Decreased from 0.95

// Consolidated navbar styles - all in one place
export const StyledNav = styled.nav<{ $isVisible: boolean; $scrolled: boolean; $menuOpen: boolean }>`
  padding-left: 2rem;
  padding-right: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease;
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(-100%)'};

  /* Unified styles for all states */
  background-color: ${props => {
    if (!props.$isVisible) return 'transparent' // Don't apply background when hidden
    if (props.$menuOpen) return `rgba(255, 255, 255, ${MENU_OPEN_OPACITY})`
    if (props.$scrolled) return `rgba(255, 255, 255, ${HEADER_GLASS_OPACITY})`
    return 'transparent'
  }};
  backdrop-filter: ${props => (!props.$isVisible || (!props.$scrolled && !props.$menuOpen)) ? 'none' : 'blur(12px)'};
  -webkit-backdrop-filter: ${props => (!props.$isVisible || (!props.$scrolled && !props.$menuOpen)) ? 'none' : 'blur(12px)'};

  /* Only show border/shadow when visible AND scrolled/menu is open */
  ${props => {
    if (!props.$isVisible) return ''
    if (props.$menuOpen) {
      return 'box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);'
    }
    if (props.$scrolled) {
      return 'box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);'
    }
    return 'box-shadow: none;'
  }}

  /* Ensure navbar brand and links are black on white background when scrolled/menu open */
  .navbar-brand {
    color: ${props => (props.$scrolled || props.$menuOpen) ? '#000000 !important' : '#000000'};
  }

  .nav-link {
    color: ${props => (props.$scrolled || props.$menuOpen) ? '#000000 !important' : '#000000'};
  }

  /* Desktop nav alignment - use && for higher specificity */
  @media (min-width: 992px) {
    display: flex;
    align-items: center;

    > .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    /* Hide hamburger menu on desktop */
    .navbar-toggler {
      display: none !important;
    }

    .navbar-collapse {
      flex: 0 0 auto;
      display: flex;
      justify-content: flex-end;
    }

    && .navbar-nav {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: flex-end !important;
      margin-left: auto !important;
      margin-right: 0 !important;
    }
  }

  @media (max-width: 991.98px) {
    /* Mobile uses same unified styles - no separate black background */
  }
`

export const StyledCollapse = styled.div<{ $isOpen: boolean }>`
  position: ${props => props.$isOpen ? 'absolute' : 'static'};
  top: ${props => props.$isOpen ? '100%' : 'auto'};
  left: 0;
  right: 0;
  background-color: ${props => props.$isOpen ? `rgba(255, 255, 255, ${HEADER_GLASS_OPACITY})` : 'transparent'};
  backdrop-filter: ${props => props.$isOpen ? 'blur(12px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.$isOpen ? 'blur(12px)' : 'none'};
  border-top: ${props => props.$isOpen ? '1px solid rgba(0, 0, 0, 0.08)' : 'none'};
  padding: ${props => props.$isOpen ? '1rem 2rem' : '0'};
  overflow: hidden;

  /* Desktop: always visible */
  @media (min-width: 992px) {
    opacity: 1;
    visibility: visible;
  }

  /* Mobile dropdown styles only */
  @media (max-width: 991.98px) {
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.2s ease, visibility 0.2s ease;

    .navbar-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .nav-link {
      padding: 1.25rem 1.5rem !important;
      font-size: 1.1rem;
      color: #000000 !important; /* Ensure black text on white background */
    }
  }
`
