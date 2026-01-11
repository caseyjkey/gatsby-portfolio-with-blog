import styled from 'styled-components'

interface SliderProps {
  isFinished?: boolean;
}

export const HeroWrap = styled.section`
  width: 100%;
  z-index: 10;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  box-sizing: border-box;

  /* Desktop Default */
  .resume-responsive-container {
    top: 65%;
  }

  .col-6-responsive {
    width: 50%; /* Represents the left half */
  }

  /* Mobile Breakpoint (Matches your overlay) */
  @media (max-width: 767.98px) {
    .resume-responsive-container {
      top: 60% !important; /* Below the arrow (at 50%), above the SVG */
      transform: translateX(-50%) !important;
    }

    .col-6-responsive {
      width: 100%; /* Spans full width to allow the button to center on screen */
      flex: 0 0 100%;
    }

    #resume {
      transform: none !important;
    }
  }

  @media (max-width: 767.98px) {
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    overflow-x: hidden;
    overflow-y: visible;
    padding-top: 70px;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 65%;
  content: '';
  opacity: .08;
  background: ${(props) => props.theme.primaryColor};
  span.icon {
    margin-right: 0.7em;
  }
  @media (max-width: 767.98px) {
    height: 50%;
  }
`;

export const Text = styled.div`
  @media (max-width: 767.98px) {
    margin-top: 1em;
  }

  #resume {
    margin-top: 0rem;
  }
  @media (max-width: 767.98px) {
    #resume {
      margin-top: 0rem;
    }
  }
  width: 100%;
  transition: transform 0.3s ease-out;
  will-change: transform;
`;

export const Subheader = styled.h3`
  font-size: 36px;
  font-weight: 900;
  color: ${(props) => props.theme.primaryColor};
  letter-spacing: 4px;
  
  @media (max-width: 767.98px) {
    font-size: 28px;
    letter-spacing: 2px;
  }
  
  @media (max-height: 600px) {
    font-size: 24px;
    letter-spacing: 1px;
  }
`;

export const Header = styled.h1`
  color: ${(props) => props.theme.black}
  font-size: 69px;
  font-weight: 900;
  @media (max-width: 767.98px) {
    font-size: 40px;
  }
  
  @media (max-height: 600px) {
    font-size: 32px;
  }
`;

export const Slider = styled.div<SliderProps>`
  color: ${(props) => props.theme.black};
  font-weight: 500;
  min-height: 180px; 
  display: flex;
  flex-direction: column;
  align-items: center;

  .subheader {
    font-weight: 500;
    font-size: 1.1em;
    color: ${(props) => props.theme.darken};
    margin: 0.2em 0; /* Maintains your exact text spacing */
  }

  #typewriter {
    position: relative; /* Context for absolute layers */
    margin-bottom: 6rem;
    transition-delay: 0.3s; /* Smooth timing gap */    height: 120px; 
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }

  /* Layers sit in the same physical spot to prevent the jump */
  .view-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: opacity 0.6s ease-in-out;
  }

  .typewriter-cursor {
    color: ${(props) => props.theme.primaryColor};
    animation: blink 1s step-end infinite;
  }

  .tech-view {
    /* Fades out the technical block including cursor */
    opacity: ${(props) => (props.isFinished ? 0 : 1)};
    visibility: ${(props) => (props.isFinished ? 'hidden' : 'visible')};
    pointer-events: ${(props) => (props.isFinished ? 'none' : 'auto')};
    
    /* We transition opacity normally, but we add a 0.6s delay to visibility ONLY when hiding */
    transition: opacity 0.6s ease-out, 
                visibility 0s linear ${props => (props.isFinished ? '0.6s' : '0s')};    z-index: ${props => (props.isFinished ? 1 : 2)};

    .typewriter-cursor {
      /* Kill cursor immediately on finish to stop jarring visual artifacts */
      display: ${(props) => (props.isFinished ? 'none' : 'inline-block')};
    }
  }

  .social-view {
    /* Reveal social block after tech-view is gone */
    opacity: ${(props) => (props.isFinished ? 1 : 0)};
    visibility: ${(props) => (props.isFinished ? 'visible' : 'hidden')};
    pointer-events: ${(props) => (props.isFinished ? 'auto' : 'none')};
    transition-delay: 0.6s; /* Smooth timing gap */
    z-index: ${props => (props.isFinished ? 2 : 1)};
  }

  span#name {
    color: ${(props) => props.theme.primaryColor};
    font-weight: 600;
  }

  #typewriter1 {
    font-family: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
    font-weight: 600;
    color: ${(props) => props.theme.black};
  }

  #typewriter2 {
    font-family: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
    font-weight: 400;
    font-size: 0.9em;
    color: ${(props) => props.theme.darken};
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @media (max-width: 767.98px) {
    min-height: 120px;
    #typewriter {
      height: 100px; /* Space for text wrapping on mobile */
      margin-bottom: 1rem; /* Reduced from 6rem */
    }
    .subheader {
      font-size: 0.95em;
    }
  }
`;