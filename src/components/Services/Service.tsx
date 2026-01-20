import React from 'react'
import { PrimaryButton } from '../style'
import { ServiceContainer } from './style'

export default function Service(props) {
  const Icon = props.icon;
  const service = props.service;
  const description = props.children;
  const link = props.link;
  const button = props.button;

  const handleContactClick = () => {
    const element = document.getElementById('Contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ServiceContainer className="shadow" {...props}>
      <Icon className="icon" />
      <div className="desc">
        <h3 className="mb-5">{service}</h3>
        <p>{description}</p>
      </div>
      {link && <PrimaryButton href={link} target="_blank">{button || "More info"}</PrimaryButton>}
      {!link && <PrimaryButton onClick={handleContactClick}>{button || "Contact me"}</PrimaryButton>}
    </ServiceContainer>
  );
}