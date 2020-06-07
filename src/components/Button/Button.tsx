import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@material-ui/core';
import Link, { LinkProps } from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

type Props = Omit<MuiButtonProps, 'href'> &
  Pick<LinkProps, 'as' | 'prefetch'> & {
    href?: LinkProps['href'];
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
  prefetch,
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
  ) : href.toString().match(/^https?:/) ? (
    <MuiButton
      href={href.toString()}
      target={target}
      rel={rel}
      {...(passProps as MuiButtonProps<'a'>)}
    >
      {children}
    </MuiButton>
  ) : (
    <Link passHref as={as} href={href} prefetch={prefetch}>
      <MuiButton component="a" {...(passProps as MuiButtonProps<'a'>)}>
        {children}
      </MuiButton>
    </Link>
  );
};

export default Button;
