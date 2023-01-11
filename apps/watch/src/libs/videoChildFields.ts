import { gql } from '@apollo/client'

export const VIDEO_CHILD_FIELDS = gql`
  fragment VideoChildFields on Video {
    id
    label
    title(languageId: $languageId, primary: true) {
      value
    }
    image
    imageAlt(languageId: $languageId, primary: true) {
      value
    }
    snippet(languageId: $languageId, primary: true) {
      value
    }
    slug
    variant {
      id
      duration
      hls
      slug
      subtitle {
        language {
          name {
            value
            primary
          }
          bcp47
          id
        }
        value
      }
    }
    childrenCount
  }
`
