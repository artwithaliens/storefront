import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { MediaItem } from '../graphql';

const useStyles = makeStyles(
  ({ breakpoints, palette, spacing }) => ({
    root: {
      backgroundColor: palette.background.paper,
      minHeight: 210,
      overflow: 'hidden',
      padding: spacing(10),
      position: 'relative',
    },

    fullHeight: {
      backgroundColor: palette.common.black,
      height: 'calc(100vh - 60px)',

      [breakpoints.up('md')]: {
        height: 'calc(100vh - 110px)',
      },
    },

    image: {
      height: '100%',
      left: 0,
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      width: '100%',
    },

    imageContain: {
      objectFit: 'contain',
    },
  }),
  { name: 'PageHeader' },
);

type Props = {
  fullHeight?: boolean;
  image?: Partial<MediaItem> | null;
  title?: string | null;
};

const PageHeader: React.FC<Props> = ({ fullHeight, image, title }) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, fullHeight && styles.fullHeight)}>
      {image?.sourceUrl != null && (
        <img
          className={clsx(styles.image, fullHeight && styles.imageContain)}
          src={image.sourceUrl ?? undefined}
          srcSet={image.srcSet ?? undefined}
          alt={image.altText ?? ''}
        />
      )}
      <Typography variant="h1" align="center" dangerouslySetInnerHTML={{ __html: title ?? '' }} />
    </div>
  );
};

export default PageHeader;
