import React, { Component } from 'react';
import './App.css';
import Toggle from './components/Toggle/Toggle';
import MyToggle from './components/MyToggle';
import Switch from 'react-switch'

class App extends Component {
  state = {on: false, clicks: 0}

  handleChange = (on) => {
    if (!on) this.toggle.focus()
    this.setState(({clicks, on}) => ({
      on: clicks < 4 ? !on : false,
      clicks: ++clicks
    }))
  }

  render() {
    return (
      <div className='App'>

        <Toggle
            on={this.state.on}
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
                {
                  this.state.clicks > 4 &&
                    <div>
                      <div>max clicks exceeded</div>
                      <button onClick={() => this.setState({clicks: 0})}>reset</button>
                    </div>
                }
              </div>
            )}>
        </Toggle>
      </div>
    );
  }
}

export default App;
