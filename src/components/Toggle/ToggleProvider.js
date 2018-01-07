import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';

export default class ToggleProvider extends Component {
  contextKey = '__v3_toggle'

  static Renderer = class extends Component {
    static childContextTypes = {
      [ToggleProvider.contextKey]: PropTypes.object.isRequired
    }

    getChildContext() {
      return {
        [ToggleProvider.contextKey]: {
          on: this.props.on,
          toggle: this.props.toggle,
          reset: this.props.reset
        }
      }
    }

    render() {
      return this.props.children
    }
  }

  render() {
    const { children, ...otherProps } = this.props

    return (
      <Toggle {...otherProps}
        render={({on, toggle, reset}) => (
          <ToggleProvider.Renderer
            on={on}
            toggle={toggle}
            reset={reset}
            children={children} />
        )} />
    )
  }
}

export function ConnectedToggle(props, context) {
  const { on, toggle, reset } = context[ToggleProvider.contextKey]

  return props.render({on, toggle, reset})
}

ConnectedToggle.contextTypes = {
  [ConnectedToggle.contextKey]: PropTypes.object.isRequired
}