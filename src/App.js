import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/Navigation'
import Introduction from './components/Introduction'
import About from './components/About'
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
			</Fragment>
    );
  }
}

export default App;
