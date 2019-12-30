import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/Navigation'
import Introduction from './components/Introduction/Introduction'
import About from './components/About/About'
import Partners from './components/Partners/Partners'
import Resume from './components/Resume/Resume'
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
			<Fragment>
				<Navigation></Navigation>
				<Introduction></Introduction>
				<About></About>
				<Partners></Partners>
				<Resume></Resume>
			</Fragment>
    );
  }
}

export default App;
