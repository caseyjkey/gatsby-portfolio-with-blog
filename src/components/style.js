// This file contains common components and the global theme
import styled from 'styled-components'
import { lighten } from 'polished'


export const theme = {
  primaryFont: "'Poppins', Arial, sans-serif",

  white: "#fff",
  black: "#000000",
  darken: "#232931",

  primaryColor: "#3e64ff",
  secondaryColor: "#a0f669",
};

export const Body = styled.body`
	font-family: ${theme.primaryFont};
	background: ${theme.white};
	font-size: 16px;
	line-height: 1.8;
	font-weight: 400;
  color: ${lighten(0.60, theme.black)};
  
	&.menu-show {
		overflow: hidden;
		position: fixed;
		height: 100%;
		width: 100%;
	}
`;

export const Section = `
  padding: 7em 0;
  position: relative;
  @media (max-width: 767.98px) {
    padding: 6em 0;
  }
`;

export const Image = `
  background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
`;

export const NoPaddingTop = `
  padding-top: 0 !important;  
`;

export const NoPaddingBottom = `
	padding-bottom: 0 !important;
`;