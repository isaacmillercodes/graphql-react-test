import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';

class PetImageList extends Component {
  render() {
    if (this.props.allPetProfileImagesQuery && this.props.allPetProfileImagesQuery.loading) {
      return <div>Loading...</div>
    }

    if (this.props.allPetProfileImagesQuery && this.props.allPetProfileImagesQuery.error) {
      return <div>Error...</div>
    }

    const allImages = this.props.allPetProfileImagesQuery.pets.map(pet => pet.profile_image)
    console.log(allImages)
    const imagesToRender = allImages.splice(-6);

    return (
        <div className="container-fluid">
          <div className="row">
            {imagesToRender.map(image => (
              <div key={image.id} alt="row of pets" style={{backgroundImage: `url(${image.image_url})`}} className="col-sm-2 splash-page-pets"></div>
            ))}
          </div>
        </div>
    )
  }
}

const ALL_PET_PROFILE_IMAGES_QUERY = gql`
  query AllPetProfileImagesQuery {
    pets {
      profile_image {
        id
        image_url
        uploaded_at
      }
    }
  }
`

export default graphql(ALL_PET_PROFILE_IMAGES_QUERY, { name: 'allPetProfileImagesQuery' })(PetImageList)
