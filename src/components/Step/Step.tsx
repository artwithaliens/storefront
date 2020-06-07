import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(
  ({ spacing }) => ({
    root: {
      marginTop: spacing(4),
    },
  }),
  { name: 'Step' },
);

const Step: React.FC = ({ children }) => {
  const styles = useStyles();

  return <div>{children && <div className={styles.root}>{children}</div>}</div>;
};

export default Step;
