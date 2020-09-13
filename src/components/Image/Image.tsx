import React from 'react';
import { MediaItem } from '../../graphql';

type Props = {
  alt?: string;
  className?: string;
  loading?: 'lazy';
  mediaItem?: Pick<MediaItem, 'altText' | 'sourceUrl' | 'srcSet' | 'sizes'> | null;
};

const Image: React.FC<Props> = ({ alt, className, loading, mediaItem }) => (
  <img
    className={className}
    src={mediaItem?.sourceUrl ?? undefined}
    srcSet={mediaItem?.srcSet ?? undefined}
    sizes={mediaItem?.sizes ?? undefined}
    alt={mediaItem?.altText ?? alt ?? ''}
    loading={loading}
  />
);

export default Image;
