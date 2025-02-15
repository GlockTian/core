import { ReactElement } from 'react'
import Image from 'next/image'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import taskbarIcon from '../../../../public/taskbar-icon.svg'
import { usePageWrapperStyles } from '../utils/usePageWrapperStyles'

export interface MainBodyContainerProps {
  onClick: () => void
}

export function AppHeader({ onClick }: MainBodyContainerProps): ReactElement {
  const { toolbar } = usePageWrapperStyles()

  return (
    <Box id="app-header" sx={{ display: { sm: 'none' } }}>
      <AppBar
        role="banner"
        position="fixed"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          backgroundColor: 'secondary.dark'
        }}
      >
        <Toolbar variant={toolbar.variant}>
          <Stack direction="row" flexGrow={1} alignItems="center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onClick}
            >
              <MenuIcon sx={{ color: 'background.paper' }} />
            </IconButton>
            <Stack
              direction="row"
              flexGrow={1}
              justifyContent="center"
              sx={{ ml: -9 }}
            >
              <Image
                src={taskbarIcon}
                width={32}
                height={32}
                layout="fixed"
                alt="Next Steps"
              />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
