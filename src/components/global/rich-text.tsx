import { darken, fade, makeStyles } from '@material-ui/core';
import parse from 'html-react-parser';
import React from 'react';
import sentenceCase from '../../utils/sentence-case';

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

      '& table': {
        borderCollapse: 'collapse',
        marginBottom: spacing(2),

        '& th, & td': {
          ...typography.body2,
          borderBottom: `1px solid ${darken(fade(palette.divider, 1), 0.68)}`,
          padding: spacing(1),
          textAlign: 'left',
        },
      },

      '& .alignright': {
        float: 'right',
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
      {typeof children === 'string'
        ? parse(children.replace(/>([^<]*)</g, (_match, text: string) => `>${sentenceCase(text)}<`))
        : children}
    </div>
  );
};

export default RichText;
