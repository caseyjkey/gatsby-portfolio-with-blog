import styled from 'styled-components'
import { theme, Section } from '../style.js'
import { Card, CardBody, CardHeader, CardTitle, CardSubtitle, CardText } from 'reactstrap'

export const ProjectSection = styled.section`
  ${Section}

`;

export const StyledCard = styled(Card)`
  height: 100%;
  padding-bottom: 2em;
`;

export const Body = styled(CardBody)`
  background-color: ${(props) => props.theme.white}
`;

export const Header = styled(CardHeader)`
  font-weight: 800;
  font-size: 30px;
  background-color: ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.white};
`;

export const Title = styled(CardHeader)`

`;

export const Subtitle = styled(CardSubtitle)`

`;

export const Text  = styled(CardText)`

`;