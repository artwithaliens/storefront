import clsx from 'clsx';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import React from 'react';
import styleToObject from 'style-to-object';
import { BlockCover, BlockGallery, BlockImage, BlockParagraph } from '../blocks';
import RichText from './rich-text';

type Props = {
  children: string | null | undefined;
  options?: HTMLReactParserOptions;
};

const BlockRenderer: React.FC<Props> = ({
  children,
  options = {
    replace: ({ attribs = {}, children = [], name }) => {
      const classNames = attribs.class?.split(/\s/) ?? [];
      const style = mapKeys(styleToObject(attribs.style ?? ''), (_value, key) => camelCase(key));

      return classNames.includes('wp-block-cover') ? (
        <BlockCover className={clsx(classNames)} style={style}>
          {domToReact(children, options)}
        </BlockCover>
      ) : classNames.includes('wp-block-gallery') ? (
        <BlockGallery className={clsx(classNames)} style={style}>
          {domToReact(children, options)}
        </BlockGallery>
      ) : classNames.includes('wp-block-image') ? (
        <BlockImage className={clsx(classNames)} style={style}>
          {domToReact(children, options)}
        </BlockImage>
      ) : name === 'p' ? (
        <BlockParagraph className={clsx(classNames)} style={style}>
          {domToReact(children, options)}
        </BlockParagraph>
      ) : null;
    },
    trim: true,
  },
}) => <RichText>{parse(children ?? '', options)}</RichText>;

export default BlockRenderer;
