import React, { Component } from 'react'

export default class About extends Component {
  render() {
    return (
      <section className="ftco-about img ftco-section ftco-no-pt ftco-no-pb" id="about-section">
        <div className="container">
          <div className="row d-flex no-gutters">
            <div className="col-md-6 col-lg-6 d-flex">
              <div className="img-about img d-flex align-items-stretch">
                <div className="overlay" />
                <div className="img d-flex align-self-stretch align-items-center" style={{backgroundImage: 'url(images/about.jpg)'}}>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 pl-md-5 py-5">
              <div className="row justify-content-start pb-3">
                <div className="col-md-12 heading-section ftco-animate">
                  <h1 className="big">About</h1>
                  <h2 className="mb-4">About Me</h2>
                  <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                  <ul className="about-info mt-4 px-md-0 px-2">
                    <li className="d-flex"><span>Name:</span> <span>Ronaldo Fredrickson</span></li>
                    <li className="d-flex"><span>Date of birth:</span> <span>November 28, 1989</span></li>
                    <li className="d-flex"><span>Address:</span> <span>San Francisco CA 97987 USA</span></li>
                    <li className="d-flex"><span>Zip code:</span> <span>1000</span></li>
                    <li className="d-flex"><span>Email:</span> <span>ronaldo@gmail.com</span></li>
                    <li className="d-flex"><span>Phone: </span> <span>+1-2234-5678-9-0</span></li>
                  </ul>
                </div>
              </div>
              <div className="counter-wrap ftco-animate d-flex mt-md-3">
                <div className="text">
                  <p className="mb-4">
                    <span className="number" data-number={120}>0</span>
                    <span>Project complete</span>
                  </p>
                  <p><a href="#" className="btn btn-primary py-3 px-3">Download CV</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}