import React, { Component } from 'react'

// Returns the number of children it contains via entries prop method
export default class Page extends Component {
  constructor(props) {
    super(props);
    props.count(props.id, props.children);
  }

  render() {
    console.log(this.props.id);
    console.log(this.props.children);
    return (
    <div className={this.props.className}>{this.props.children}</div>
    );
  }
}