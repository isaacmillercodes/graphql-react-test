import React, { Component } from 'react';
import { graphql, gql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

class PetProfile extends Component {

  state = {
    profile_image_url: '',
    profile_caption: '',
    profile_likes: '',
    followRequestSent: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.petProfileQuery.pet && !this.state.profile_likes) {
      this.setState(
        {
          profile_image_id: nextProps.petProfileQuery.pet.profile_image.id,
          profile_image_url: nextProps.petProfileQuery.pet.profile_image.image_url,
          profile_caption: nextProps.petProfileQuery.pet.profile_image.caption,
          profile_likes: nextProps.petProfileQuery.pet.profile_image.likes
        }
      )
    } else if (nextProps.petProfileQuery.pet && this.state.profile_likes) {
      this.setState({ profile_likes: ++this.state.profile_likes })
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
            <span
              className="pull-right"
              onClick={() => this.likeImage(this.state.profile_image_id)}
            >
              {this.state.profile_likes}
              <i className="fa fa-thumbs-o-up"/>
            </span>
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
            <button
              className="btn btn-success profile-button"
              onClick={() => this.followPet()}
            >
              <h4>Follow Pet</h4>
            </button>
          }
          {viewerFollower &&
            <h4><em>You already follow {pet.name}</em></h4>
          }
          {viewerOwner &&
            <Link to={`/pet/${pet.id}/add_image`}>
              <button className="btn btn-success profile-button"><h4>Add Image</h4></button>
            </Link>
          }
        </div>
        <div className="col-sm-12">
          <h4>Images</h4>
          <div className="profile-pet-row">
            {pet.images.map(image => (
              <div key={image.id} className="profile-pet-container">
                <div
                  className="profile-pet-row-item"
                  alt="row of pets"
                  style={{backgroundImage: `url(${image.image_url})`}}
                  onClick={() => this.setState(
                    {
                      profile_image_id: image.id,
                      profile_image_url: image.image_url,
                      profile_caption: image.caption,
                      profile_likes: image.likes
                    }
                  )}
                  >
                </div>
                <div className="pet-name">
                  <p className="pull-left">
                    {image.likes} <i className="fa fa-thumbs-o-up" onClick={() => this.likeImage(image.id)}/>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  followPet = async () => {
    const response = await this.props.followPetMutation({
      variables: {
        pet_id: parseInt(this.props.match.params.id, 10),
        follower_id: parseInt(sessionStorage.getItem('Petstagram_Id'), 10)
      }
    })
    const id = response.data.followPet.pet_id
    if (id) {
      this.setState({ followRequestSent: true })
    }
  }

  likeImage = async (image_id) => {
    await this.props.likeImageMutation({
      variables: {
        image_id
      }
    })
  }

}

const PET_PROFILE_QUERY = gql`
  query PetProfileQuery($id: Int!) {
    pet(id: $id) {
      id
      name
      breed
      age
      total_followers
      profile_image {
        id
        image_url
        caption
        likes
      }
      owners {
        id
        name
        profile_image {
          id
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

const FOLLOW_PET_MUTATION = gql`
  mutation FollowPetMutation($pet_id: Int!, $follower_id: Int!) {
    followPet(
      pet_id: $pet_id,
      follower_id: $follower_id
    ) {
      pet_id
      follower_id
    }
  }
`

const LIKE_IMAGE_MUTATION = gql`
  mutation LikeImage($image_id: Int!) {
    likeImage(
      image_id: $image_id
    ) {
      id
      likes
    }
  }
`

export default compose(
  graphql(PET_PROFILE_QUERY, {
    name: 'petProfileQuery',
    options: (props) => ({
      variables: { id: props.match.params.id },
      fetchPolicy: 'cache-and-network'
    })
  }),
  graphql(FOLLOW_PET_MUTATION, {
    name: 'followPetMutation',
    options: (props) => ({
      refetchQueries: [
        {
          query: PET_PROFILE_QUERY,
          variables: { id: props.match.params.id }
        }
      ]
    })
  }),
  graphql(LIKE_IMAGE_MUTATION, { name: 'likeImageMutation' })
)(PetProfile)
