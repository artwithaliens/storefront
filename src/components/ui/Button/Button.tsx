import {
  Box,
  Button as MuiButton,
  CircularProgress,
  ExtendButton,
  ExtendButtonTypeMap,
} from '@material-ui/core';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import Link, { LinkProps } from 'next/link';
import React from 'react';
import ReactGA from 'react-ga';

type TypeMap<P = {}, D extends React.ElementType = 'button'> = ExtendButtonTypeMap<{
  props: P &
    Pick<LinkProps, 'as' | 'prefetch'> & {
      circle?: boolean;
      href?: LinkProps['href'];
      loading?: boolean;
    };
  defaultComponent: D;
}>;

export type ButtonProps<D extends React.ElementType = TypeMap['defaultComponent'], P = {}> =
  OverrideProps<TypeMap<P, D>, D>;

const Button = (({
  as,
  children,
  circle = false,
  disabled = false,
  href,
  loading = false,
  prefetch,
  size = 'medium',
  sx: sxProp,
  ...props
}: ButtonProps) => {
  const handleTrack = () => {
    ReactGA.outboundLink(
      { label: typeof children === 'string' ? `Clicked ${children}` : 'Clicked link' },
      () => {},
    );
  };

  const sx: typeof sxProp = {
    ...sxProp,
    ...(circle && {
      minWidth: 0,
      p: 0,

      ...(size === 'small'
        ? {
            borderRadius: 22,
            height: 22,
            width: 22,
          }
        : {
            borderRadius: 44,
            height: 44,
            width: 44,
          }),
    }),
  };

  return href == null ? (
    <MuiButton disabled={disabled || loading} size={size} sx={sx} {...props}>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            left: '50%',
            position: 'absolute',
            transform: 'translate(-50%)',
            visibility: 'visible',
          }}
        >
          <CircularProgress color="inherit" size={26} />
        </Box>
      )}
      <Box component="span" sx={loading ? { visibility: 'hidden' } : {}}>
        {children}
      </Box>
    </MuiButton>
  ) : /^https?:/.test(href.toString()) ? (
    <MuiButton
      href={href.toString()}
      size={size}
      sx={sx}
      onClick={handleTrack}
      {...(props as ButtonProps<'a'>)}
    >
      {children}
    </MuiButton>
  ) : (
    <Link passHref as={as} href={href} prefetch={prefetch}>
      <MuiButton component="a" size={size} sx={sx} {...(props as ButtonProps<'a'>)}>
        {children}
      </MuiButton>
    </Link>
  );
}) as ExtendButton<TypeMap>;

export default Button;
