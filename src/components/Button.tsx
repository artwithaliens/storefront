import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@material-ui/core';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { UrlObject } from 'url';

type Props = MuiButtonProps & {
  as?: string | UrlObject;
  href?: string | UrlObject;
  loading?: boolean;
  rel?: string;
  target?: string;
};

const Button: React.FC<Props> = ({
  as,
  children,
  disabled,
  href,
  loading,
  ref: passRef,
  rel,
  target,
  ...passProps
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    setWidth(ref.current?.offsetWidth);
  }, [ref]);

  return href == null ? (
    <MuiButton
      ref={ref}
      disabled={loading || disabled}
      style={loading ? { width } : undefined}
      {...passProps}
    >
      {loading ? <CircularProgress color="inherit" size={26} /> : children}
    </MuiButton>
  ) : href.match(/^https?:/) ? (
    <MuiButton href={href} target={target} rel={rel} {...(passProps as unknown)}>
      {children}
    </MuiButton>
  ) : (
    <Link passHref as={as} href={href}>
      <MuiButton {...passProps}>{children}</MuiButton>
    </Link>
  );
};

export default Button;
