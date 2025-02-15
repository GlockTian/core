import { MockedProvider } from '@apollo/client/testing'
import { Story, Meta } from '@storybook/react'
import { journeyUiConfig } from '../../libs/journeyUiConfig'
import type { TreeBlock } from '../../libs/block'
import { StoryCard } from '../StoryCard'
import {
  TypographyVariant,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  IconName,
  IconSize
} from '../../../__generated__/globalTypes'
import { GridItem } from './GridItem'
import { GridItemFields } from './__generated__/GridItemFields'

const Demo = {
  ...journeyUiConfig,
  component: GridItem,
  title: 'Journeys-Ui/Grid/Item',
  parameters: {
    chromatic: { disable: true }
  }
}

const Template: Story<TreeBlock<GridItemFields>> = ({ ...props }) => (
  <MockedProvider>
    <StoryCard>
      <GridItem {...props} />
    </StoryCard>
  </MockedProvider>
)

const childrenOne: TreeBlock[] = [
  {
    id: 'typographyBlockId',
    __typename: 'TypographyBlock',
    parentBlockId: 'GridItemLeft',
    parentOrder: 0,
    align: null,
    color: null,
    content: "What's the purpose, and how did we get here?",
    variant: TypographyVariant.h3,
    children: []
  },
  {
    id: 'typographyBlockId1',
    __typename: 'TypographyBlock',
    parentBlockId: 'GridItemLeft',
    parentOrder: 1,
    align: null,
    color: null,
    content:
      'Follow the journey of a curious Irishman traveling around the world looking for answers and wrestling with the things that just don’t seem to make sense. ',
    variant: null,
    children: []
  },
  {
    __typename: 'ButtonBlock',
    id: 'button',
    parentBlockId: 'GridItemLeft',
    parentOrder: 2,
    label: 'Watch Now',
    buttonVariant: ButtonVariant.contained,
    buttonColor: ButtonColor.primary,
    size: ButtonSize.large,
    startIconId: 'icon',
    endIconId: null,
    action: null,
    children: [
      {
        id: 'icon',
        __typename: 'IconBlock',
        parentBlockId: 'button',
        parentOrder: 0,
        iconName: IconName.PlayArrowRounded,
        iconColor: null,
        iconSize: IconSize.md,
        children: []
      }
    ]
  }
]

export const Default: Story<TreeBlock<GridItemFields>> = Template.bind({})
Default.args = {
  id: 'GridItemLeft',
  __typename: 'GridItemBlock',
  xl: 6,
  lg: 6,
  sm: 6,
  parentBlockId: 'GridContainer',
  parentOrder: 0,
  children: childrenOne
}

export default Demo as Meta
