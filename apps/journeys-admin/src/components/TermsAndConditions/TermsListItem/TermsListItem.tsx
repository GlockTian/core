import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import { ReactElement } from 'react'
import ListItemText from '@mui/material/ListItemText'

export interface TermsListItemProps {
  link: string
  icon: ReactElement
  text: string
}

export function TermsListItem({
  link,
  icon,
  text
}: TermsListItemProps): ReactElement {
  return (
    <ListItem disablePadding>
      <ListItemButton
        href={link}
        sx={{ pt: 3, pb: 3 }}
        target="_blank"
        rel="noopener"
      >
        <ListItemIcon sx={{ minWidth: '44px', color: 'secondary.light' }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" color="primary.main">
              {text}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  )
}
