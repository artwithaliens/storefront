import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import useAcceptCookies from '../../../utils/hooks/useAcceptCookies';

const useStyles = makeStyles(
  ({ palette, spacing, typography }) => ({
    root: {
      alignItems: 'center',
      backgroundColor: palette.background.paper,
      display: 'flex',
      justifyContent: 'space-between',
      padding: spacing(2),
      position: 'fixed',
      width: '100%',
      zIndex: 3,
    },

    content: {
      ...typography.body1,
      marginRight: spacing(2),
    },

    buttonWrapper: {
      flexShrink: 0,
    },
  }),
  { name: 'CookieBanner' },
);

const CookieBanner: React.VFC = () => {
  const styles = useStyles();
  const { acceptedCookies, handleAcceptCookies } = useAcceptCookies();

  return !acceptedCookies ? (
    <CookieConsent
      disableStyles
      buttonText="I understand"
      buttonWrapperClasses={styles.buttonWrapper}
      containerClasses={styles.root}
      contentClasses={styles.content}
      cookieName="accept-cookies"
      ButtonComponent={Button}
      onAccept={handleAcceptCookies}
    >
      This website uses cookies to enhance the user experience. If you don’t like it, change
      website!
    </CookieConsent>
  ) : null;
};

export default CookieBanner;
