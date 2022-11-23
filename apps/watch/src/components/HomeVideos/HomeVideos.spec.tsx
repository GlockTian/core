import { render } from '@testing-library/react'
import { ThemeProvider } from '@core/shared/ui/ThemeProvider'
import { ThemeName, ThemeMode } from '@core/shared/ui/themes'

import { data } from './testData'
import { HomeVideos } from '.'

describe('HomeVideos', () => {
  describe('grid', () => {
    it('should render a grid', () => {
      const { getByTestId } = render(
        <ThemeProvider themeMode={ThemeMode.dark} themeName={ThemeName.website}>
          <HomeVideos data={data} />
        </ThemeProvider>
      )
      expect(getByTestId('video-list-grid')).toBeInTheDocument()
    })
    it('should display videos', async () => {
      const { getByText } = render(<HomeVideos data={data} />)
      expect(getByText(data[1].title[0].value)).toBeInTheDocument()
    })
  })
})
