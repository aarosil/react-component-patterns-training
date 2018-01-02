import React, { Component } from 'react'
import Switch from 'react-switch'

const ToggleOnText = ({on, children}) => on ? children : null
const ToggleOffText = ({on, children}) => on ? null : children
const ToggleButton = ({on, toggle}) =>
  <Switch checked={on} onChange={toggle} />

export default class Toggle extends Component {
  state = {
    on: true
  }

  static defaultProps = {
    onChange: () => {}
  }

  static OnText = ToggleOnText
  static OffText = ToggleOffText
  static Button = ToggleButton

  toggle = () => {
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onChange(this.state.on)
    )
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        on: this.state.on,
        toggle: this.toggle
      })
    )
  }
}