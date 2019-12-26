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