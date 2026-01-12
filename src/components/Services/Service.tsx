import React from 'react'
import { Button } from '../style'
import { ServiceContainer } from './style'

export default function Service(props) {
  const Icon = props.icon;
  const service = props.service;
  const description = props.children;
  const link = props.link;
  const button = props.button;

  return (
    <ServiceContainer className="shadow" {...props}>
      <Icon className="icon" />
      <div className="desc">
        <h3 className="mb-5">{service}</h3>
        <p>{description}</p>
      </div>
      {link && <Button color="primary" href={link} target="_blank">{button || "More info"}</Button>}
      {!link && <Button color="primary" onClick={() => {
        const Scroll = require('react-scroll');
        Scroll.scroller.scrollTo('Contact', {smooth: true});
      }}>{button || "Contact me"}</Button>}
    </ServiceContainer>
  );
}