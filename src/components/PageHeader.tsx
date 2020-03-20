import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { MediaItem } from '../graphql';

const useStyles = makeStyles(
  ({ palette, spacing }) => ({
    root: {
      backgroundColor: palette.background.paper,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      padding: spacing(10),
    },
  }),
  { name: 'PageHeader' },
);

type Props = {
  image?: Partial<MediaItem> | null;
  title?: string | null;
};

const PageHeader: React.FC<Props> = ({ image, title }) => {
  const styles = useStyles();

  return (
    <div
      className={styles.root}
      style={{ backgroundImage: image?.sourceUrl == null ? undefined : `url(${image.sourceUrl})` }}
    >
      <Typography variant="h1" align="center" dangerouslySetInnerHTML={{ __html: title ?? '' }} />
    </div>
  );
};

export default PageHeader;
