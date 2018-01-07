import React, { Component } from 'react'
import './Layout.css'
import Basic from './Basic'
import Advanced from './Advanced'
import Other from './Other'

export default class Layout extends Component {
  render() {
    const { page, innerRef, clicks } = this.props

    return (
      <div className='Layout'>
        { page === 'basic' &&
           <Basic clicks={clicks} innerRef={innerRef} />
        }
        {
          page === 'advanced' &&
            <Advanced clicks={clicks} innerRef={innerRef} />
        }
        {
          page === 'other' &&
            <Other />
        }
      </div>
    )
  }
}