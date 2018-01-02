import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Switch from 'react-switch'

const TOGGLE_CONTEXT = '__v3_toggle__'

const ToggleOnText = ({children}, {[TOGGLE_CONTEXT]: on}) => on ? children : null
ToggleOnText.contextTypes = {
  [TOGGLE_CONTEXT]: PropTypes.object.isRequired
}

const ToggleOffText = ({children}, {[TOGGLE_CONTEXT]: on}) => on ? null : children
ToggleOffText.contextTypes = {
  [TOGGLE_CONTEXT]: PropTypes.object.isRequired
}

const ToggleButton = (props, {[TOGGLE_CONTEXT]: {toggle, on}}) =>
  <Switch checked={on} onChange={toggle} />
ToggleButton.contextTypes = {
  [TOGGLE_CONTEXT]: PropTypes.object.isRequired
}


export default class Toggle extends Component {
  state = {
    on: true
  }

  static defaultProps = {
    onChange: () => {}
  }

  static childContextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      [TOGGLE_CONTEXT]: {
        on: this.state.on,
        toggle: this.toggle
      }
    }
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
    return this.props.children
  }
}