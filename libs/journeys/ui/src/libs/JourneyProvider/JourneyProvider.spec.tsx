import { render, fireEvent } from '@testing-library/react'
import { ReactElement } from 'react'
import Button from '@mui/material/Button'
import type { TreeBlock } from '../block'
import {
  JourneyStatus,
  ThemeMode,
  ThemeName
} from '../../../__generated__/globalTypes'
import { JourneyFields as Journey } from './__generated__/JourneyFields'
import { JourneyProvider, useJourney } from '.'

const checkJourney = jest.fn()

const TestComponent = (): ReactElement => {
  const { journey } = useJourney()

  return <Button onClick={checkJourney(journey)}>Test</Button>
}

const journey: Journey = {
  __typename: 'Journey',
  id: 'journeyId',
  themeName: ThemeName.base,
  themeMode: ThemeMode.light,
  title: 'my journey',
  slug: 'my-journey',
  language: {
    __typename: 'Language',
    id: '529',
    bcp47: 'en',
    iso3: 'eng',
    name: [
      {
        __typename: 'Translation',
        value: 'English',
        primary: true
      }
    ]
  },
  description: 'my cool journey',
  status: JourneyStatus.draft,
  createdAt: '2021-11-19T12:34:56.647Z',
  publishedAt: null,
  blocks: [
    {
      id: 'step0.id',
      __typename: 'StepBlock',
      parentBlockId: null,
      locked: false,
      nextBlockId: 'step1.id'
    }
  ] as TreeBlock[],
  primaryImageBlock: null,
  userJourneys: [],
  template: null,
  seoTitle: null,
  seoDescription: null
}

describe('JourneyContext', () => {
  it('should pass through the journey props', () => {
    const { getByRole } = render(
      <JourneyProvider value={{ journey }}>
        <TestComponent />
      </JourneyProvider>
    )

    fireEvent.click(getByRole('button'))

    expect(checkJourney).toBeCalledWith({
      __typename: 'Journey',
      id: 'journeyId',
      themeName: ThemeName.base,
      themeMode: ThemeMode.light,
      title: 'my journey',
      slug: 'my-journey',
      language: {
        __typename: 'Language',
        id: '529',
        bcp47: 'en',
        iso3: 'eng',
        name: [
          {
            __typename: 'Translation',
            value: 'English',
            primary: true
          }
        ]
      },
      description: 'my cool journey',
      status: JourneyStatus.draft,
      template: null,
      createdAt: '2021-11-19T12:34:56.647Z',
      publishedAt: null,
      blocks: [
        {
          id: 'step0.id',
          __typename: 'StepBlock',
          parentBlockId: null,
          locked: false,
          nextBlockId: 'step1.id'
        }
      ] as TreeBlock[],
      primaryImageBlock: null,
      userJourneys: [],
      seoTitle: null,
      seoDescription: null
    })
  })
})
