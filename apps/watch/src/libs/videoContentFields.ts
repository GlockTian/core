import { gql } from '@apollo/client'

export const VIDEO_CONTENT_FIELDS = gql`
  fragment VideoContentFields on Video {
    id
    label
    image
    imageAlt(languageId: $languageId, primary: true) {
      value
    }
    snippet(languageId: $languageId, primary: true) {
      value
    }
    description(languageId: $languageId, primary: true) {
      value
    }
    studyQuestions(languageId: $languageId, primary: true) {
      value
    }
    title(languageId: $languageId, primary: true) {
      value
    }
    variant {
      id
      duration
      hls
      downloads {
        quality
        size
        url
      }
      language {
        id
        name {
          value
          primary
        }
      }
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
    variantLanguagesWithSlug {
      slug
      language {
        id
        name {
          value
          primary
        }
      }
    }
    slug
    childrenCount
  }
`
