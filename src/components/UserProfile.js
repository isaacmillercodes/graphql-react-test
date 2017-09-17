import React, { Component } from 'react';
import { graphql, gql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

class UserProfile extends Component {

  state = {
    friendshipStatus: '',
    friendRequestSent: false
  }

  render() {
    const user_id = parseInt(this.props.match.params.id, 10);
    const viewer_id = parseInt(sessionStorage.getItem('Petstagram_Id'), 10);
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
    const friendsWithUser = user.friends.some(friend => friend.id === viewer_id);

    return (
      <div>
        <h2 className="col-sm-2">{user.name}</h2>
        <div className="col-sm-8">
          <div className="profile-pic" style={{backgroundImage: `url(${user.profile_image.image_url})`}} alt="Profile picture" />
        </div>
        {isOwnProfile &&
          <div className="col-sm-2">
            <Link to={`/profile/${user.id}/add_pet`}>
              <button className="btn btn-success profile-button"><h4>Add Pet</h4></button>
            </Link>
          </div>
        }
        {!isOwnProfile && !friendsWithUser && !this.state.friendRequestSent &&
          <div className="col-sm-2">
            <button
              className="btn btn-success profile-button"
              onClick={() => this.sendFriendRequest(user_id, viewer_id)}
            >
              <h4>Send friend request</h4>
            </button>
          </div>
        }
        {friendsWithUser &&
          <h4><em>You and {user.name} are friends</em></h4>
        }
        {!friendsWithUser && this.state.friendRequestSent &&
          <h4><em>Friend request sent to {user.name}</em></h4>
        }
        <div className="col-sm-12">
          {isOwnProfile ? <h4>Your Pets</h4> : <h4>Pets {user.name} Owns</h4>}
          <div className="profile-pet-row">
            {user.pets_owned.map(pet => (
              <div key={pet.id} className="profile-pet-container">
                <Link to={`/pet/${pet.id}`}>
                  <div className="profile-pet-row-item" alt="row of pets" style={{backgroundImage: `url(${pet.profile_image.image_url})`}}></div>
                  <div className="pet-name">
                    <p>
                      {pet.name}
                      <span className="pet-followers pull-right">{pet.total_followers} <i className="fa fa-heart"></i></span>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="col-sm-12">
          {isOwnProfile ? <h4>Pets You Follow</h4> : <h4>Pets {user.name} Follows</h4>}
          <div className="profile-pet-row">
            {user.pets_followed.map(pet => (
              <div key={pet.id} className="profile-pet-container">
                <Link to={`/pet/${pet.id}`}>
                  <div className="profile-pet-row-item" alt="row of pets" style={{backgroundImage: `url(${pet.profile_image.image_url})`}}></div>
                  <div className="pet-name">
                    <p>
                      {pet.name}
                      <span className="pet-followers pull-right">{pet.total_followers} <i className="fa fa-heart"></i></span>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="col-sm-12">
          {isOwnProfile ? <h4>Your Friends</h4> : <h4>Friends of {user.name}</h4>}
          <div className="profile-user-row">
            {user.friends.map(friend => (
              <div key={friend.id} className="profile-user-container">
                <Link to={`/profile/${friend.id}`}>
                  <div className="profile-user-row-item" alt="row of users" style={{backgroundImage: `url(${friend.profile_image.image_url})`}}></div>
                  <div className="user-name">
                    <p>{friend.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  sendFriendRequest = async (user_one, user_two) => {
    const response = await this.props.friendRequestMutation({
      variables: {
        user_one,
        user_two
      }
    })
    const status = response.data.friendRequest.status
    if (status) {
      this.setState({
        friendshipStatus: status,
        friendRequestSent: true
      })
    }
  }

}

const USER_PROFILE_QUERY = gql`
  query UserProfileQuery($id: Int!) {
    user(id: $id) {
      id
      name
      friends {
        id
        name
        profile_image {
          id
          image_url
        }
      }
      pets_owned {
        id
        name
        total_followers
        profile_image {
          id
          image_url
        }
      }
      pets_followed {
        id
        name
        total_followers
        profile_image {
          id
          image_url
        }
      }
      profile_image {
        id
        image_url
      }
    }
  }
`

const FRIEND_REQUEST_MUTATION = gql`
  mutation FriendRequestMutation($user_one: Int!, $user_two: Int!) {
    friendRequest(
      user_one: $user_one,
      user_two: $user_two
    ) {
      status
    }
  }
`

export default compose(
  graphql(USER_PROFILE_QUERY, {
    name: 'userProfileQuery',
    options: (props) => ({
      variables: { id: props.match.params.id },
      fetchPolicy: 'cache-and-network'
    })
  }),
  graphql(FRIEND_REQUEST_MUTATION, { name: 'friendRequestMutation' })
)(UserProfile)
