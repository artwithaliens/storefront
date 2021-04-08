import { Image } from '@components/core';
import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { MediaItem } from '../../../graphql';

const useStyles = makeStyles(
  () => ({
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
  }),
  { name: 'Hero' },
);

export type HeroProps = {
  fullHeight?: boolean;
  image?: Partial<MediaItem> | null;
  title?: string | null;
};

const Hero: React.VFC<HeroProps> = ({ fullHeight, image, title }) => {
  const styles = useStyles();

  return (
    <Paper
      sx={{
        alignItems: 'center',
        bgcolor: fullHeight ? '#000' : 'background.paper',
        boxSizing: 'border-box',
        display: 'flex',
        height: fullHeight ? { xs: 'calc(100vh - 60px)', md: 'calc(100vh - 110px)' } : 210,
        justifyContent: 'center',
        overflow: 'hidden',
        p: 10,
        position: 'relative',
      }}
    >
      {image?.sourceUrl != null && (
        <Image
          className={clsx(styles.image, fullHeight && styles.imageContain)}
          mediaItem={image}
          next={false}
          loading="lazy"
        />
      )}
      {!fullHeight && (
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            align="center"
            dangerouslySetInnerHTML={{ __html: title ?? '' }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default Hero;
