import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components'

import { theme } from '../style.js'
import { Overlay, Text } from './style.js'
	
export default class Introduction extends Component  {
	render() {
		return (
      <ThemeProvider theme={theme}>
        <section className="hero-wrap js-fullheight">
          <Overlay></Overlay>
          <div className="container">
            <div className="row no-gutters slider-text js-fullheight justify-content-center align-items-center">
              <div className="col-lg-8 col-md-6 ftco-animate d-flex align-items-center">
                <Text className="text-center">
                  <span className="subheading">Hey! I am</span>
                  <h1>Casey Key</h1>
                  <h2>I'm a 
                    <span className="txt-rotate" data-period={2000} data-rotate='[ "Coder.", "Maker.", "Entrepreneur.", "Teacher." ]' />
                  </h2>
                </Text>
              </div>
            </div>
          </div>
          <div className="mouse">
            <a href="#" className="mouse-icon">
              <div className="mouse-wheel"><span className="ion-ios-arrow-round-down" /></div>
            </a>
          </div>
        </section>
      </ThemeProvider>
    );
  }
}