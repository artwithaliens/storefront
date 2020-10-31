import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(
  ({ breakpoints, palette, spacing }) => ({
    root: {
      alignItems: 'center',
      backgroundColor: palette.common.black,
      backgroundSize: 'cover',
      display: 'flex',
      justifyContent: 'center',
      minHeight: 430,
      position: 'relative',

      '&.has-parallax': {
        backgroundAttachment: 'fixed',
      },

      '&.has-background-dim': {
        '&::before': {
          backgroundColor: 'inherit',
          bottom: 0,
          content: '""',
          left: 0,
          opacity: 0.5,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1,
        },

        '&-10::before': { opacity: 0.1 },
        '&-20::before': { opacity: 0.2 },
        '&-30::before': { opacity: 0.3 },
        '&-40::before': { opacity: 0.4 },
        '&-50::before': { opacity: 0.5 },
        '&-60::before': { opacity: 0.6 },
        '&-70::before': { opacity: 0.7 },
        '&-80::before': { opacity: 0.8 },
        '&-90::before': { opacity: 0.9 },
      },

      '&.alignleft, &.alignright': {
        maxWidth: breakpoints.values.lg,
        width: '100%',
      },

      '&.alignfull': {
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        width: '100vw',
      },

      '& .wp-block-cover__inner-container': {
        padding: spacing(0, 2),
        zIndex: 1,

        [breakpoints.up('sm')]: {
          padding: spacing(0, 3),
        },
      },
    },
  }),
  { name: 'BlockCover' },
);

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BlockCover: React.FC<Props> = ({ children, className, style }) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, className)} style={style}>
      {children}
    </div>
  );
};

export default BlockCover;
