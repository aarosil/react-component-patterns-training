import React, { Component } from 'react';

export default class MyToggle extends Component {
  focus = () => this.button.focus()

  render() {
    const { on, toggle } = this.props;

    return (
      <div>
        <button ref={el => this.button = el} onClick={toggle}>
          {on ? 'on' : 'off'}
        </button>
      </div>
    )

  }
}

MyToggle.Subtext = () =>
  <span>nooooo</span>