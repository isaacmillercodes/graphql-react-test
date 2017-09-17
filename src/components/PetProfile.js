import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { Link } from 'react-router-dom';

class PetProfile extends Component {

  // state = {
  //   profile_image_url: this.props.petProfileQuery.pet.profile_image.image_url,
  //   profile_caption: this.props.petProfileQuery.pet.profile_image.caption,
  //   profile_likes: this.props.petProfileQuery.pet.profile_image.likes
  // }

  state = {
    profile_image_url: '',
    profile_caption: '',
    profile_likes: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.petProfileQuery.pet) {
      this.setState(
        {
          profile_image_url: nextProps.petProfileQuery.pet.profile_image.image_url,
          profile_caption: nextProps.petProfileQuery.pet.profile_image.caption,
          profile_likes: nextProps.petProfileQuery.pet.profile_image.likes
        }
      )
    }
  }

  render() {
    const viewer_id = sessionStorage.getItem('Petstagram_Id');

    if (!viewer_id || viewer_id === -1) {
      this.props.history.push('/');
    }

    if (this.props.petProfileQuery && this.props.petProfileQuery.loading) {
      return <div>Loading...</div>
    }

    if (this.props.petProfileQuery && this.props.petProfileQuery.error) {
      return <div>Error...</div>
    }

    const pet = this.props.petProfileQuery.pet
    const viewerOwner = this.props.petProfileQuery.pet.owners.some(owner => owner.id === parseInt(viewer_id, 10));
    const viewerFollower = this.props.petProfileQuery.pet.followers.some(follower => follower.id === parseInt(viewer_id, 10));
    // this.setState(
    //   {
    //     profile_image_url: pet.profile_image.image_url,
    //     profile_caption: pet.profile_image.caption,
    //     profile_likes: pet.profile_image.likes
    //   }
    // )

    // const sortedImages = this.props.petProfileQuery.pet.images.sort((a, b) => {
    //   return new Date(b.uploaded_at) - new Date(a.uploaded_at)
    // })

    return (
      <div>
        <div className="col-sm-2">
          <h2>{pet.name}</h2>
          <h4>{pet.breed}, {pet.age} years old</h4>
          <h4>{pet.total_followers} followers</h4>
        </div>
        <div className="col-sm-8">
          <div className="pet-profile-pic" style={{backgroundImage: `url(${this.state.profile_image_url})`}} alt="Profile picture" />
          <h4>
            {this.state.profile_caption}
            <span className="pull-right">{this.state.profile_likes} <i className="fa fa-thumbs-o-up"/></span>
          </h4>
        </div>
        <div className="col-sm-2">
          <h4>Owners:</h4>
          {pet.owners.map(owner => (
            <div key={owner.id}>
              <Link to={`/profile/${owner.id}`}>
                <div className="profile-user-row-item" alt="row of users" style={{backgroundImage: `url(${owner.profile_image.image_url})`}}></div>
                <div className="user-name">
                  <p>{owner.name}</p>
                </div>
              </Link>
            </div>
          ))}
          {!viewerFollower &&
            <button className="btn btn-success profile-button"><h4>Follow Pet</h4></button>
          }
          {viewerOwner &&
            <button className="btn btn-success profile-button"><h4>Add Image</h4></button>
          }
        </div>
        <div className="col-sm-12">
          <h4>Images</h4>
          <div className="profile-pet-row">
            {pet.images.map(image => (
              <div
                key={image.id}
                className="profile-pet-container"
                onClick={() => this.setState(
                  {
                    profile_image_url: image.image_url,
                    profile_caption: image.caption,
                    profile_likes: image.likes
                  }
                )}
                >
                <div className="profile-pet-row-item" alt="row of pets" style={{backgroundImage: `url(${image.image_url})`}}></div>
                <div className="pet-name">
                  <p className="pull-left">
                    {image.likes} <i className="fa fa-thumbs-o-up" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

}

const PET_PROFILE_QUERY = gql`
  query PetProfileQuery($id: Int!) {
    pet(id: $id) {
      name
      breed
      age
      total_followers
      profile_image {
        image_url
        caption
        likes
      }
      owners {
        id
        name
        profile_image {
          image_url
        }
      }
      followers {
        id
      }
      images {
        id
        image_url
        caption
        likes
        uploaded_at
      }
    }
  }
`

export default graphql(PET_PROFILE_QUERY, {
  name: 'petProfileQuery',
  options: (props) => ({ variables: { id: props.match.params.id } })
})(PetProfile)
