import { fireEvent, render, waitFor } from '@testing-library/react'
import type { TreeBlock } from '@core/journeys/ui/block'
import { MockedProvider } from '@apollo/client/testing'
import {
  VideoBlockSource,
  VideoBlockObjectFit as ObjectFit
} from '../../../../../__generated__/globalTypes'
import { ThemeProvider } from '../../../ThemeProvider'
import { VideoBlockEditorSettings } from '.'

const video: TreeBlock = {
  id: 'video1.id',
  __typename: 'VideoBlock',
  parentBlockId: 'card1.id',
  parentOrder: 0,
  startAt: 0,
  endAt: null,
  muted: true,
  autoplay: true,
  fullsize: true,
  action: null,
  videoId: '2_0-FallingPlates',
  videoVariantLanguageId: '529',
  source: VideoBlockSource.internal,
  title: null,
  description: null,
  duration: null,
  image: null,
  video: {
    __typename: 'Video',
    id: '2_0-FallingPlates',
    title: [
      {
        __typename: 'Translation',
        value: 'FallingPlates'
      }
    ],
    image:
      'https://d1wl257kev7hsz.cloudfront.net/cinematics/2_0-FallingPlates.mobileCinematicHigh.jpg',
    variant: {
      __typename: 'VideoVariant',
      id: '2_0-FallingPlates-529',
      hls: 'https://arc.gt/hls/2_0-FallingPlates/529'
    }
  },
  posterBlockId: null,
  children: [],
  objectFit: null
}

describe('VideoBlockEditorSettings', () => {
  it('should disable fields when no selected block', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={null}
            posterBlock={null}
            onChange={jest.fn()}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    expect(getByRole('checkbox', { name: 'Autoplay' })).toBeDisabled()
    expect(getByRole('checkbox', { name: 'Muted' })).toBeDisabled()
    expect(getByRole('textbox', { name: 'Starts At' })).toBeDisabled()
    expect(getByRole('textbox', { name: 'Ends At' })).toBeDisabled()
  })

  it('should disable some fields when no parent order', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={{ ...video, parentOrder: null }}
            posterBlock={null}
            onChange={jest.fn()}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    expect(getByRole('checkbox', { name: 'Autoplay' })).toBeDisabled()
    expect(getByRole('checkbox', { name: 'Muted' })).toBeDisabled()
    expect(getByRole('textbox', { name: 'Starts At' })).not.toBeDisabled()
    expect(getByRole('textbox', { name: 'Ends At' })).not.toBeDisabled()
  })

  it('should update autoplay', async () => {
    const onChange = jest.fn()
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={video}
            posterBlock={null}
            onChange={onChange}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    fireEvent.click(getByRole('checkbox', { name: 'Autoplay' }))
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        autoplay: false,
        muted: true,
        endAt: 0,
        startAt: 0,
        objectFit: ObjectFit.fill
      })
    )
  })
  it('should update muted', async () => {
    const onChange = jest.fn()
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={video}
            posterBlock={null}
            onChange={onChange}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    fireEvent.click(getByRole('checkbox', { name: 'Muted' }))
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        autoplay: true,
        muted: false,
        endAt: 0,
        startAt: 0,
        objectFit: ObjectFit.fill
      })
    })
  })
  it('should update startAt', async () => {
    const onChange = jest.fn()
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={video}
            posterBlock={null}
            onChange={onChange}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    const textbox = getByRole('textbox', { name: 'Starts At' })
    fireEvent.change(textbox, { target: { value: '00:00:11' } })
    fireEvent.blur(textbox)
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        autoplay: true,
        muted: true,
        endAt: 0,
        startAt: 11,
        objectFit: ObjectFit.fill
      })
    )
  })
  it('should update endAt', async () => {
    const onChange = jest.fn()
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={video}
            posterBlock={null}
            onChange={onChange}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    const textbox = getByRole('textbox', { name: 'Ends At' })
    fireEvent.change(textbox, { target: { value: '00:00:11' } })
    fireEvent.blur(textbox)
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        autoplay: true,
        muted: true,
        endAt: 11,
        startAt: 0,
        objectFit: ObjectFit.fill
      })
    )
  })
  it('should update objectFit to fit', async () => {
    const onChange = jest.fn()
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={video}
            posterBlock={null}
            onChange={onChange}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    fireEvent.click(getByRole('button', { name: 'Fit' }))
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        autoplay: true,
        muted: true,
        endAt: 0,
        startAt: 0,
        objectFit: ObjectFit.fit
      })
    })
  })

  it('Aspect ratio buttons should be disabled for youtube video', async () => {
    const onChange = jest.fn()
    const { getByRole } = render(
      <ThemeProvider>
        <MockedProvider>
          <VideoBlockEditorSettings
            selectedBlock={{
              ...video,
              source: VideoBlockSource.youTube,
              objectFit: ObjectFit.fill
            }}
            posterBlock={null}
            onChange={onChange}
          />
        </MockedProvider>
      </ThemeProvider>
    )
    expect(getByRole('button', { name: 'Fill' })).toBeDisabled()
    expect(getByRole('button', { name: 'Fit' })).toBeDisabled()
    expect(getByRole('button', { name: 'Fit' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(getByRole('button', { name: 'Crop' })).toBeDisabled()
  })
})
