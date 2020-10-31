import { Link as MuiLink, LinkProps as MuiLinkProps } from '@material-ui/core';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';
import ReactGA from 'react-ga';

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
}) => {
  const handleTrack = () => {
    ReactGA.outboundLink(
      { label: typeof children === 'string' ? `Clicked ${children}` : 'Clicked link' },
      () => {},
    );
  };

  return href.toString().match(/^https:?/) ? (
    <MuiLink href={href.toString()} onClick={handleTrack} {...passProps}>
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
};

export default Link;
