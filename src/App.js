import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation'
import Introduction from './components/Introduction/Introduction'
import About from './components/About/About'
import Resume from './components/Resume/Resume'
import { Body } from './components/style.js'
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
			<Body>
				<Navigation></Navigation>
				<Introduction></Introduction>
				<About></About>
				<Resume></Resume>
			</Body>
    );
  }
}

export default App;
