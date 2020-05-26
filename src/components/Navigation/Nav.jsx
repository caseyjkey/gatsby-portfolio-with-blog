import React, { useState } from 'react'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'
import { Container, NavbarToggler, Collapse } from 'reactstrap'
import { theme } from '../style.js'
import { Link as ScrollLink } from 'react-scroll'
import Button from './Hamburger'
import { Animated } from 'react-animated-css'

export function Nav({children}) {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <Navi  className="ftco-navbar-light navbar navbar-expand-lg navbar-dark ftco_navbar site-navbar-target" id="ftco-navbar">
      <Container>
        <a className="navbar-brand" href="index.html"><span>C</span>asey J. Key</a>
        <NavbarToggler onClick={toggleNavbar} className="js-fh5co-nav-toggle fh5co-nav-toggle" aria-label="Toggle navigation">
          <Button scrolled={false}/>
        </NavbarToggler>
        <Collapse isOpen={!collapsed} className="navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav nav ml-auto">
              {children}
            </ul>
        </Collapse>
      </Container>
    </Navi>
  );
}

export function Link({ to, children, offset}) {
  return (
      <li className="nav-item">
        <ScrollLink to={to} activeClass="active" spy={true} smooth="true" offset={offset} className="nav-link">
          <span>{children}</span>
        </ScrollLink>
      </li>
  );
};

const Navi = styled.nav`
  .ftco-navbar-light {
    background: transparent!important;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    // padding-top: 30px;
    ${breakpoint('md')`
      background: ${(props) => props.theme.black}!important;
      position: relative;
      top: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 15px;
      padding-right: 15px;
    `}
    .container{
      width: 1110px;
      margin: 0 auto;
      padding: 0;
    }

    .navbar-brand {
      color: ${(props) => props.theme.black};
      padding-top: .7rem;
      padding-bottom: .7rem;
      &:hover, &:focus{
        color: ${(props) => props.theme.black} !important;
      }
      ${breakpoint('md')`
        color: ${(props) => props.theme.white};
      `}
    }
    
    .navbar-nav {
      ${breakpoint('md')`
        padding-bottom: 20px;
        // margin-left: 20px !important;
        margin-right: 0;
      `}
      > .nav-item {
        > .nav-link {
          font-size: 16px;
          padding-top: .7rem;
          padding-bottom: .7rem;
          padding-left: 20px;
          padding-right: 20px;
          color: ${(props) => props.theme.black};
          font-weight: 400;
          opacity: 1!important;
          span {
            position: relative;
            display: block;
            padding-bottom: 2px;
            ${breakpoint('lg')`
              display: inline-block;
            `}
            &:before {
              content: "";
              position: absolute;
              width: 100%;
              height: 2px;
              bottom: 0;
              left: 0;
              background: ${(props) => props.theme.primaryColor};
              visibility: visible;
              -webkit-transform: scaleX(0);
              -moz-transform: scaleX(0);
              -ms-transform: scaleX(0);
              -o-transform: scaleX(0);
              transform: scaleX(0);
              -webkit-transition: all 0.3s ease-in-out 0s;
              -moz-transition: all 0.3s ease-in-out 0s;
              -ms-transition: all 0.3s ease-in-out 0s;
              -o-transition: all 0.3s ease-in-out 0s;
              transition: all 0.3s ease-in-out 0s;
            }
          }
          &:hover{
            span {
              &:before {
                visibility: visible;
                -webkit-transform: scaleX(1);
                -moz-transform: scaleX(1);
                -ms-transform: scaleX(1);
                -o-transform: scaleX(1);
                transform: scaleX(1);
              }
            }
          }
          ${breakpoint('md')`
            padding-left: 0;
            padding-right: 0;
            padding-bottom: 1rem;
            padding-top: 0;
            color: ${(props) => props.theme.white};
          `}
        }
        
        &.cta {
          > a {
            color: ${(props) => props.theme.white};
            border: 1px solid ${(props) => props.theme.primaryColor};
            padding-top: .7rem;
            padding-bottom: .7rem;
            padding-left: 18px;
            padding-right: 18px;
            background: ${(props) => props.theme.primaryColor};
            margin-top: 0;
            @include border-radius(5px);
            span {
              display: inline-block;
              color: ${(props) => props.theme.white};
            }
            &:hover{
              background: ${(props) => props.theme.primaryColor};
              border: 1px solid ${(props) => props.theme.primaryColor};
            }
          }
          &.cta-colored {
            a{
              border: 1px solid $secondary;
              background: $secondary !important;
            }
          }
        }
        
          .nav-link {
            &.active {
            background: transparent;
            background: none;
            color: ${(props) => props.theme.primaryColor};
            span {
              &:before {
                visibility: visible;
                -webkit-transform: scaleX(1);
                transform: scaleX(1);
              }
            }
          }
        }
        
        ${breakpoint('md')`
          &.active {
            > a {
              color: ${(props) => props.theme.primaryColor};
            }
          }
        `}
      }
    }
    .navbar-toggler {
      border: none;
      color: rgba(255,255,255,.5)!important;
      cursor: pointer;
      padding-right: 0;
      text-transform: uppercase;
      font-size: 16px;
      letter-spacing: .1em;
      &:hover, &:focus {
        text-decoration: none;
        color: ${(props) => props.theme.primaryColor};
        outline: none !important;
      }
    }
    
    &.scrolled  {
      position: fixed;
      right: 0;
      left: 0;
      top: 0;
      margin-top: -130px;
      background: ${(props) => props.theme.white}!important;
      box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
      padding: 0 15px;
      .nav-item {
        > .nav-link{
          color: ${(props) => props.theme.black} !important;
          ${breakpoint('md')`
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 20px !important;
          `}
        }
        &.active {
          > a {
            color: ${(props) => props.theme.primaryColor}!important;
          }
        }
        &.cta {
          > a {
            color: ${(props) => props.theme.white} !important;
            background: ${(props) => props.theme.primaryColor};
            border: none !important;
            padding-top: .5rem!important;
            padding-bottom: .5rem !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            margin-top: 5px !important;
            @include border-radius(5px);
            span {
              display: inline-block;
              color: ${(props) => props.theme.white} !important;
            }
          }
          &.cta-colored {
            span {
              border-color: ${(props) => props.theme.primaryColor};
            }
          }
        }
      }

      .navbar-nav {
        ${breakpoint('md')`
          background: none;
          border-radius: 0px;
          padding-left: 0!important;
          padding-right: 0!important;
          margin-left: 0 !important;
        `}
      }

      .navbar-toggler {
        border: none;
        color: rgba(0,0,0,.5)!important;
        border-color: rgba(0,0,0,.5)!important;
        cursor: pointer;
        text-transform: uppercase;
        font-size: 16px;
        letter-spacing: .1em;

      }
      .nav-link {
        color: ${(props) => props.theme.black}!important;
        &.active {
          color: ${(props) => props.theme.primaryColor}!important;
        }
      }
      &.awake {
        margin-top: 0px;
        transition: .3s all ease-out;
      }
      &.sleep {
        transition: .3s all ease-out;	
      }

      .navbar-brand {
        color: ${(props) => props.theme.black};
        padding-top: 1rem;
        padding-bottom: 1rem;
        font-size: 24px;
      }
    }
  }
`;