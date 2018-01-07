import React, { Component } from 'react'
import Toggle from './Toggle/Toggle'
import Switch from 'react-switch'
import { ConnectedToggle } from './Toggle/ToggleProvider'

export default class Other extends Component {
  render() {
    return (
      <Toggle
        defaultOn={true}
        render={({on, toggle}) => (
          <div>
            <Switch checked={on} onChange={toggle}  />
            {on ? 'on' : 'off'}
            <ConnectedToggle render={({on, toggle}) => (
              <div>
                <Switch checked={on} onChange={toggle}  />
                {on ? 'on' : 'off'}
              </div>
            )} />
          </div>
        )} />
    )
  }
}