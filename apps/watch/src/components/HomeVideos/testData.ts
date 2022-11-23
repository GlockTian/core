import { VideoSubType, VideoType } from '../../../__generated__/globalTypes'
import { GetHomeVideo_video } from '../../../__generated__/GetHomeVideo'

export const videos = [
  '1_jf-0-0',
  '2_GOJ-0-0',
  'rivka',
  '2_Acts-0-0',
  '1_jf-0-0',
  '2_GOJ-0-0',
  'rivka',
  '2_Acts-0-0'
]

export const data: GetHomeVideo_video[] = [
  {
    id: '1_cl-0-0',
    type: VideoType.standalone,
    subType: VideoSubType.featureFilm,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/1_cl-0-0.mobileCinematicHigh.jpg',
    title: [
      {
        value: 'The Story of Jesus for Children',
        __typename: 'Translation'
      }
    ],
    variant: { duration: 3680, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [
      {
        value: 'the-story-of-jesus-for-children',
        __typename: 'Translation'
      }
    ]
  },
  {
    id: '1_jf-0-0',
    type: VideoType.standalone,
    subType: VideoSubType.featureFilm,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/1_jf-0-0.mobileCinematicHigh.jpg',
    title: [{ value: 'JESUS', __typename: 'Translation' }],
    variant: { duration: 7674, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [{ value: 'jesus', __typename: 'Translation' }]
  },
  {
    id: '1_wl-0-0',
    type: VideoType.standalone,
    subType: VideoSubType.series,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/1_wl-0-0.mobileCinematicHigh.jpg',
    title: [
      {
        value: "Magdalena - Director's Cut",
        __typename: 'Translation'
      }
    ],
    variant: { duration: 4952, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [
      {
        value: 'magdalena-directors-cut',
        __typename: 'Translation'
      }
    ]
  },
  {
    id: '2_Acts-0-0',
    type: VideoType.standalone,
    subType: VideoSubType.collection,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/2_Acts-0-0.mobileCinematicHigh.jpg',
    title: [{ value: 'Book of Acts', __typename: 'Translation' }],
    variant: { duration: 11530, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [{ value: 'book-of-acts', __typename: 'Translation' }]
  },
  {
    id: '2_CSF',
    type: VideoType.standalone,
    subType: VideoSubType.shortFilm,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/2_CSF.mobileCinematicHigh.jpg',
    title: [
      {
        value: 'A Day and a Night with Creator Sets Free',
        __typename: 'Translation'
      }
    ],
    variant: { duration: 343, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [
      {
        value: 'a-day-and-a-night-with-creator-sets-free',
        __typename: 'Translation'
      }
    ]
  },
  {
    id: '2_GOJ-0-0',
    type: VideoType.standalone,
    subType: VideoSubType.collection,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/2_GOJ-0-0.mobileCinematicHigh.jpg',
    title: [
      {
        value: 'Life of Jesus (Gospel of John)',
        __typename: 'Translation'
      }
    ],
    variant: { duration: 10994, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [
      {
        value: 'life-of-jesus-gospel-of-john',
        __typename: 'Translation'
      }
    ]
  },
  {
    id: 'MAG1',
    type: VideoType.standalone,
    subType: VideoSubType.collection,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/high_mag_collection_640x300br.jpg',
    title: [{ value: 'Magdalena', __typename: 'Translation' }],
    variant: { duration: 3665, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [{ value: 'magdalena', __typename: 'Translation' }]
  },
  {
    id: '1_0-TrainV_1Install',
    type: VideoType.standalone,
    subType: VideoSubType.segment,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/lrg_cine_install.jpg',
    title: [
      {
        value: 'Installing the Jesus Film Media App',
        __typename: 'Translation'
      }
    ],
    variant: { duration: 118, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: [],
    slug: [
      {
        value: 'installing-the-jesus-film-media-app',
        __typename: 'Translation'
      }
    ]
  },
  {
    id: '1_riv-0-0',
    type: VideoType.playlist,
    subType: VideoSubType.series,
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/1_riv-0-0.mobileCinematicHigh.jpg',
    title: [
      {
        value: 'Rivka',
        __typename: 'Translation'
      }
    ],
    variant: { duration: 118, __typename: 'VideoVariant' },
    __typename: 'Video',
    episodeIds: ['1', '2'],
    slug: [
      {
        value: 'rivka',
        __typename: 'Translation'
      }
    ]
  }
]
