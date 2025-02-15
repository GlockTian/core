import { ReactElement, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import TagManager from 'react-gtm-module'
import { NextSeo } from 'next-seo'
import { useTranslation } from 'react-i18next'
import type { TreeBlock } from '../../libs/block'
import { useBlocks } from '../../libs/block'
import { getStepHeading } from '../../libs/getStepHeading'
import { BlockRenderer, WrappersProps } from '../BlockRenderer'
import { useJourney } from '../../libs/JourneyProvider/JourneyProvider'
import { StepFields } from './__generated__/StepFields'
import { StepViewEventCreate } from './__generated__/StepViewEventCreate'

export const STEP_VIEW_EVENT_CREATE = gql`
  mutation StepViewEventCreate($input: StepViewEventCreateInput!) {
    stepViewEventCreate(input: $input) {
      id
    }
  }
`

interface StepProps extends TreeBlock<StepFields> {
  wrappers?: WrappersProps
}

export function Step({
  id: blockId,
  children,
  wrappers
}: StepProps): ReactElement {
  const [stepViewEventCreate] = useMutation<StepViewEventCreate>(
    STEP_VIEW_EVENT_CREATE
  )

  const { admin, journey } = useJourney()
  const { treeBlocks } = useBlocks()
  const { t } = useTranslation('libs-journeys-ui')

  const heading = getStepHeading(blockId, children, treeBlocks, t)

  useEffect(() => {
    if (!admin) {
      const id = uuidv4()
      void stepViewEventCreate({
        variables: { input: { id, blockId, value: heading } }
      })
      TagManager.dataLayer({
        dataLayer: {
          event: 'step_view',
          eventId: id,
          blockId,
          stepName: heading
        }
      })
    }
  }, [blockId, stepViewEventCreate, admin, heading])

  return (
    <>
      {!admin && <NextSeo title={`${journey?.title ?? ''} (${heading})`} />}
      {children.map((block) => (
        <BlockRenderer block={block} wrappers={wrappers} key={block.id} />
      ))}
    </>
  )
}
