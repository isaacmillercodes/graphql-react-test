import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { Link } from 'react-router-dom';

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
    const friendIndex = user.friends.findIndex(friend => friend.id === parseInt(viewer_id, 10));
    const friendsWithUser = friendIndex >= 0;

    return (
      <div>
        <div className="container-fluid">
          <div className="profile-pets-container row">
            <div className="col-sm-4">
              <div className="profile-pic col-sm-4" style={{backgroundImage: `url(${user.profile_image.image_url})`}}></div>
              <h3 className="profile-name">{user.name}</h3>
            </div>
            <div className="col-sm-8 container-fluid">
              {isOwnProfile ? <h4>Your Pets</h4> : <h4>Pets {user.name} Owns</h4>}
              {user.pets_owned.map(pet => (
                <div key={pet.id} className="col-sm-3 profile-pet-row">
                  <div className="profile-pet-row-item" alt="row of pets" style={{backgroundImage: `url(${pet.profile_image.image_url})`}}></div>
                  <p className="pet-name">
                    {pet.name}
                    <span className="pet-followers">{pet.total_followers} <i className="fa fa-heart"></i></span>
                  </p>
                </div>
              ))}
            </div>
            <div className="col-sm-6 container-fluid pet-followed-row">
              {isOwnProfile ? <h4>Pets You Follow</h4> : <h4>Pets {user.name} Follows</h4>}
              {user.pets_followed.map(pet => (
                <div key={pet.id} className="col-sm-3 profile-pet-row">
                  <div className="profile-pet-row-item" alt="row of pets" style={{backgroundImage: `url(${pet.profile_image.image_url})`}}></div>
                  <p>{pet.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          {isOwnProfile ? <h4>Your Friends</h4> : <h4>Friends of {user.name}</h4>}
          {user.friends.map(friend => (
            <div key={friend.id} className="col-sm-3 profile-friend-row">
              <Link to={`/profile/${friend.id}`}>
                <div className="profile-friend-row-item" alt="row of friends" style={{backgroundImage: `url(${friend.profile_image.image_url})`}}></div>
                <p>{friend.name}</p>
              </Link>
            </div>
          ))}
        </div>
        {isOwnProfile &&
          <div>
            <button className="btn btn-success profile-button"><h4>Add Pet</h4></button>
          </div>
        }
        {!isOwnProfile && !friendsWithUser &&
          <div>
            <button className="btn btn-success profile-button"><h4>Send friend request</h4></button>
          </div>
        }
      </div>
    )

  }
}

const USER_PROFILE_QUERY = gql`
  query UserProfileQuery($id: Int!) {
    user(id: $id) {
      name
      friends {
        id
        name
        profile_image {
          image_url
        }
      }
      pets_owned {
        id
        name
        total_followers
        profile_image {
          image_url
        }
      }
      pets_followed {
        id
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
