import React, { Component } from 'react';
import './App.css';
import Toggle from './components/Toggle/Toggle';

class App extends Component {
  state = {on: true}
  render() {
    return (
      <div className='App'>

        <Toggle onChange={on => this.setState({on})}/>
        {
          this.state.on
            ? 'the Toggle is on'
            : 'the Toggle is off'
        }
      </div>
    );
  }
}

export default App;
