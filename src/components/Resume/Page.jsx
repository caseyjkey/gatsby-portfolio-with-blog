import React, { Component } from 'react'

// Returns the number of children it contains via entries prop method
export default class Page extends Component {
  constructor(props) {
    super(props);
    props.count(props.id, props.children);
  }

  render() {
    return (
    <div id={this.props.name} className={this.props.className}>{this.props.children}</div>
    );
  }
}