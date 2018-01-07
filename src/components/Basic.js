import React from 'react'
import MyToggle from './MyToggle';
import Switch from 'react-switch'
import { ConnectedToggle } from './Toggle/ToggleProvider'

export default function Basic(props) {
  return (
    <ConnectedToggle
      render={({on, toggle, reset}) => (
        <div>
          <Switch checked={on} onChange={toggle} />
          {
            on
              ? 'the Toggle is on'
              : 'the Toggle is off'
          }
          <MyToggle toggle={toggle} on={on} ref={props.innerRef} />
          {
            on &&
              <MyToggle.Subtext />
          }
          {
            props.clicks > 4 &&
              <div>
                <div>max clicks exceeded</div>
                <button onClick={reset}>reset</button>
              </div>
          }
        </div>
      )}>
    </ConnectedToggle>
  )
}