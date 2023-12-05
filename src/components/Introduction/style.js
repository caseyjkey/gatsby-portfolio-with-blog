import styled from 'styled-components'

export const HeroWrap = styled.section`
  width: 100%;
  z-index: 10;
	height: 100%;
	position: inherit;
	background-size: cover;
	background-repeat: no-repeat;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: '';
  opacity: .1;
  width: 50%;
  background: ${(props) => props.theme.primaryColor};
  span.icon {
    margin-right: 0.7em;
  }
`;

export const Text = styled.div`
  @media (max-width: 767.98px) {
    margin-top: 6em;
  }
  width: 100%;
`;

export const Subheader = styled.h3`
  font-size: 36px;
  font-weight: 800;
  color: ${(props) => props.theme.primaryColor};
  letter-spacing: 4px;
`;
export const Header = styled.h1`
  color: ${(props) => props.theme.black}
  font-size: 69px;
  font-weight: 900;
  @media (max-width: 767.98px) {
    font-size: 40px;
  }
`;
export const Slider = styled.h2`
  color: ${(props) => props.theme.black}
  font-weight: 600;
  .header {
    font-size: 1.2em;
   //text-decoration: underline;
  }
  .subheader {
    font-weight: 600;
    font-size: 0.8em;
    color: ${(props) => props.theme.darken};
  }
  span#name {
    color: ${(props) => props.theme.primaryColor};
  }
  @media (max-width: 767.98px) {
      .header {
        font-size: 26px; 
      } 
  }
`;


