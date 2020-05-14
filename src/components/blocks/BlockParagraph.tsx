import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(
  {
    root: {
      '& img': {
        maxWidth: '100%',
        verticalAlign: 'middle',
      },
    },
  },
  { name: 'BlockParagraph' },
);

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BlockParagraph: React.FC<Props> = ({ children, className, style }) => {
  const styles = useStyles();

  return (
    <Typography
      className={clsx(styles.root, className)}
      align={
        className?.includes('has-text-align-center')
          ? 'center'
          : className?.includes('has-text-align-left')
          ? 'left'
          : className?.includes('has-text-align-right')
          ? 'right'
          : 'inherit'
      }
      style={style}
    >
      {children}
    </Typography>
  );
};

export default BlockParagraph;
