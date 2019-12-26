import styled from 'styled-components'

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
  font-size: 60px;
  font-weight: 800;
  @include media-breakpoint-down(sm){
    font-size: 40px;
  }
`;

export const Slider = styled.h2`
  && {
    font-weight: normal;
  }
  .txt-rotate {
    color: ${(props) => props.theme.primaryColor};
    text-decoration: underline;
  }
`;

