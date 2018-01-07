import React, { Component } from 'react';
import './App.css'
import ToggleProvider from './components/Toggle/ToggleProvider'
import Nav from './components/Nav'
import Layout from './components/Layout'

class App extends Component {
  state = {on: false, clicks: 0, page: 'basic'}

  handleChange = (on) => {
    if (!on && this.toggle) this.toggle.focus()
    this.setState(({clicks, on, counter}) => ({
      on: clicks < 4 ? !on : false,
      clicks: ++clicks
    }))
  }

  handleNav = (page) => {
    this.setState({page})
  }

  handleReset = (on) => {
    this.setState({clicks: 0, on})
  }

  render() {
    const { on, clicks, page } = this.state

    return (
      <ToggleProvider
          on={on}
          onChange={this.handleChange}
          onReset={this.handleReset}>
        <div className={on ? 'App-on' : ''}>
          <Nav onChange={this.handleNav}  />
          <Layout page={page} clicks={clicks} innerRef={el => this.toggle = el} />
        </div>
      </ToggleProvider>
    );
  }
}

export default App;
