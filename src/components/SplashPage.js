import React, { Component } from 'react';
import PetImageList from './PetImageList';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class SplashPage extends Component {

  render() {
    // const user_id = sessionStorage.getItem('Petstagram_Id');
    const token = sessionStorage.getItem('Petstagram_Token');
    return (
      <div className="App">
        <div className="App-header">
          <PetImageList />
        </div>
        <h1>Petstagram</h1>
        <Link to='/auth'>
          <button className="btn btn-primary">
            {token ? 'Your Profile' : 'Login or Register' }
          </button>
        </Link>
      </div>
    )
  }
}

export default withRouter(SplashPage)
