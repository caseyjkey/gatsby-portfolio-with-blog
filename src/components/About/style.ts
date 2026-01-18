import styled from 'styled-components'
import { Section, Image, NoPaddingTop, NoPaddingBottom } from '../style.ts' // Global styles

/*
 * Alignment System for About Page
 * ================================
 * The header circle (navbar-brand::after) is:
 *   - 40px diameter
 *   - Positioned at left: -11px from the brand text
 *   - Brand text is at the left edge of the Container
 *   - So circle center is at: -11px + 20px = 9px from container left
 *
 * Activity icons (50px desktop, 40px mobile) should center-align with header circle.
 * Bio text and Consultant border should left-align with icon left edge.
 *
 * Desktop (50px icon): center at 9px → left edge at 9px - 25px = -16px
 * Mobile (40px icon): center at 9px → left edge at 9px - 20px = -11px
 *
 * Since Container has 15px padding on each side, we offset from the content area.
 */
const ICON_SIZE_DESKTOP = 35; // Reduced by 30% from 50px
const ICON_SIZE_MOBILE = 40;
const ICON_GAP = 16; // Gap between icon and text

export const AboutSection = styled.section`
	margin-top: 6em;
	${Image}
	${Section}
	${NoPaddingTop}
	${NoPaddingBottom}
	flex: 1 0 auto;

	/* CSS custom properties for alignment */
	--icon-size: ${ICON_SIZE_DESKTOP}px;
	--icon-gap: ${ICON_GAP}px;
	/* Content left edge aligns with icon left edge */
	--content-indent: 0px;

	@media (max-width: 767.98px) {
		--icon-size: ${ICON_SIZE_MOBILE}px;
	}

	ul.about-info {
		margin: 0;
		padding: 0;
		word-break: break-word;
		li {
			list-style: none;
			margin-bottom: 16px;
			color: ${props => props.theme.black};
			display: flex; /* Make li a flex container */
			align-items: center; /* Vertically center icon and text */

			&:last-child {
				margin-bottom: 0;
			}

			span { /* For the description text */
				margin-left: 0; /* Text follows after icon + gap */
			}
		}
	}
`;

export const ActivityIconWrapper = styled.div`
  /* Use CSS custom properties for responsive sizing */
  width: var(--icon-size);
  min-width: var(--icon-size);
  height: var(--icon-size);
  margin-right: var(--icon-gap);
  flex-shrink: 0;

  background: ${(props) => props.theme.primaryColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${(props) => props.theme.white};
    /* Scale icon size proportionally with wrapper */
    font-size: calc(var(--icon-size) * 0.56); /* 28px at 50px = 0.56 ratio */
    margin: 0;
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
	color: ${props => props.theme.black};
	text-align: left;
	/* Left edge aligns with icon left edge (both start at same position in flow) */
	margin-left: 0;
	margin-bottom: 1.5rem; /* 24px - combines with Row mt-4 for 48px total gap */
`;

export const AboutImage = styled.div`
	display: none; /* Hidden by default for screens < 767px */
	z-index: 0;
	position: relative;
	align-self: flex-start; /* Top-align with first line of bio text */

	/* Visible for screens >= 767px */
	@media (min-width: 767px) {
		display: block;
		width: 280px;
		margin-top: -50px;
	}

	/* Responsive sizing: 767px to 1024px */
	@media (min-width: 767px) and (max-width: 1024px) {
		max-width: 280px;
	}

	/* Responsive sizing: 1024px+ */
	@media (min-width: 1025px) {
		/* max-width: 350px; */
	}

	/* Dual-layered background blur - Layer 1 (outer) - Sharper effect */
	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background-color: ${props => props.theme.primaryColor}26; /* 15% opacity */
		filter: blur(20px); /* Reduced from 40px for sharper effect */
		z-index: -1;
	}

	/* Dual-layered background blur - Layer 2 (inner) - Sharper effect */
	&::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background-color: ${props => props.theme.primaryColor}1A; /* 10% opacity */
		filter: blur(50px); /* Reduced from 100px for sharper effect */
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
	/* Row already has my-4 margin, no additional margin-top needed */
	margin-top: 0;
	/* Left border aligns with icon left edge (both start at same position in flow) */
	margin-left: 0;
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
	}
`;