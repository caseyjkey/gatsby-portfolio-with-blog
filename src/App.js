import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation'

class App extends Component {
  render() {
    return (
      <div id="colorlib-page">
				<div id="container-wrap">
					<Navigation></Navigation>
				</div>
			</div>
    );
  }
}

export default App;
