import { ReactElement } from 'react'
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import { useTranslation } from 'react-i18next'
import { VisitorJourneyList } from '../VisitorJourneyList'

interface Props {
  id: string
}

export function VisitorDetail({ id }: Props): ReactElement {
  // const { t } = useTranslation('apps-journeys-admin')

  // TODO: sperate latest journey from everything else

  return (
    <>
      {/* <Box sx={{ py: 4 }}>
        <Typography variant="h5">{t('Latest Journey')}</Typography>
      </Box> */}
      <VisitorJourneyList id={id} />
    </>
  )
}
