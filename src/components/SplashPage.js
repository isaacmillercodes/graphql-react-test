import React, { Component } from 'react';
import PetImageList from './PetImageList';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class SplashPage extends Component {
  render() {

    return (
      <div className="App">
        <div className="App-header">
          <PetImageList />
        </div>
        <h1>Petstagram</h1>
        <Link to='/auth'>
          <button className="btn btn-primary">Login</button>
        </Link>
      </div>
    )
  }
}

export default withRouter(SplashPage)
