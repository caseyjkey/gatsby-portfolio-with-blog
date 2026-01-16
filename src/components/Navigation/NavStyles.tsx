import styled from 'styled-components'

// Header glass opacity values (shared across header and dropdown)
const GLASS_OPACITY = 0.7;
const PRIMARY_COLOR = '#3e64ff';

// Consolidated navbar styles - all in one place
export const StyledNav = styled.nav<{ $isVisible: boolean; $scrolled: boolean; $menuOpen: boolean }>`
  padding-left: 2rem;
  padding-right: 2rem;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 100;
  /* Use top positioning instead of transform to avoid breaking fixed children */
  top: ${props => props.$isVisible ? '0' : '-100px'};
  transition: top 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;

  /* Unified styles for all states - header matches drawer when menu open */
  background-color: transparent !important;
  ${props => {
    if (props.$isVisible && (props.$menuOpen || props.$scrolled)) {
      return `background-color: rgba(255, 255, 255, ${GLASS_OPACITY}) !important;`
    }
    return ''
  }}
  backdrop-filter: ${props => {
    if (!props.$isVisible) return 'none'
    if (props.$menuOpen) return 'blur(40px)'
    if (props.$scrolled) return 'blur(16px)'
    return 'none'
  }};
  -webkit-backdrop-filter: ${props => {
    if (!props.$isVisible) return 'none'
    if (props.$menuOpen) return 'blur(40px)'
    if (props.$scrolled) return 'blur(16px)'
    return 'none'
  }};

  /* Bottom border - slate-100/50 equivalent */
  border-bottom: 1px solid rgba(241, 245, 249, 0.5) !important;
  ${props => {
    // Mobile: fade border when menu is open
    if (props.$menuOpen && typeof window !== 'undefined' && window.innerWidth < 992) {
      return 'border-bottom-color: transparent !important;'
    }
    return ''
  }}

  /* Only show border/shadow when visible AND scrolled/menu is open */
  ${props => {
    if (!props.$isVisible) return ''
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

    /* Desktop nav-link styles - font-weight 500 */
    && .navbar-nav > .nav-item > .nav-link {
      font-weight: 500 !important;

      /* Add :before pseudo-element for underline - matches mobile style */
      > span {
        position: relative;
        text-underline-offset: 4px;

        &:before {
          content: "" !important;
          position: absolute !important;
          width: 100% !important;
          height: 2px !important;
          bottom: 4px !important;
          left: 0 !important;
          background: ${PRIMARY_COLOR} !important;
          transform: scaleX(0) !important;
          transform-origin: center !important;
          transition: transform 0.3s ease-in-out !important;
        }
      }

      /* Hover state - growing blue underline from center (not for active pages) */
      &:hover:not(.active):not(.current-page):not(.react-scroll-active):not([aria-current="page"]) {
        color: ${PRIMARY_COLOR} !important;

        > span:before {
          transform: scaleX(1) !important;
        }
      }

      /* Active page - static underline */
      &.active,
      &.current-page,
      &.react-scroll-active,
      &[aria-current="page"] {
        color: ${PRIMARY_COLOR} !important;

        > span:before {
          transform: scaleX(1) !important;
        }
      }
    }
  }

  /* Mobile nav-link styles - NO underlines (but allow active state underlines in StyledCollapse) */
  @media (max-width: 991.98px) {
    && .navbar-nav > .nav-item > .nav-link {
      /* Reset :before pseudo-element from SCSS (mobile uses text-decoration for underlines) */
      > span:before {
        display: none !important;
      }
    }
  }

  @media (max-width: 991.98px) {
    /* Header stays fixed at top, drawer grows downward */
  }
`

export const StyledCollapse = styled.div<{ $isOpen: boolean }>`
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  padding: ${props => props.$isOpen ? '1rem 2rem' : '0'};
  box-shadow: none;

  /* Desktop: always visible, transparent background */
  @media (min-width: 992px) {
    opacity: 1;
    visibility: visible;
    background-color: transparent !important;
  }

  /* Mobile dropdown styles */
  @media (max-width: 991.98px) {
    /* No position:fixed - allows backdrop-filter to work */
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    margin-top: 1rem !important; /* Space below header */
    padding: 1rem 0 2rem 0 !important;
    /* Extend drawer to viewport bottom with flex grow */
    flex: 1 1 auto !important;
    min-height: calc(100vh - 85px) !important;
    min-height: calc(100dvh - 85px) !important;
    opacity: ${props => props.$isOpen ? 1 : 0} !important;
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'} !important;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    overflow-y: auto !important;
    overflow-x: hidden !important;

    .navbar-nav {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      width: 100% !important;
      max-width: 100% !important;
      gap: clamp(0.5rem, 2vh, 1.5rem) !important; /* Responsive gap: min 0.5rem, scales with vh, max 1.5rem */
      margin: 0 auto !important;
      padding: 1rem 0 2rem 0 !important; /* Add padding to push content to fill drawer */
      height: 100% !important;
      flex: 1 0 auto !important;
      justify-content: center !important; /* Center content vertically in available space */
      position: relative;
      z-index: 1;
    }

    .nav-item {
      width: 280px; /* Fixed width instead of max-width */
      min-width: 280px; /* Prevent shrinking */
      max-width: 280px; /* Prevent growing */
      display: flex;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-link {
      /* FIXED dimensions - prevent ANY size change on click/active */
      width: 280px !important;
      min-width: 280px !important;
      max-width: 280px !important;
      height: 72px !important; /* Increased from 60px */
      min-height: 72px !important;
      max-height: 72px !important;
      padding: 0 2rem !important; /* Use 0 vertical padding since height is fixed */
      margin: 0 !important;
      box-sizing: border-box !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 1.8rem; /* Increased from 1.6rem */
      font-weight: 900; /* Increased from 800 */
      letter-spacing: 0.1em;
      color: #000000 !important;
      position: relative;
      border: none !important;
      outline: none !important;
      text-decoration: none !important;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
      transition: color 0.2s ease;

      &:hover {
        color: ${PRIMARY_COLOR} !important;
      }

      &.active,
      &.current-page,
      &.react-scroll-active,
      &[aria-current="page"] {
        color: ${PRIMARY_COLOR} !important;
        > span {
          text-decoration: underline !important;
          text-underline-offset: 4px;
          text-decoration-thickness: 2px;
          text-decoration-color: ${PRIMARY_COLOR} !important;
        }
      }

      &.manual-active {
        color: ${PRIMARY_COLOR} !important;
      }
    }
  }
`
