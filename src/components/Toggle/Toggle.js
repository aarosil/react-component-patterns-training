import React, { Component } from 'react'
import Switch from 'react-switch'

export default class Toggle extends Component {
  state = {
    on: true
  }

  static defaultProps = {
    onChange: () => {}
  }

  toggle = () => {
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onChange(this.state.on)
    )
  }

  render() {
    const { on } = this.state

    return <Switch
            checked={on}
            onChange={this.toggle} />
  }
}