import React, { Component } from 'react';

import Head from 'src/shared/components/Head';
import Routes from 'src/shared/components/Routes';
import Navigation from 'src/shared/components/Navigation';
//import logo from './logo.svg';
import './App.styles.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Head />
        <header className="App-header">
          <img src={''} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to World</h1>
        </header>
        <Navigation />
        <content className="App-intro">
          <Routes />
        </content>
      </div>
    );
  }
}

export default App;
