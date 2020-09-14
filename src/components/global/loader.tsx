import { CircularProgress, makeStyles } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
}));

type Props = {
  full?: boolean;
};

const Loader: React.FC<Props> = ({ full }) => {
  const styles = useStyles();
  const node = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (process.browser && full && node.current != null) {
      setHeight(
        window.innerHeight -
          (document.querySelector('header')?.offsetHeight ?? 0) -
          (document.querySelector('footer')?.offsetHeight ?? 0),
      );
    }
  }, [full]);

  return (
    <div ref={node} className={styles.root} style={full ? { height } : {}}>
      <CircularProgress />
    </div>
  );
};

export default Loader;
