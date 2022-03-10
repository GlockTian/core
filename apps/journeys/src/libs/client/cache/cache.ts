import { InMemoryCache } from '@apollo/client'

export const cache: InMemoryCache = new InMemoryCache({
  /* https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually
   * The client needs to understand the polymorphic relationship between the
     interfaces and the types that implement it. To inform the client about
     these relationships, we need to pass a possibleTypes option when
     initializing InMemoryCache.
   */
  possibleTypes: {
    Action: [
      'NavigateAction',
      'NavigateToBlockAction',
      'NavigateToJourneyAction',
      'LinkAction'
    ],
    Block: [
      'ButtonBlock',
      'CardBlock',
      'GridContainerBlock',
      'GridItemBlock',
      'IconBlock',
      'ImageBlock',
      'RadioQuestionBlock',
      'RadioOptionBlock',
      'SignUpBlock',
      'StepBlock',
      'TypographyBlock',
      'VideoBlock',
      'VideoTriggerBlock'
    ]
  }
})
