import { MockedProvider } from '@apollo/client/testing'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { TreeBlock } from '../..'
import { RadioQuestionFields } from './__generated__/RadioQuestionFields'
import { RadioQuestion, RADIO_QUESTION_RESPONSE_CREATE } from '.'

jest.mock('../../libs/action', () => {
  const originalModule = jest.requireActual('../../libs/action')
  return {
    __esModule: true,
    ...originalModule,
    handleAction: jest.fn()
  }
})

const block: TreeBlock<RadioQuestionFields> = {
  __typename: 'RadioQuestionBlock',
  id: 'RadioQuestion1',
  label: 'Label',
  description: 'Description',
  parentBlockId: 'RadioQuestion1',
  parentOrder: 0,
  children: [
    {
      __typename: 'RadioOptionBlock',
      id: 'RadioOption1',
      label: 'Option 1',
      parentBlockId: 'RadioQuestion1',
      parentOrder: 0,
      action: null,
      children: []
    },
    {
      __typename: 'RadioOptionBlock',
      id: 'RadioOption2',
      label: 'Option 2',
      parentBlockId: 'RadioQuestion1',
      parentOrder: 1,
      action: null,
      children: []
    }
  ]
}

describe('RadioQuestion', () => {
  it('should render question props', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RadioQuestion {...block} />
      </MockedProvider>
    )

    expect(getByText('Label')).toBeInTheDocument()
    expect(getByText('Description')).toBeInTheDocument()
  })

  it('should display the correct options', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RadioQuestion {...block} />
      </MockedProvider>
    )
    expect(getByText('Option 1')).toBeInTheDocument()
    expect(getByText('Option 2')).toBeInTheDocument()
  })

  it('should select an option onClick', async () => {
    const { getByTestId, getAllByRole } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: RADIO_QUESTION_RESPONSE_CREATE,
              variables: {
                input: {
                  id: 'uuid',
                  blockId: 'RadioQuestion1',
                  radioOptionBlockId: 'RadioOption1'
                }
              }
            },
            result: {
              data: {
                radioQuestionResponseCreate: {
                  id: 'uuid',
                  radioOptionBlockId: 'RadioOption1'
                }
              }
            }
          }
        ]}
        addTypename={false}
      >
        <RadioQuestion {...block} uuid={() => 'uuid'} />
      </MockedProvider>
    )
    const buttons = getAllByRole('button')
    fireEvent.click(buttons[0])
    await waitFor(() => expect(buttons[0]).toBeDisabled())
    expect(buttons[0]).toContainElement(
      getByTestId('RadioOptionCheckCircleIcon')
    )
  })

  it('should disable unselected options', async () => {
    const { getByTestId, getAllByRole } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: RADIO_QUESTION_RESPONSE_CREATE,
              variables: {
                input: {
                  id: 'uuid',
                  blockId: 'RadioQuestion1',
                  radioOptionBlockId: 'RadioOption1'
                }
              }
            },
            result: {
              data: {
                radioQuestionResponseCreate: {
                  id: 'uuid',
                  radioOptionBlockId: 'RadioOption1'
                }
              }
            }
          }
        ]}
        addTypename={false}
      >
        <RadioQuestion {...block} uuid={() => 'uuid'} />
      </MockedProvider>
    )
    const buttons = getAllByRole('button')
    fireEvent.click(buttons[0])
    await waitFor(() => expect(buttons[0]).toBeDisabled())
    expect(
      getByTestId('RadioOptionRadioButtonUncheckedIcon')
    ).toBeInTheDocument()
    expect(buttons[1]).toBeDisabled()
    expect(buttons[1]).toContainElement(
      getByTestId('RadioOptionRadioButtonUncheckedIcon')
    )
    fireEvent.click(buttons[1])
    expect(buttons[1]).toBeDisabled()
  })

  it('renders editable question props', () => {
    const { getByRole } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RadioQuestion
          {...block}
          editableLabel={<input aria-label="editableLabel" />}
          editableDescription={<input aria-label="editableDescription" />}
          addOption={<button aria-label="addOption" />}
        />
      </MockedProvider>
    )

    expect(getByRole('textbox', { name: 'editableLabel' })).toBeInTheDocument()
    expect(
      getByRole('textbox', { name: 'editableDescription' })
    ).toBeInTheDocument()
    expect(getByRole('button', { name: 'addOption' })).toBeInTheDocument()
  })

  it('should display options with wrappers', () => {
    const { getByText, getAllByTestId } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RadioQuestion
          {...block}
          wrappers={{
            RadioOptionWrapper: ({ children }) => (
              <div data-testid="radioOptionWrapper">{children}</div>
            )
          }}
        />
      </MockedProvider>
    )
    expect(getAllByTestId('radioOptionWrapper')[0]).toContainElement(
      getByText('Option 1')
    )
    expect(getAllByTestId('radioOptionWrapper')[1]).toContainElement(
      getByText('Option 2')
    )
  })
})
