import { Story, Meta } from '@storybook/react'
import { MockedProvider } from '@apollo/client/testing'
import { FlagsProvider } from '@core/shared/ui/FlagsProvider'
import { journeysAdminConfig } from '../../libs/storybook'
import { PageWrapper } from '../NewPageWrapper'
import { GET_ACTIVE_JOURNEYS } from '../../libs/useActiveJourneys/useActiveJourneys'
import {
  defaultJourney,
  oldJourney,
  descriptiveJourney,
  publishedJourney
} from './journeyListData'
import { JourneyList } from '.'

const JourneyListStory = {
  ...journeysAdminConfig,
  component: JourneyList,
  title: 'Journeys-Admin/JourneyList',
  parameters: {
    ...journeysAdminConfig.parameters,
    layout: 'fullscreen'
  }
}

const Template: Story = ({ ...args }) => (
  <MockedProvider
    mocks={[
      {
        request: {
          query: GET_ACTIVE_JOURNEYS
        },
        result: {
          data: {
            journeys: [...args.props.journeys]
          }
        }
      }
    ]}
  >
    <FlagsProvider flags={args.flags}>
      <PageWrapper title="Active Journeys">
        <JourneyList {...args.props} />
      </PageWrapper>
    </FlagsProvider>
  </MockedProvider>
)

export const Default = Template.bind({})
Default.args = {
  props: {
    journeys: [
      defaultJourney,
      publishedJourney,
      oldJourney,
      descriptiveJourney
    ],
    event: ''
  }
}

export const NoJourneys = Template.bind({})
NoJourneys.args = {
  props: {
    journeys: [],
    event: ''
  }
}

export const InviteRequirement = Template.bind({})
InviteRequirement.args = {
  props: {
    journeys: [],
    event: ''
  },
  flags: {
    inviteRequirement: true
  }
}

export default JourneyListStory as Meta
