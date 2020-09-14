import clsx from 'clsx';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import React from 'react';
import styleToObject from 'style-to-object';
import BlockCover from '../../blocks/block-cover';
import BlockGallery from '../../blocks/block-gallery';
import BlockImage from '../../blocks/block-image';
import BlockParagraph from '../../blocks/block-paragraph';
import RichText from './rich-text';

export function parseWithBlocks(html: string) {
  const options: HTMLReactParserOptions = {
    replace: ({
      attribs = {},
      children,
      name,
    }: {
      attribs: { class?: string; style?: string };
      children: string[];
      name: string;
    }) => {
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
        <BlockParagraph className={clsx(classNames)}>
          {domToReact(children, options)}
        </BlockParagraph>
      ) : null;
    },
  };
  return parse(html, options) as React.ReactElement;
}

type Props = {
  children: string | null | undefined;
};

const BlockRenderer: React.FC<Props> = ({ children }) => (
  <RichText>{parseWithBlocks(children ?? '')}</RichText>
);

export default BlockRenderer;
