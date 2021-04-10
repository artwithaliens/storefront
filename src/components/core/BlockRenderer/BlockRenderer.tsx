import { BlockCover, BlockGallery, BlockImage, BlockParagraph } from '@components/blocks';
import { RichText } from '@components/core';
import clsx from 'clsx';
import parse, { DOMNode, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import React from 'react';
import styleToObject from 'style-to-object';

type Props = {
  children: string | null | undefined;
  options?: HTMLReactParserOptions;
};

const BlockRenderer: React.FC<Props> = ({
  children,
  options = {
    replace: (node: DOMNode) => {
      if ('attribs' in node) {
        const { attribs = {}, children = [], name } = node;
        const classNames = attribs.class?.split(/\s/) ?? [];
        const style = mapKeys(styleToObject(attribs.style ?? ''), (_value, key) => camelCase(key));

        return classNames.includes('wp-block-cover') ? (
          <BlockCover className={clsx(classNames)} style={style}>
            {domToReact(children as DOMNode[], options)}
          </BlockCover>
        ) : classNames.includes('wp-block-gallery') ? (
          <BlockGallery className={clsx(classNames)} style={style}>
            {domToReact(children as DOMNode[], options)}
          </BlockGallery>
        ) : classNames.includes('wp-block-image') ? (
          <BlockImage className={clsx(classNames)} style={style}>
            {domToReact(children as DOMNode[], options)}
          </BlockImage>
        ) : name === 'p' ? (
          <BlockParagraph className={clsx(classNames)} style={style}>
            {domToReact(children as DOMNode[], options)}
          </BlockParagraph>
        ) : null;
      }
      return null;
    },
    trim: true,
  },
}) => <RichText>{parse(children ?? '', options)}</RichText>;

export default BlockRenderer;
