import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(
  ({ spacing }) => ({
    root: {
      marginBottom: spacing(2),

      '& img': {
        maxWidth: '100%',
        verticalAlign: 'middle',
      },

      '&.aligncenter': {
        textAlign: 'center',
      },

      '&.alignfull img, &.alignwide img': {
        width: '100%',
      },

      '& .alignleft, & .alignright, & .aligncenter, &.is-resized': {
        display: 'table',
        marginLeft: 0,
        marginRight: 0,

        '& > figcaption': {
          captionSide: 'bottom',
          display: 'table-caption',
        },
      },

      '& .alignleft': {
        float: 'left',
        marginRight: spacing(2),
      },

      '& .alignright': {
        float: 'right',
        marginLeft: spacing(2),
      },

      '& .aligncenter': {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
  }),
  { name: 'BlockImage' },
);

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BlockImage: React.FC<Props> = ({ children, className, style }) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, className)} style={style}>
      {children}
    </div>
  );
};

export default BlockImage;
