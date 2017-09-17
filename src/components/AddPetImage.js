import React, { Component } from 'react';
import { gql, graphql, compose } from 'react-apollo'
// import { PET_PROFILE_QUERY } from './PetProfile'

class AddPetImage extends Component {
  state = {
    pet_id: parseInt(this.props.match.params.id, 10),
    image_url: '',
    caption: ''
  }

  render() {
    if (this.props.petOwnersQuery && this.props.petOwnersQuery.loading) {
      return <div>Loading...</div>
    }

    if (this.props.petOwnersQuery && this.props.petOwnersQuery.error) {
      return <div>Error...</div>
    }

    const pet_id = this.props.match.params.id;
    const viewer_id = sessionStorage.getItem('Petstagram_Id');
    const isOwner = this.props.petOwnersQuery.pet.owners.some(owner => owner.id === parseInt(viewer_id, 10));

    if (!isOwner) {
      this.props.history.push(`/pet/${pet_id}`);
    }

    return (
      <div>
        <h3 className="col-sm-offset-2">Add an image for {this.props.petOwnersQuery.pet.name}</h3>
        <form className="form-horizontal" onSubmit={(e) => this.addPetImageRequest(e)}>
          <div className="form-group">
            <label htmlFor="image-url" className="col-sm-2 control-label">Image URL</label>
            <div className="col-sm-6">
              <input
                type="url"
                onChange={(e) => this.setState({image_url: e.target.value })}
                className="form-control"
                id="image-url"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="image-caption" className="col-sm-2 control-label">Caption</label>
            <div className="col-sm-6">
              <textarea
                onChange={(e) => this.setState({caption: e.target.value })}
                className="form-control"
                id="image-caption"
                placeholder="A caption for this picture"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                type="submit"
                className="btn btn-info"
              >
                Add Pet
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  addPetImageRequest = async (event) => {
    event.preventDefault();
    const { pet_id, image_url, caption } = this.state

    const response = await this.props.addPetImageMutation({
      variables: {
        pet_id,
        image_url,
        caption
      }
    })
    const id = response.data.addPetImage.id
    if (id) {
      this.props.history.push(`/pet/${this.state.pet_id}`)
    }
  }

}

const ADD_PET_IMAGE_MUTATION = gql`
  mutation AddPetImageMutation($pet_id: Int!, $image_url: String!, $caption: String) {
    addPetImage(
      pet_id: $pet_id,
      image_url: $image_url,
      caption: $caption
    ) {
      id
    }
  }
`

const PET_OWNERS_QUERY = gql`
  query PetOwnersQuery($id: Int!) {
    pet(id: $id) {
      id
      name
      owners {
        id
      }
    }
  }
`

export default compose(
  graphql(ADD_PET_IMAGE_MUTATION, { name: 'addPetImageMutation' }),
  graphql(PET_OWNERS_QUERY, {
    name: 'petOwnersQuery',
    options: (props) => ({
      variables: { id: props.match.params.id },
      refetchQueries: ['petProfileQuery']
    })
  })
)(AddPetImage)
