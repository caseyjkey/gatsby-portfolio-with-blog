import styled from 'styled-components'

export const HeroWrap = styled.section`
  width: 100%;
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
  width: 100%;
`;

export const Subheader = styled.h3`
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 800;
  color: ${(props) => props.theme.primaryColor};
  letter-spacing: 4px;
`;
export const Header = styled.h1`
  color: ${(props) => props.theme.black}
  font-size: 60px;
  font-weight: 800;
  @media (max-width: 767.98px) {
    font-size: 40px;
  }
`;
export const Slider = styled.h2`
  color: ${(props) => props.theme.black}
  font-weight: 800;
  .txt-rotate {
    color: ${(props) => props.theme.primaryColor};
    text-decoration: underline;
  }
`;

/*  @media (max-width: 767.98px) {
    .slider-text h1 {
      font-size: 40px; } }
*/
