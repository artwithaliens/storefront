import { Link as MuiLink, LinkProps as MuiLinkProps } from '@material-ui/core';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

type Props = Omit<MuiLinkProps, 'href'> & NextLinkProps;

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
}) =>
  href.toString().match(/^https:?/) ? (
    <MuiLink href={href.toString()} {...passProps}>
      {children}
    </MuiLink>
  ) : (
    <NextLink
      passHref
      href={href}
      as={as}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
    >
      <MuiLink {...passProps}>{children}</MuiLink>
    </NextLink>
  );

export default Link;
