import { CircularProgress, ExtendButton, ExtendButtonTypeMap } from '@material-ui/core';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import { LoadingButton } from '@material-ui/lab';
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

const Button = (({ as, children, href, loading, prefetch, ...props }: ButtonProps) => {
  const handleTrack = () => {
    ReactGA.outboundLink(
      { label: typeof children === 'string' ? `Clicked ${children}` : 'Clicked link' },
      () => {},
    );
  };

  return href == null ? (
    <LoadingButton
      pending={loading}
      pendingIndicator={<CircularProgress color="inherit" size={26} />}
      {...props}
    >
      {children}
    </LoadingButton>
  ) : /^https?:/.test(href.toString()) ? (
    <LoadingButton href={href.toString()} onClick={handleTrack} {...(props as ButtonProps<'a'>)}>
      {children}
    </LoadingButton>
  ) : (
    <Link passHref as={as} href={href} prefetch={prefetch}>
      <LoadingButton component="a" {...(props as ButtonProps<'a'>)}>
        {children}
      </LoadingButton>
    </Link>
  );
}) as ExtendButton<TypeMap>;

export default Button;
