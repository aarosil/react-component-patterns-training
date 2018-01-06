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
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onChange(this.state.on)
    )
  }

  render() {
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle
    })
  }
}