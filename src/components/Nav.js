import React, { Component } from 'react'
import './Nav.css'
import MyToggle from './MyToggle';
import { ConnectedToggle } from './Toggle/ToggleProvider'

export default class Nav extends Component {
  render() {
    const { onChange } = this.props

    return (
      <div className='Nav'>
        <div className='Nav-item'>
          Component Patterns Demo
        </div>
        <div className='Nav-item'>
          <a onClick={() => onChange('basic')}>basic</a>
        </div>
        <div className='Nav-item'>
          <a onClick={() => onChange('advanced')}>advanced</a>
        </div>
        <div className='Nav-item'>
          <a onClick={() => onChange('other')}>other</a>
        </div>
        <div className='Nav-item'>
          <ConnectedToggle render={({on, toggle}) => (
            <MyToggle on={on} toggle={toggle}/>
          )} />
        </div>
      </div>
    )
  }
}