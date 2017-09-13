import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';

class UserProfile extends Component {

  render() {
    const user_id = this.props.match.params.id;
    const viewer_id = sessionStorage.getItem('Petstagram_Id');
    const isOwnProfile = user_id === viewer_id;

    if (!viewer_id || viewer_id === -1) {
      this.props.history.push('/');
    }

    if (this.props.userProfileQuery && this.props.userProfileQuery.loading) {
      return <div>Loading...</div>
    }

    if (this.props.userProfileQuery && this.props.userProfileQuery.error) {
      return <div>Error...</div>
    }

    const user = this.props.userProfileQuery.user

    return <div>{user.name}</div>

  }
}

const USER_PROFILE_QUERY = gql`
  query UserProfileQuery($id: Int!) {
    user(id: $id) {
      name
      friends {
        name
        profile_image {
          image_url
        }
      }
      pets_owned {
        name
        total_followers
        profile_image {
          image_url
        }
      }
      pets_followed {
        name
        total_followers
        profile_image {
          image_url
        }
      }
      profile_image {
        image_url
      }
    }
  }
`

export default graphql(USER_PROFILE_QUERY, {
  name: 'userProfileQuery',
  options: (props) => ({ variables: { id: props.match.params.id } })
})(UserProfile)
