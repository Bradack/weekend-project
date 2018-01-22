import React, { Component } from 'react';
import './App.css';
import ClickGame from './ClickGame';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='main-header'>
        </div>

        <ClickGame />
        
      </div>
    );
  }
}

export default App;
