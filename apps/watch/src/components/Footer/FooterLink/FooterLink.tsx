import { HTMLAttributeAnchorTarget, ReactElement } from 'react'
import MuiLink, { LinkProps } from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Image from 'next/image'

type ValueOf<T> = T[keyof T]

interface FooterLinkProps {
  url: string
  label: string
  variant?: ValueOf<Pick<LinkProps, 'variant'>>
  underline?: ValueOf<Pick<LinkProps, 'underline'>>
  src?: string
  width?: string
  height?: string
  target?: HTMLAttributeAnchorTarget
  noFollow?: boolean
}

export function FooterLink({
  url,
  label,
  variant = 'body1',
  underline = 'none',
  src,
  width,
  height,
  target,
  noFollow = false
}: FooterLinkProps): ReactElement {
  return (
    <MuiLink
      href={url}
      underline={underline}
      target={target}
      rel={noFollow ? 'nofollow noopener' : 'noopener'}
      color="text.primary"
    >
      {src == null ? (
        <Typography variant={variant}>{label}</Typography>
      ) : (
        <Image
          src={src}
          width={width ?? 32}
          height={height ?? 32}
          alt={label}
        />
      )}
    </MuiLink>
  )
}
