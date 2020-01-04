import react, {Component} from 'react'
import style from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { ServicesSection } from './Services/style.js'

export default class Services extends Component {
  return() {
    <ServicesSection>
      <Container fluid={true} class="px-md-5">
        <div class="row justify-content-center py-5 mt-5">
          <div class="col-md-12 heading-section text-center ftco-animate">
            <h1 class="big big-2">Services</h1>
            <h2 class="mb-4">Services</h2>
            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 text-center d-flex ftco-animate">
            <a href="#" class="services-1 shadow">
              <span class="icon">
                <i class="flaticon-analysis"></i>
              </span>
              <div class="desc">
                <h3 class="mb-5">Web Design</h3>
                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
              </div>
            </a>
          </div>
          <div class="col-md-4 text-center d-flex ftco-animate">
            <a href="#" class="services-1 shadow">
              <span class="icon">
                <i class="flaticon-flasks"></i>
              </span>
              <div class="desc">
                <h3 class="mb-5">Phtography</h3>
                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
              </div>
            </a>
          </div>
          <div class="col-md-4 text-center d-flex ftco-animate">
            <a href="#" class="services-1 shadow">
              <span class="icon">
                <i class="flaticon-ideas"></i>
              </span>
              <div class="desc">
                <h3 class="mb-5">Web Developer</h3>
                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
              </div>
            </a>
          </div>

          <div class="col-md-4 text-center d-flex ftco-animate">
            <a href="#" class="services-1 shadow">
              <span class="icon">
                <i class="flaticon-innovation"></i>
              </span>
              <div class="desc">
                <h3 class="mb-5">App Developing</h3>
                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
              </div>
            </a>
          </div>
          <div class="col-md-4 text-center d-flex ftco-animate">
            <a href="#" class="services-1 shadow">
              <span class="icon">
                <i class="flaticon-ux-design"></i>
              </span>
              <div class="desc">
                <h3 class="mb-5">Branding</h3>
                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
              </div>
            </a>
          </div>
          <div class="col-md-4 text-center d-flex ftco-animate">
            <a href="#" class="services-1 shadow">
              <span class="icon">
                <i class="flaticon-idea"></i>
              </span>
              <div class="desc">
                <h3 class="mb-5">Product Strategy</h3>
                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </ServicesSection>
  }
}