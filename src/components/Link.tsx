import { Link as MuiLink, LinkProps as MuiLinkProps } from '@material-ui/core';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

type Props = NextLinkProps & MuiLinkProps;

const Link: React.FC<Props> = ({
  as,
  children,
  href,
  passHref,
  prefetch,
  replace,
  scroll,
  shallow,
  ...passProps
}) => (
  <NextLink
    passHref
    href={href}
    as={as}
    prefetch={href.match(/^https:?/) ? false : prefetch}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
  >
    <MuiLink {...passProps}>{children}</MuiLink>
  </NextLink>
);

export default Link;
