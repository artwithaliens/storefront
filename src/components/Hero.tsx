import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    alignItems: 'center',
    backgroundImage:
      'url(https://i1.wp.com/artwithaliens.com/app/uploads/2019/01/IMG_20190111_133742-01.jpeg?zoom=2&fit=1500%2C2000&ssl=1)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    display: 'flex',
    height: 320,
    justifyContent: 'center',
    marginBottom: 48,
    position: 'relative',

    '&::after': {
      backgroundImage: `radial-gradient(transparent, ${palette.common.black}), linear-gradient(to right, ${palette.common.black}, transparent 20%, transparent 80%, ${palette.common.black})`,
      bottom: 0,
      content: '""',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  },

  innerContainer: {
    maxWidth: 'calc(6 * (100vw / 12))',
    paddingTop: 16,
    textAlign: 'center',
    width: 'calc(6 * (100vw / 12))',

    '& h1': {
      fontSize: 50,
      marginBottom: 16,
    },
  },
}));

const Hero: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <Typography variant="h1">Welcome</Typography>
      </div>
    </div>
  );
};

export default Hero;
