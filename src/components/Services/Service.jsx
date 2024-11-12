import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { ServiceContainer } from './style'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'
import { scroller } from 'react-scroll'

export default class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
    this.makeVisible = this.makeVisible.bind(this);
  }

  makeVisible() {
    this.setState({visible: true});
  }

  
  render() {
    let Scroll = require('react-scroll');
    let scroller = Scroll.scroller;
    
    let visible = this.state.visible;
    let Icon = this.props.icon;
    let service = this.props.service;
    let description = this.props.children;
    let link = this.props.link;
    let button = this.props.button;

    return (
      <Animated animationIn="fadeInUp" isVisible={visible}>
        <ServiceContainer className="shadow">
          <Icon className="icon" />
          <Waypoint onEnter={this.makeVisible}></Waypoint>
          <div className="desc">
            <h3 className="mb-5">{service}</h3>
            <p>{description}</p>
          </div>
          {link && <Button color="primary" href={link} target="_blank">{button || "More info"}</Button>}
          {!link && <Button color="primary" onClick={() => scroller.scrollTo('Contact', {smooth: true})}>{button || "Contact me"}</Button>}
        </ServiceContainer>
      </Animated>
    );
  }
}