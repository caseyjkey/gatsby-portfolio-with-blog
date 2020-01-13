import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Navigation from '../components/Navigation'
import Introduction from '../components/Introduction'
import About from '../components/About'
import Resume from '../components/Resume/Resume'
import Services from '../components/Services'
import { Projects } from '../components/Projects'
import HireMe from '../components/Hire'
import Contact from '../components/Contact'
import { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style.js'
import { initPage } from '../components/main'
import AOS from 'aos'

const IndexPage = () => {
  useEffect(() => {
		AOS.init({
			duration: 800,
			easing: 'slide'
		});	 
		initPage();
  });
  
  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Body>
          <Navigation></Navigation>
          <Introduction></Introduction>
          <About></About>
          <Resume></Resume>
          <Services></Services>
          <Projects></Projects>
          <HireMe status="available"></HireMe>
          <Contact></Contact>
        </Body>
      </ThemeProvider>
    </Layout>
  );
}

export default IndexPage;