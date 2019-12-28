import styled from 'styled-components'
import { Section, Image, NoPaddingTop, NoPaddingBottom } from '../style.js' // Global styles

export const AboutSection = styled.section`
	${Image}
	${Section}
	${NoPaddingTop}
	${NoPaddingBottom}
	$
	.img-about {
		width: 100%;
		z-index: 0;
		position: relative;
		.img {
			display: block;
			width: 100%;
			position: relative;
			z-index: 1;
		}
  }
	ul.about-info {
		display: inline-block;
		padding: 0;
		margin: 0;
		width: 100%;
		li {
			list-style: none;
			margin-bottom: 10px;
			span {
				width: calc(100% - 130px);
				&:first-child {
					font-weight: 600;
					color: ${(props) => props.theme.black};
					width: 130px;
				}
			}
		}
`;

export const AboutImage = styled.div`
	width: 100%;
	z-index: 0;
	position: relative;
	${Image}
}
`

const About = styled.section`
	.counter-wrap {
		.text {
			p {
				font-size: 20px;
				span {
					font-weight: 400;
					color: $black;
				}
				span.number {
					font-weight: 600;
					color: $primary;
				}
			}
		}
	}
}
`;