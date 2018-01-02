import React, { Component } from 'react'
import Switch from 'react-switch'

export default class Toggle extends Component {
  state = {
    on: true
  }

  toggle = () =>
    this.setState(({on}) => ({on: !on}))

  render() {
    const { on } = this.state

    return <Switch
            checked={on}
            onChange={this.toggle} />
  }
}