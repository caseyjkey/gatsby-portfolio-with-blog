import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation'
import Introduction from './components/Introduction'
import About from './components/About'
import Resume from './components/Resume/Resume'
import Services from './components/Services'
import { Projects } from './components/Projects'
import HireMe from './components/Hire'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { ThemeProvider } from 'styled-components'
import { theme, GlobalStyles, Body } from './components/style.js'
import { initPage } from './components/main'
import AOS from 'aos'

class App extends Component {
	componentDidMount() {
		AOS.init({
			duration: 800,
			easing: 'slide'
		});	 
		initPage();
	}

  render() {
    return (
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				<Body>
					<Navigation></Navigation>
					<Introduction></Introduction>
					<About></About>
					<Resume></Resume>
					<Services></Services>
					<Projects></Projects>
					<HireMe status="available"></HireMe>
					<Contact></Contact>
					<Footer></Footer>
				</Body>
			</ThemeProvider>
    );
  }
}

export default App;
