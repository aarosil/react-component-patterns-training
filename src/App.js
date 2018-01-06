import React, { Component } from 'react';
import './App.css';
import Toggle from './components/Toggle/Toggle';
import MyToggle from './components/MyToggle';
import Switch from 'react-switch'

class App extends Component {
  handleChange = (on) => {
    if (!on) this.toggle.focus()
  }

  render() {
    return (
      <div className='App'>

        <Toggle
            onChange={this.handleChange}
            render={({on, toggle}) => (
              <div>
                <Switch checked={on} onChange={toggle} />
                {
                  on
                    ? 'the Toggle is on'
                    : 'the Toggle is off'
                }
                <MyToggle toggle={toggle} on={on} ref={el => this.toggle = el} />
                {
                  on &&
                    <MyToggle.Subtext />
                }
              </div>
            )}>
        </Toggle>
      </div>
    );
  }
}

export default App;
