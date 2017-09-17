import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo'

class AddPet extends Component {
  state = {
    owner_id: parseInt(this.props.match.params.id, 10),
    name: '',
    species: '',
    breed: '',
    age: '',
    profile_image_url: ''
  }

  render() {
    const user_id = this.props.match.params.id;
    const viewer_id = sessionStorage.getItem('Petstagram_Id');
    const isOwner = user_id === viewer_id;

    if (!isOwner) {
      this.props.history.push('/');
    }

    return (
      <div>
        <h3 className="col-sm-offset-2">Add a New Pet</h3>
        <form className="form-horizontal" onSubmit={(e) => this.addPetRequest(e)}>
          <div className="form-group">
            <label htmlFor="pet-name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-6">
              <input
                type="text"
                onChange={(e) => this.setState({ name: e.target.value })}
                className="form-control"
                id="pet-name"
                placeholder="Pet's Name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pet-species" className="col-sm-2 control-label">Species</label>
            <div className="col-sm-6">
              <input
                type="text"
                onChange={(e) => this.setState({ species: e.target.value })}
                className="form-control"
                id="pet-species"
                placeholder="Pet's Species (dog, cat, etc.)"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pet-breed" className="col-sm-2 control-label">Breed</label>
            <div className="col-sm-6">
              <input
                type="text"
                onChange={(e) => this.setState({ breed: e.target.value })}
                className="form-control"
                id="pet-breed"
                placeholder="Pet's Breed (pug, tabby, etc.)"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pet-age" className="col-sm-2 control-label">Age</label>
            <div className="col-sm-6">
              <input
                type="number"
                onChange={(e) => this.setState({ age: e.target.value })}
                className="form-control"
                id="pet-age"
                step=".25"
                min=".25"
                placeholder="1.0"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pet-profile-image" className="col-sm-2 control-label">Profile Image URL</label>
            <div className="col-sm-6">
              <input
                type="url"
                onChange={(e) => this.setState({ profile_image_url: e.target.value })}
                className="form-control"
                id="pet-profile-image"
                placeholder="https://example.com/image.png"
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

  addPetRequest = async (event) => {
    event.preventDefault();
    const { owner_id, name, species, breed, age, profile_image_url } = this.state

    const response = await this.props.addPetMutation({
      variables: {
        owner_id,
        name,
        species,
        breed,
        age,
        profile_image_url
      }
    })
    const id = response.data.addPetWithOwnerAndImage.id
    if (id) {
      this.props.history.push(`/profile/${this.state.owner_id}`)
    }
  }

}

const ADD_PET_MUTATION = gql`
  mutation AddPetMutation($owner_id: Int!, $name: String!, $species: String!, $breed: String!, $age: Float!, $profile_image_url: String!) {
    addPetWithOwnerAndImage(
      owner_id: $owner_id,
      name: $name,
      species: $species,
      breed: $breed,
      age: $age,
      profile_image_url: $profile_image_url
    ) {
      id
    }
  }
`

export default graphql(ADD_PET_MUTATION, { name: 'addPetMutation' })(AddPet)
