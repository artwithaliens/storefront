import { Image } from '@components/core';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { MediaItem } from '../../graphql';

const useStyles = makeStyles(
  ({ breakpoints, palette, spacing }) => ({
    root: {
      alignItems: 'center',
      backgroundColor: palette.background.paper,
      boxSizing: 'border-box',
      display: 'flex',
      height: 210,
      justifyContent: 'center',
      overflow: 'hidden',
      padding: spacing(10),
      position: 'relative',
    },

    fullHeight: {
      backgroundColor: '#000',
      height: 'calc(100vh - 60px)',

      [breakpoints.up('md')]: {
        height: 'calc(100vh - 110px)',
      },
    },

    image: {
      height: '100%',
      left: 0,
      objectFit: 'cover',
      opacity: 0.2,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 1,
    },

    imageContain: {
      objectFit: 'contain',
      opacity: 1,
    },

    content: {
      position: 'relative',
      zIndex: 2,
    },
  }),
  { name: 'PageHeader' },
);

type Props = {
  fullHeight?: boolean;
  image?: Partial<MediaItem> | null;
  title?: string | null;
};

const PageHeader: React.VFC<Props> = ({ fullHeight, image, title }) => {
  const styles = useStyles();

  return (
    <Paper className={clsx(styles.root, fullHeight && styles.fullHeight)}>
      {image?.sourceUrl != null && (
        <Image
          className={clsx(styles.image, fullHeight && styles.imageContain)}
          mediaItem={image}
          loading="lazy"
        />
      )}
      {!fullHeight && (
        <div className={styles.content}>
          <Typography
            variant="h1"
            align="center"
            dangerouslySetInnerHTML={{ __html: title ?? '' }}
          />
        </div>
      )}
    </Paper>
  );
};

export default PageHeader;
