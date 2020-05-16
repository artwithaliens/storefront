import { Typography } from '@material-ui/core';
import React from 'react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BlockParagraph: React.FC<Props> = ({ children, className, style }) => {
  return (
    <Typography
      gutterBottom
      className={className}
      variant={className?.includes('is-small-text') ? 'body2' : 'body1'}
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
