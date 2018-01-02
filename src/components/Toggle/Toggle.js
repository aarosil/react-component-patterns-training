import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Switch from 'react-switch'
import hoistNonReactStatics from 'hoist-non-react-statics'

const TOGGLE_CONTEXT = '__v3_toggle__'

export const withToggle = (Component) => {
  function Wrapped(props, context) {
    const toggleProps = context[TOGGLE_CONTEXT]
    const { innerRef, ...rest } = props

    return <Component ref={innerRef} {...toggleProps} {...rest} />
  }

  Wrapped.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  }

  Wrapped.displayName = `withToggle(${Component.displayName || Component.name})`
  Wrapped.WrappedComponent = Component

  return hoistNonReactStatics(Wrapped, Component)
}

const ToggleOnText = ({children, on}) => on ? children : null
const ToggleOffText = ({children, on}) => on ? null : children
const ToggleButton = ({toggle, on}) =>
  <Switch checked={on} onChange={toggle} />

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

  static OnText = withToggle(ToggleOnText)
  static OffText = withToggle(ToggleOffText)
  static Button = withToggle(ToggleButton)

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