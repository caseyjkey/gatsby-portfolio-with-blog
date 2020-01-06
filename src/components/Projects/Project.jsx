import React, { Component } from 'react'
import { Card, CardText, CardSubtitle } from 'reactstrap'
import { StyledCard, Body, Header, Title, Subtitle, Text } from './style.js'

// Using a functional component because we don't use state, constructor, or lifecycle hooks
export default function Project({children, title, subtitle, icons}) {

  return (
    <StyledCard className="shadow">
      <Body className="p-0">
        <Header className="text-center">{title}</Header>
        <Subtitle>{subtitle}</Subtitle>
        <Text>{children}</Text>
      </Body>
    </StyledCard>
  );
}