import React, { Component } from 'react';
import './App.css';
import Toggle from './components/Toggle/Toggle';

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
            </div>
        </Toggle>
        {
          this.state.on &&
            <div>
              <button>Yay!</button>
            </div>
        }
      </div>
    );
  }
}

export default App;
