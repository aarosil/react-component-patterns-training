import { Component } from 'react'

export default class Toggle extends Component {
  state = {
    on: true
  }

  static defaultProps = {
    onChange: () => {}
  }

  isOnControlled() {
    return this.props.on !== undefined
  }

  toggle = () => {
    if (this.isOnControlled()) {
      this.props.onChange(!this.props.on)
    } else {
      this.setState(
        ({on}) => ({on: !on}),
        () => this.props.onChange(this.state.on)
      )
    }
  }

  render() {
    return this.props.render({
      on: this.isOnControlled()
        ? this.props.on
        : this.state.on,
      toggle: this.toggle
    })
  }
}