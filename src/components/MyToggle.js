import React from 'react';
import { withToggle } from './Toggle/Toggle';

const MyToggle = ({on, toggle}) =>
  <div>
    <button onClick={toggle}>
      {on ? 'on' : 'off'}
    </button>
  </div>

MyToggle.Subtext = () =>
  <span>nooooo</span>

export default withToggle(MyToggle)