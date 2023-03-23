import { ReactElement } from 'react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import { ActiveJourneyEditContent } from '@core/journeys/ui/EditorProvider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

import { OnSelectProps } from '../OnSelectProps'

interface NavigationCardProps {
  id: string
  title: string
  destination: ActiveJourneyEditContent
  outlined?: boolean
  header?: ReactElement
  onSelect?: ({ step, view }: OnSelectProps) => void
  loading?: boolean
  testId?: string
}

export function NavigationCard({
  id,
  title,
  destination,
  outlined = false,
  onSelect,
  header,
  loading = false,
  testId
}: NavigationCardProps): ReactElement {
  return (
    <Box
      id={id}
      data-testid={testId}
      sx={{
        height: '140px',
        width: '95px',
        borderRadius: 2,
        outline: (theme) =>
          outlined
            ? `2px solid ${theme.palette.primary.main} `
            : '2px solid transparent'
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: 87,
          height: 132,
          m: 1,
          border: '3x solid transparent'
        }}
      >
        {loading ? (
          <Skeleton variant="rectangular" width={87} height={132} />
        ) : (
          <CardActionArea
            data-testid="navigation-card-button"
            sx={{
              textAlign: 'center'
            }}
            onClick={() => onSelect?.({ view: destination })}
          >
            <Box
              display="flex"
              width="100%"
              height="80px"
              justifyContent="center"
              alignItems="center"
            >
              {header}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: 14, lineHeight: '16px' }}
              px={2}
            >
              {title}
            </Typography>
          </CardActionArea>
        )}
      </Card>
    </Box>
  )
}
