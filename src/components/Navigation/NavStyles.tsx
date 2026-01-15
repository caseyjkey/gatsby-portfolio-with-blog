import styled from 'styled-components'

// Header glass opacity values (shared across header and dropdown)
const GLASS_OPACITY = 0.88;
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
  transition: top 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, backdrop-filter 0.3s ease;

  /* Unified styles for all states - header matches drawer when menu open */
  background-color: ${props => {
    if (!props.$isVisible) return 'transparent'
    if (props.$menuOpen || props.$scrolled) return `rgba(255, 255, 255, ${GLASS_OPACITY})`
    return 'transparent'
  }};
  backdrop-filter: ${props => (!props.$isVisible || (!props.$scrolled && !props.$menuOpen)) ? 'none' : 'blur(16px)'};
  -webkit-backdrop-filter: ${props => (!props.$isVisible || (!props.$scrolled && !props.$menuOpen)) ? 'none' : 'blur(16px)'};

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
  }

  @media (max-width: 991.98px) {
    /* When menu open: extend nav to full viewport */
    ${props => props.$menuOpen ? `
      top: 0 !important;
      bottom: 0 !important;
      height: 100vh !important;
      height: 100dvh !important;
      overflow: hidden !important;
    ` : ''}
  }
`

export const StyledCollapse = styled.div<{ $isOpen: boolean }>`
  background-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  padding: ${props => props.$isOpen ? '1rem 2rem' : '0'};
  box-shadow: none;

  /* Desktop: always visible */
  @media (min-width: 992px) {
    opacity: 1;
    visibility: visible;
  }

  /* Mobile dropdown styles */
  @media (max-width: 991.98px) {
    /* No position:fixed - allows backdrop-filter to work */
    display: flex !important;
    flex-direction: column !important;
    width: 100vw !important;
    margin-left: -2rem !important; /* Offset nav padding */
    margin-top: 1rem !important; /* Space below header */
    padding: 1rem 2rem 2rem 2rem !important;
    min-height: calc(100vh - 85px) !important;
    min-height: calc(100dvh - 85px) !important;
    opacity: ${props => props.$isOpen ? 1 : 0} !important;
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'} !important;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    /* Transparent - nav provides the glassmorphism */
    background: transparent !important;

    .navbar-nav {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      width: 100% !important;
      max-width: 100% !important;
      gap: 1rem !important;
      margin: 0 auto !important;
      padding: 0 !important;
      height: auto !important;
      min-height: 0 !important;
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
      opacity: ${props => props.$isOpen ? 1 : 0};
      transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(20px)'};
      transition: opacity 0.4s ease, transform 0.4s ease;

      /* Stagger animation - 0.05s delay per item */
      &:nth-child(1) { transition-delay: ${props => props.$isOpen ? '0s' : '0s'}; }
      &:nth-child(2) { transition-delay: ${props => props.$isOpen ? '0.05s' : '0s'}; }
      &:nth-child(3) { transition-delay: ${props => props.$isOpen ? '0.1s' : '0s'}; }
      &:nth-child(4) { transition-delay: ${props => props.$isOpen ? '0.15s' : '0s'}; }
      &:nth-child(5) { transition-delay: ${props => props.$isOpen ? '0.2s' : '0s'}; }
      &:nth-child(6) { transition-delay: ${props => props.$isOpen ? '0.25s' : '0s'}; }
    }

    .nav-link {
      /* FIXED dimensions - prevent ANY size change on click/active */
      width: 280px !important;
      min-width: 280px !important;
      max-width: 280px !important;
      height: 60px !important;
      min-height: 60px !important;
      max-height: 60px !important;
      padding: 0 2rem !important; /* Use 0 vertical padding since height is fixed */
      margin: 0 !important;
      box-sizing: border-box !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #000000 !important;
      position: relative;
      background: rgba(62, 100, 255, 0.25);
      border-radius: 12px;
      transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      will-change: background-color;
      border: none !important;
      outline: none !important;
      text-decoration: none !important;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;

      /* Reset ALL underline sources */
      &, &:link, &:visited, &:hover, &:focus, &:active {
        width: 280px !important;
        min-width: 280px !important;
        max-width: 280px !important;
        height: 60px !important;
        padding: 0 2rem !important;
        margin: 0 !important;
        text-decoration: none !important;
        text-decoration-line: none !important;
        border-bottom: none !important;
        border: none !important;
        outline: none !important;
      }

      /* Prevent child elements from having underline */
      > span {
        text-decoration: none !important;
        text-decoration-line: none !important;
        border-bottom: none !important;
        border: none !important;
      }

      &:hover {
        color: ${PRIMARY_COLOR} !important;
        background: rgba(62, 100, 255, 0.35);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }

      /* Active state for current page - single underline on the link text */
      &.active,
      &.manual-active,
      &.react-scroll-active,
      &.current-page {
        color: ${PRIMARY_COLOR} !important;
        background: rgba(62, 100, 255, 0.4);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

        /* Single underline via span only */
        > span {
          text-decoration: underline !important;
          text-decoration-line: underline !important;
          text-underline-offset: 4px;
          text-decoration-thickness: 2px;
          text-decoration-color: ${PRIMARY_COLOR} !important;
        }
      }

      /* Ripple effect on click - contained within fixed button bounds */
      &.ripple-effect::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(62, 100, 255, 0.4);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
      }

      /* Ensure text stays above ripple */
      > * {
        position: relative;
        z-index: 1;
      }

      @keyframes ripple {
        0% {
          width: 0;
          height: 0;
          opacity: 0.6;
        }
        100% {
          width: 300px;
          height: 300px;
          opacity: 0;
        }
      }
    }
  }
`
