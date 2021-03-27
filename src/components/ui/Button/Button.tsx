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
      href?: LinkProps['href'];
      loading?: boolean;
    };
  defaultComponent: D;
}>;

export type ButtonProps<
  D extends React.ElementType = TypeMap['defaultComponent'],
  P = {}
> = OverrideProps<TypeMap<P, D>, D>;

const Button = (({
  as,
  children,
  disabled = false,
  href,
  loading = false,
  prefetch,
  ...props
}: ButtonProps) => {
  const handleTrack = () => {
    ReactGA.outboundLink(
      { label: typeof children === 'string' ? `Clicked ${children}` : 'Clicked link' },
      () => {},
    );
  };

  return href == null ? (
    <MuiButton disabled={disabled || loading} {...props}>
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
    <MuiButton href={href.toString()} onClick={handleTrack} {...(props as ButtonProps<'a'>)}>
      {children}
    </MuiButton>
  ) : (
    <Link passHref as={as} href={href} prefetch={prefetch}>
      <MuiButton component="a" {...(props as ButtonProps<'a'>)}>
        {children}
      </MuiButton>
    </Link>
  );
}) as ExtendButton<TypeMap>;

export default Button;
