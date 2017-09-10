import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { Image } from 'semantic-ui-react';

class PetImageList extends Component {
  render() {
    if (this.props.allPetImagesQuery && this.props.allPetImagesQuery.loading) {
      return <div>Loading...</div>
    }

    if (this.props.allPetImagesQuery && this.props.allPetImagesQuery.error) {
      return <div>Error...</div>
    }

    console.log(this.props)
    const imagesToRender = this.props.allPetImagesQuery.pet_images
    console.log(imagesToRender)
    const lastFiveImages = imagesToRender.slice(-6)
    console.log(lastFiveImages);

    return (
      <Image.Group size='small'>
        {lastFiveImages.map(image => (
          <Image key={image.id} src={image.image_url}  />
        ))}
      </Image.Group>
    )
  }
}

const ALL_PET_IMAGES_QUERY = gql`
  query AllPetImagesQuery {
    pet_images {
      id
      image_url
      uploaded_at
    }
  }
`

export default graphql(ALL_PET_IMAGES_QUERY, { name: 'allPetImagesQuery' })(PetImageList)
