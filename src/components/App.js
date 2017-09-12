import React, { Component } from 'react';
import SplashPage from './SplashPage';
import Auth from './Auth';
import '../styles/App.css';
import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/auth' component={Auth}/>
        <Route exact path='/' component={SplashPage}/>
      </Switch>
    );
  }
}

export default App;
