import { CSSObject, useTheme } from '@mui/material/styles'

interface PageWrapperStyles {
  navbar: { width: string }
  toolbar: { variant: 'dense' | 'regular'; height: number }
  sidePanel: { width: string }
  bottomPanel: { height: string }
}

export function usePageWrapperStyles(): PageWrapperStyles {
  const theme = useTheme()

  return {
    navbar: { width: '72px' },
    toolbar: {
      variant: 'dense',
      // Height of the dense toolbar variant
      height:
        theme.components?.MuiToolbar != null
          ? ((theme.components.MuiToolbar.styleOverrides?.dense as CSSObject)
              .maxHeight as number)
          : 12
    },
    sidePanel: { width: '327px' },
    bottomPanel: { height: '300px' }
  }
}
