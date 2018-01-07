import React, { Component } from 'react'
import Toggle from './Toggle/Toggle'
import Switch from 'react-switch'
import { withToggle } from './Toggle/ToggleProvider'

const MyToggle = ({on, toggle}) =>
  <div>
    <Switch checked={on} onChange={toggle}  />
    {on ? 'on' : 'off'}
  </div>

const ConnectedMyToggle = withToggle(MyToggle)

export default class Other extends Component {
  render() {
    return (
      <Toggle
        defaultOn={true}
        render={({on, toggle}) => (
          <div>
            <MyToggle on={on} toggle={toggle} />
            <ConnectedMyToggle />
          </div>
        )} />
    )
  }
}