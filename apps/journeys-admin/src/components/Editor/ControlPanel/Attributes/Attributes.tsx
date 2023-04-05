import { ActiveTab, useEditor } from '@core/journeys/ui/EditorProvider'
import type { TreeBlock } from '@core/journeys/ui/block'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiTypography from '@mui/material/Typography'
import { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SocialShareAppearance } from '../../Drawer/SocialShareAppearance'
import {
  Card,
  Step,
  Typography,
  Button,
  SignUp,
  RadioOption,
  Video,
  Image,
  TextResponse
} from './blocks'
import { MoveBlockButtons } from './MoveBlockButtons'

function AttributesContent({ selected, step }: AttributesProps): ReactElement {
  const withMoveButtons = (block: ReactElement): ReactElement => {
    return (
      <>
        <MoveBlockButtons selectedBlock={selected} selectedStep={step} />
        <Divider orientation="vertical" variant="middle" flexItem />
        {block}
      </>
    )
  }

  switch (selected.__typename) {
    case 'CardBlock':
      return <Card {...selected} />

    case 'StepBlock': {
      const block = selected.children.find(
        (block) =>
          block.__typename === 'CardBlock' || block.__typename === 'VideoBlock'
      )
      return (
        <>
          <Step {...selected} />
          <Divider orientation="vertical" variant="middle" flexItem />
          {block != null && <AttributesContent selected={block} step={step} />}
        </>
      )
    }

    case 'VideoBlock': {
      return step.id === selected.parentBlockId ? (
        <Video {...selected} />
      ) : (
        withMoveButtons(<Video {...selected} />)
      )
    }

    case 'ImageBlock': {
      return withMoveButtons(<Image {...selected} alt={selected.alt} />)
    }

    case 'TypographyBlock': {
      return withMoveButtons(<Typography {...selected} />)
    }

    case 'ButtonBlock': {
      return withMoveButtons(<Button {...selected} />)
    }

    case 'RadioQuestionBlock': {
      return withMoveButtons(<></>)
    }

    case 'RadioOptionBlock': {
      return withMoveButtons(<RadioOption {...selected} />)
    }

    case 'SignUpBlock': {
      return withMoveButtons(<SignUp {...selected} />)
    }

    case 'TextResponseBlock': {
      return withMoveButtons(<TextResponse {...selected} />)
    }
    default:
      return <></>
  }
}

interface AttributesProps {
  selected: TreeBlock
  step: TreeBlock
}

export function Attributes({ selected, step }: AttributesProps): ReactElement {
  const { t } = useTranslation('apps-journeys-admin')
  const {
    state: { activeTab, journeyEditContentComponent },
    dispatch
  } = useEditor()

  useEffect(() => {
    if (
      activeTab === ActiveTab.Journey &&
      journeyEditContentComponent !== 'action'
    ) {
      dispatch({
        type: 'SetDrawerPropsAction',
        title: 'Social Share Appearance',
        children: <SocialShareAppearance />
      })
    }
  }, [activeTab, dispatch, journeyEditContentComponent])

  // Map typename to labels when we have translation keys
  const blockLabel =
    selected.__typename === 'StepBlock'
      ? t('Card')
      : selected.__typename === 'SignUpBlock'
      ? t('Subscribe')
      : selected.__typename === 'TextResponseBlock'
      ? t('Feedback')
      : selected.__typename === 'RadioQuestionBlock'
      ? t('Poll')
      : selected.__typename === 'RadioOptionBlock'
      ? t('Poll Option')
      : selected.__typename.replace('Block', '')

  return (
    <>
      <Stack
        direction="row"
        spacing={4}
        sx={{
          overflowX: 'auto',
          py: 5,
          px: 6
        }}
      >
        <AttributesContent selected={selected} step={step} />
      </Stack>
      <Box
        sx={{
          py: 4.25,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <MuiTypography align="center">
          {t('Editing {{block}} Properties', { block: blockLabel })}
        </MuiTypography>
      </Box>
    </>
  )
}
