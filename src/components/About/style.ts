import styled from 'styled-components'
import { Section, Image, NoPaddingTop, NoPaddingBottom } from '../style.ts' // Global styles

export const AboutSection = styled.section`
	margin-top: 6em;
	${Image}
	${Section}
	${NoPaddingTop}
	${NoPaddingBottom}
	flex: 1 0 auto;

	ul.about-info {
		margin: 0;
		padding: 0;
		word-break: break-word;
		li {
			list-style: none;
			margin-bottom: 10px;
			color: ${props => props.theme.black};
			display: flex; /* Make li a flex container */
			align-items: center; /* Vertically center icon and text */

			span { /* For the description text */
				margin-left: 0; /* Remove margin to align text with Description */
			}
		}
	}
`;

export const ActivityIconWrapper = styled.div`
  margin-left: calc(-50px - 2em); /* Pull icon back to the left edge */
  margin-right: 2em;
  min-width: 50px; /* Use min-width to ensure the circle doesn't shrink */
  height: 50px;
  background: ${(props) => props.theme.primaryColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${(props) => props.theme.white};
    font-size: 28px;
    margin: 0; /* Override any default margin */
  }

  /* Specific icon adjustments */
  &[data-icon-name*="Music"] svg,
  &[data-icon-name*="music"] svg {
    margin-right: 3px;
  }

  &[data-icon-name*="Book"] svg,
  &[data-icon-name*="book"] svg {
    margin-top: 3px;
  }
`;

export const Description = styled.p`
	@media (max-width: 375px) {
		padding-left: 0.5rem !important;
	}
	color: ${props => props.theme.black};
	text-align: left;
`;

export const AboutImage = styled.div`
	display: none; /* Hidden by default for screens < 767px */
	z-index: 0;
	position: relative;
	margin-left: 32px; /* Clean gutter spacing */
	align-self: flex-start; /* Top-align with first line of bio text */

	/* Visible for screens >= 767px */
	@media (min-width: 767px) {
		display: block;
	}

	/* Responsive sizing: 767px to 1024px */
	@media (min-width: 767px) and (max-width: 1024px) {
		max-width: 280px;
	}

	/* Responsive sizing: 1024px+ */
	@media (min-width: 1025px) {
		max-width: 350px;
	}

	/* Dual-layered background blur - Layer 1 (outer) */
	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background-color: ${props => props.theme.primaryColor}33; /* 20% opacity */
		filter: blur(40px); /* blur-2xl */
		z-index: -1;
	}

	/* Dual-layered background blur - Layer 2 (inner) */
	&::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background-color: ${props => props.theme.primaryColor}1A; /* 10% opacity */
		filter: blur(100px);
		z-index: -1;
	}

	img {
		width: 100%;
		height: auto;
		object-fit: contain;
		margin-top: -30px;
		filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.18));
	}

	${Image}
`;

export const Counter = styled.div`
	font-size: 20px;
	span {
		font-weight: 400;
		color: ${(props) => props.theme.black};
	}
	span.number {
		color: ${(props) => props.theme.primaryColor};
		font-weight: 600;
	}

	@media (max-width: 375px) {
		padding-left: 0.5rem !important;
	}
`;

export const ConsultantIdentity = styled.div`
	margin-top: 2rem;
	margin-left: calc(-1.5rem - 4px); /* Shift container left to align text with Description */
	padding: 1.5rem;
	background-color: ${props => props.theme.lightGray || '#f8f9fa'};
	border-left: 4px solid ${props => props.theme.primaryColor};
	border-radius: 4px;
	text-align: left;

	h3 {
		font-size: 1.2rem;
		font-weight: 600;
		color: ${props => props.theme.primaryColor};
		margin-bottom: 1rem;
		text-align: left;
	}

	p {
		color: ${props => props.theme.black};
		margin-bottom: 0.5rem;
		font-size: 0.95rem;
		line-height: 1.6;
		text-align: left;
	}

	@media (max-width: 375px) {
		padding: 1rem;
		margin-left: calc(-1rem - 0.0rem);
		margin-right: -0.5rem;
	}
`;