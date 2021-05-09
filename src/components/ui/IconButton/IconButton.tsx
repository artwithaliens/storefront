import {
  ExtendButtonBase,
  ExtendButtonBaseTypeMap,
  IconButton as MuiIconButton,
  IconButtonTypeMap,
} from '@material-ui/core';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import Link, { LinkProps } from 'next/link';
import React from 'react';

type TypeMap<P = {}, D extends React.ElementType = 'button'> = ExtendButtonBaseTypeMap<{
  props: P &
    IconButtonTypeMap['props'] &
    Pick<LinkProps, 'as' | 'prefetch'> & {
      href?: LinkProps['href'];
    };
  defaultComponent: D;
}>;

export type IconButtonProps<D extends React.ElementType = TypeMap['defaultComponent'], P = {}> =
  OverrideProps<TypeMap<P, D>, D>;

const IconButton = (({ as, href, prefetch, ...props }: IconButtonProps) =>
  href == null ? (
    <MuiIconButton {...props} />
  ) : (
    <Link passHref as={as} href={href} prefetch={prefetch}>
      <MuiIconButton {...props} />
    </Link>
  )) as ExtendButtonBase<TypeMap>;

export default IconButton;
