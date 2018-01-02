import React, { Component } from 'react';
import './App.css';
import Toggle from './components/Toggle/Toggle';
import MyToggle from './components/MyToggle';

class App extends Component {
  state = {on: true}
  render() {
    return (
      <div className='App'>

        <Toggle onChange={on => this.setState({on})}>
          <Toggle.Button />
          <div>
            <Toggle.OnText>the Toggle is on</Toggle.OnText>
            <Toggle.OffText>the Toggle is off</Toggle.OffText>
            <MyToggle />
          </div>
          {
            !this.state.on &&
              <MyToggle.Subtext />
          }
        </Toggle>
      </div>
    );
  }
}

export default App;
