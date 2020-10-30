import NextImage from 'next/image';
import React from 'react';
import { MediaItem } from '../../graphql';

type Props = {
  alt?: string;
  className?: string;
  height?: number;
  loading?: 'lazy' | 'eager';
  mediaItem?: Pick<MediaItem, 'altText' | 'mediaDetails' | 'sourceUrl' | 'srcSet' | 'sizes'> | null;
  next?: boolean;
  width?: number;
};

const Image: React.VFC<Props> = ({
  alt,
  className,
  height: heightProp,
  loading,
  mediaItem,
  next = false,
  width: widthProp,
}) => {
  const { height = heightProp, width = widthProp } = mediaItem?.mediaDetails ?? {};

  return mediaItem?.sourceUrl != null ? (
    next ? (
      <NextImage
        {...(height == null || width == null ? { unsized: true } : { height, width })}
        alt={mediaItem.altText ?? alt ?? ''}
        className={className}
        loading={loading}
        sizes={mediaItem.sizes ?? undefined}
        src={mediaItem.sourceUrl}
      />
    ) : (
      <img
        alt={mediaItem.altText ?? alt ?? ''}
        className={className}
        loading={loading}
        sizes={mediaItem.sizes ?? undefined}
        src={mediaItem.sourceUrl}
        srcSet={mediaItem.srcSet ?? undefined}
      />
    )
  ) : null;
};

export default Image;
