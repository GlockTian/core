import { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { screen, userEvent } from '@storybook/testing-library'
import { ThemeProvider } from '@core/shared/ui/ThemeProvider'
import { ThemeName, ThemeMode } from '@core/shared/ui/themes'
import { MockedProvider } from '@apollo/client/testing'
import { watchConfig } from '../../../libs/storybook'
import { VideoProvider } from '../../../libs/videoContext'
import { getSubtitleMock } from '../../SubtitleDialog/testData'
import { getLanguagesSlugMock } from '../../AudioLanguageDialog/testData'
import { videos } from '../../Videos/__generated__/testData'
import { VideoHero } from './VideoHero'

const VideoHeroStory = {
  ...watchConfig,
  component: VideoHero,
  title: 'Watch/VideoContentPage/VideoHero'
}

const Template: Story = () => {
  const [hasPlayed, setHasPlayed] = useState(false)
  return (
    <MockedProvider mocks={[getLanguagesSlugMock, getSubtitleMock]}>
      <ThemeProvider themeName={ThemeName.website} themeMode={ThemeMode.dark}>
        <VideoProvider value={{ content: videos[0] }}>
          <VideoHero onPlay={() => setHasPlayed(true)} hasPlayed={hasPlayed} />
        </VideoProvider>
      </ThemeProvider>
    </MockedProvider>
  )
}

export const Default = Template.bind({})

export const VideoPlayer = Template.bind({})
VideoPlayer.play = async () => {
  const CustomPlayButton = screen.getAllByRole('button')[1]
  userEvent.click(CustomPlayButton)
}

export default VideoHeroStory as Meta
