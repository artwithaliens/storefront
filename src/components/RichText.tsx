import { makeStyles } from '@material-ui/core';
import parse from 'html-react-parser';
import React from 'react';
import sentenceCase from '../utils/sentenceCase';

const useStyles = makeStyles(
  ({ palette, spacing, typography }) => ({
    root: {
      '& h2, & h3, & h4, & h5, & p': {
        marginBottom: spacing(2),
        marginTop: 0,
      },

      '& h2': {
        ...typography.h2,
      },

      '& h3': {
        ...typography.h3,
      },

      '& h4': {
        ...typography.h4,
      },

      '& h5': {
        ...typography.h5,
      },

      '& p': {
        ...typography.body1,
      },

      '& a': {
        color: palette.common.white,
        textDecoration: 'none',

        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  }),
  { name: 'RichText' },
);

type Props = {
  children: React.ReactElement | string | null | undefined;
};

const RichText: React.FC<Props> = ({ children }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {typeof children === 'string' ? parse(sentenceCase(children)) : children}
    </div>
  );
};

export default RichText;
