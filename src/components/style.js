// This file contains common components and the global theme
import styled, { createGlobalStyle } from 'styled-components'
import { lighten } from 'polished'


export const theme = {
  primaryFont: "'Poppins'",

  white: "white",
  black: "black",
  darken: "#232931",

  primaryColor: "#3e64ff",
	secondaryColor: "#a0f669",
	
	breakpoints: { 
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200
	}
};

export const GlobalStyles = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');
	body {
		font-family: ${theme.primaryFont}, sans-serif;
	}
`;

export const Body = styled.div`
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

export const Heading = styled.h2`
  color: ${(props) => props.theme.black}
  position: relative;
  font-size: 50px;
  font-weight: 700;
  span{
    font-weight: 400;
  }
  @media (max-width: 767.98px) {
    font-size: 38px;
  }
`;

export const HeadingRaw = `
	position: relative;
	.subheading{
		font-size: 13px;
		font-weight: 500;
		display: block;
		margin-bottom: 5px;
		text-transform: uppercase;
		color: rgba(0,0,0,1);
		letter-spacing: 3px;
	}
	h1.big{
		position: absolute;
		top: 0px;
		left: 0;
		font-size: 7vw;
		color: rgba(255,255,255,.1);
		z-index: -1;
		font-weight: 900;
		&.big-2{
			right: 0;
		}
	}
	h2{
		font-size: 50px;
		font-weight: 700;
		span{
			font-weight: 400;
		}
		@include media-breakpoint-down(sm){
			font-size: 38px;
		}
	}
	&.heading-section-white{
		.subheading{
			color: rgba(255,255,255,.9) !important;
		}
		h2{
			color: $white;
		}
		p{
			color: rgba(255,255,255,.9);
		}
	}
`;
