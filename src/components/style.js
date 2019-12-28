// This file contains common components and the global theme

import styled from 'styled-components'

export const theme = {
  primaryFont: "'Poppins', Arial, sans-serif",

  white: "#fff",
  black: "#000000",
  darken: "#232931",

  primaryColor: "#3e64ff",
  secondaryColor: "#a0f669",
};

export const Section = styled.section`
  padding: 7em 0;
  position: relative;
  @include media-breakpoint-down(sm){
    padding: 6em 0;
  }
`;