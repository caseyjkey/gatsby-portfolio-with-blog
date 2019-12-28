// This file contains common components and the global theme

import styled, { css } from 'styled-components'

export const theme = {
  primaryFont: "'Poppins', Arial, sans-serif",

  white: "#fff",
  black: "#000000",
  darken: "#232931",

  primaryColor: "#3e64ff",
  secondaryColor: "#a0f669",
};

export const Section = css`
  padding: 7em 0;
  position: relative;
  @include media-breakpoint-down(sm){
    padding: 6em 0;
  }
`;

export const Image = css`
  display: block;
	width: 100%;
	position: relative;
	z-index: 1;
`;

export const NoPaddingTop = `
  padding-top: 0 !important;  
`;

export const NoPaddingBottom = `
	padding-bottom: 0 !important;
`;

.ftco-no-pb{
}