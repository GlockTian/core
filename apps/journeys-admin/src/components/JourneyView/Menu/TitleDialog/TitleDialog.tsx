import { ReactElement } from 'react'
import { useMutation, gql, ApolloError } from '@apollo/client'
import TextField from '@mui/material/TextField'
import { Dialog } from '@core/shared/ui/Dialog'
import { useSnackbar } from 'notistack'
import { Formik, Form, FormikValues } from 'formik'
import { useJourney } from '@core/journeys/ui/JourneyProvider'
import { JourneyTitleUpdate } from '../../../../../__generated__/JourneyTitleUpdate'

export const JOURNEY_TITLE_UPDATE = gql`
  mutation JourneyTitleUpdate($id: ID!, $input: JourneyUpdateInput!) {
    journeyUpdate(id: $id, input: $input) {
      id
      title
    }
  }
`

interface TitleDialogProps {
  open: boolean
  onClose: () => void
}

export function TitleDialog({ open, onClose }: TitleDialogProps): ReactElement {
  const [journeyUpdate] = useMutation<JourneyTitleUpdate>(JOURNEY_TITLE_UPDATE)
  const { journey } = useJourney()
  const { enqueueSnackbar } = useSnackbar()

  const handleUpdateTitle = async (values: FormikValues): Promise<void> => {
    if (journey == null) return

    try {
      await journeyUpdate({
        variables: { id: journey.id, input: { title: values.title } },
        optimisticResponse: {
          journeyUpdate: {
            id: journey.id,
            __typename: 'Journey',
            title: values.title
          }
        }
      })
      onClose()
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.networkError != null) {
          enqueueSnackbar(
            'Field update failed. Reload the page or try again.',
            {
              variant: 'error',
              preventDuplicate: true
            }
          )
          return
        }
      }
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true
      })
    }
  }

  function handleClose(resetForm: (values: FormikValues) => void): () => void {
    return () => {
      onClose()
      // wait for dialog animation to complete
      setTimeout(() => resetForm({ values: { title: journey?.title } }))
    }
  }

  return (
    <>
      {journey != null && (
        <Formik
          initialValues={{ title: journey.title }}
          onSubmit={handleUpdateTitle}
        >
          {({ values, handleChange, handleSubmit, resetForm }) => (
            <Dialog
              open={open}
              onClose={handleClose(resetForm)}
              dialogTitle={{ title: 'Edit Title' }}
              dialogAction={{
                onSubmit: handleSubmit,
                closeLabel: 'Cancel'
              }}
            >
              <Form>
                <TextField
                  id="title"
                  name="title"
                  hiddenLabel
                  fullWidth
                  value={values.title}
                  variant="filled"
                  onChange={handleChange}
                />
              </Form>
            </Dialog>
          )}
        </Formik>
      )}
    </>
  )
}
