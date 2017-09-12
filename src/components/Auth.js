import React, { Component } from 'react';
import { gql, graphql, compose } from 'react-apollo'

class Auth extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
    profile_image_url: ''
  }
  render() {
    return (
      <div>
        <h3>{this.state.login ? 'Login' : 'Sign Up'}</h3>
        <form className="form-horizontal">
          {!this.state.login &&
          <div className="form-group">
            <label for="user-name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-6">
              <input
                type="text"
                onChange={(e) => this.setState({ name: e.target.value })}
                className="form-control"
                id="user-name"
                placeholder="Name"
              />
            </div>
          </div>}
          <div className="form-group">
            <label for="user-email" className="col-sm-2 control-label">Email</label>
            <div className="col-sm-6">
              <input
                type="email"
                onChange={(e) => this.setState({ email: e.target.value })}
                className="form-control"
                id="user-email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="form-group">
            <label for="user-password" className="col-sm-2 control-label">Password</label>
            <div className="col-sm-6">
              <input
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
                className="form-control"
                id="user-password"
                placeholder="Password"
              />
            </div>
          </div>
          {!this.state.login &&
          <div className="form-group">
            <label for="user-profile-image" className="col-sm-2 control-label">Profile Image URL</label>
            <div className="col-sm-6">
              <input
                type="text"
                onChange={(e) => this.setState({ profile_image_url: e.target.value })}
                className="form-control"
                id="user-profile-image"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                type="submit"
                className="btn btn-info"
                onClick={() => this.sendAuthRequest()}
              >
                {this.state.login ? 'Login' : 'Register' }
              </button>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => this.setState({ login: !this.state.login })}
              >
                {this.state.login ? 'Create account instead?' : 'Already have an account?' }
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  sendAuthRequest = async () => {
    const { name, email, password, profile_image_url } = this.state
    if (this.state.login) {
      const response = await this.props.loginUserMutation({
        variables: {
          email,
          password
        }
      })
      const id = response.data.loginUser.user.id
      const token = response.data.loginUser.token
      this.saveUserInfo(id, token)
    } else {
      const response = await this.props.createUserMutation({
        variables: {
          name,
          email,
          password,
          profile_image_url
        }
      })
      const id = response.data.loginUser.user.id
      const token = response.data.loginUser.token
      this.saveUserInfo(id, token)
    }
    // this.props.history.push(`/`)
  }

  saveUserInfo = (id, token) => {
    sessionStorage.setItem('Petsagram_Id', id)
    sessionStorage.setItem('Petstagram_Token', token)
  }

}

const REGISTER_USER_MUTATION = gql`
  mutation RegisterUserMutation($name: String!, $email: String!, $password: String!, $profile_image_url: String!) {
    addNewUser(
      name: $name,
      email: $email,
      password: $password,
      profile_image_url: $profile_image_url
    ) {
      id
    }

    loginUser(
      email: $email,
      password: $password
    ) {
      token
      user_id
    }
  }
`

const LOGIN_USER_MUTATION = gql`
  mutation LoginUserMutation($email: String!, $password: String!) {
    loginUser(
      email: $email,
      password: $password
    ) {
      token
      user_id
    }
  }
`

export default compose(
  graphql(REGISTER_USER_MUTATION, { name: 'registerUserMutation' }),
  graphql(LOGIN_USER_MUTATION, { name: 'loginUserMutation' })
)(Auth)
