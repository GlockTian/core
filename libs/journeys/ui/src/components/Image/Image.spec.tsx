import { render } from '@testing-library/react'
import { TreeBlock } from '../..'
import { ImageFields } from './__generated__/ImageFields'
import { Image } from '.'

const block: TreeBlock<ImageFields> = {
  __typename: 'ImageBlock',
  id: 'image0.id',
  src: 'https://images.unsplash.com/photo-1600133153574-25d98a99528c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
  width: 1600,
  height: 1067,
  alt: 'random image from unsplash',
  parentBlockId: 'Image1',
  parentOrder: 0,
  blurhash: 'L9AS}j^-0dVC4Tq[=~PATeXSV?aL',
  children: []
}

describe('Image', () => {
  it('should have correct props', () => {
    const { getByRole } = render(<Image {...block} alt={block.alt} />)
    expect(getByRole('img')).toHaveAttribute(
      'alt',
      'random image from unsplash'
    )
  })

  it('should render the default image', () => {
    const { getByTestId } = render(
      <Image {...block} src={null} alt="defaultImageIcon" />
    )
    expect(getByTestId('ImageRoundedIcon')).toHaveClass('MuiSvgIcon-root')
  })
})
