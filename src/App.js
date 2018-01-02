import React, { Component } from 'react';
import './App.css';
import Toggle, { withToggle } from './components/Toggle/Toggle';

const MyToggle = ({on, toggle}) =>
  <div>
    <button onClick={toggle}>
      {on ? 'on' : 'off'}
    </button>
  </div>

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
        </Toggle>
      </div>
    );
  }
}

export default App;
