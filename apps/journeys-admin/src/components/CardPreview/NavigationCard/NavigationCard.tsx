import { ReactElement } from 'react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import { ActiveJourneyEditContent } from '@core/journeys/ui/EditorProvider'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { OnSelectProps } from '../OnSelectProps'

interface NavigationCardProps {
  title: string
  destination: ActiveJourneyEditContent
  outlined: boolean
  header: ReactElement
  onSelect?: ({ step, view }: OnSelectProps) => void
}

export function NavigationCard({
  title,
  destination,
  outlined,
  onSelect,
  header
}: NavigationCardProps): ReactElement {
  return (
    <Box
      sx={{
        mt: '24px',
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
        id="CardPreviewAddButton"
        variant="outlined"
        sx={{
          width: 87,
          height: 132,
          m: 1,
          border: '3x solid transparent'
        }}
      >
        <CardActionArea
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
          <Typography variant="body2">{title}</Typography>
        </CardActionArea>
      </Card>
    </Box>
  )
}
