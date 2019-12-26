import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation'
import Introduction from './components/Introduction'
import About from './components/About'

class App extends Component {
  render() {
    return (
      <div id="colorlib-page">
				<div id="container-wrap">
					<Navigation></Navigation>
					<div id="colorlib-main">
						<Introduction></Introduction>
						<About></About>
					</div>
				</div>
			</div>
    );
  }
}

export default App;
