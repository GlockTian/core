import { journeysAdminConfig } from '../../libs/storybook'
import { MockedProvider } from '@apollo/client/testing'
import { Meta, Story } from '@storybook/react'
import { JourneysAppBar, JourneysAppBarProps } from '.'
import { JourneyProvider } from '../JourneyView/Context'
import { defaultJourney } from '../JourneyView/data'

const JourneysAppBarDemo = {
  ...journeysAdminConfig,
  component: JourneysAppBar,
  title: 'Journeys-Admin/JourneysAppBar',
  parameters: {
    layout: 'fullscreen'
  }
}

const Template: Story<JourneysAppBarProps> = ({ ...args }) => (
  <MockedProvider mocks={[]}>
    <JourneyProvider value={defaultJourney}>
      <JourneysAppBar {...args} />
    </JourneyProvider>
  </MockedProvider>
)

export const Default = Template.bind({})

export const SingleJourney = Template.bind({})
SingleJourney.args = { variant: 'view' }

export default JourneysAppBarDemo as Meta
