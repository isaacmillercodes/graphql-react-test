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
    const friendsWithUser = user.friends.some(friend => friend.id === parseInt(viewer_id, 10));

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
        {!isOwnProfile && !friendsWithUser &&
          <div className="col-sm-2">
            <button className="btn btn-success profile-button"><h4>Send friend request</h4></button>
          </div>
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
