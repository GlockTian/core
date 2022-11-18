import { Story, Meta } from '@storybook/react'
import { MockedProvider } from '@apollo/client/testing'
// import { gql } from '@apollo/client'
import { journeysAdminConfig } from '../../libs/storybook'
// import { edges, pageInfo } from './VisitorListData'
import { GET_VISITORS_CONNECTION, VisitorList } from './VisitorList'

const VisitorListStory = {
  ...journeysAdminConfig,
  component: VisitorList,
  title: 'Journeys-Admin/VisitorList'
}

const Template: Story = () => {
  const reportMocks = [
    {
      request: {
        query: GET_VISITORS_CONNECTION,
        variables: { first: 10, teamId: 'jfp-team'}
      },
      result: {
        data: {
          visitorsConnection: {
            edges: [
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "3f40a48a-4146-4394-91a8-4588ded7198b",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "3f40a48a-4146-4394-91a8-4588ded7198b"
              },
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 1",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 1"
              },
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 2",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 2"
              },
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 3",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 3"
              },
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 4",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 4"
              },
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 5",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 5"
              },
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 6",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 6"
              },          
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 7",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 7"
              },
              {
                node: {createdAt: "2022-10-24T21:11:38.637Z",
                id: "Testing 8",
                lastChatStartedAt: null,
                name: null,
                status: null,},
                cursor: "Testing 8"
              },
          ],
            
            pageInfo: {
              endCursor: "8edb26aa-95b1-44ce-b534-f27c455a0ea1",
              hasNextPage: false
            }
          }
        }
      }
    }
  ]  
    return (
      <MockedProvider mocks={reportMocks}>
        <VisitorList />
      </MockedProvider>
    )
  
}


export const Default = Template.bind({})

export default VisitorListStory as Meta
