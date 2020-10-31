import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { MenuQuery } from '../../graphql';
import relativeURL from '../../utils/relative-url';
import { Button } from '../ui';
import { AuthContext } from './auth-provider';

const useStyles = makeStyles(
  ({ breakpoints, palette, spacing }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'flex-end',
      listStyle: 'none',
      margin: 0,
      padding: 0,

      [breakpoints.up('md')]: {
        flexDirection: 'row',

        '& > li': {
          marginRight: spacing(2.5),
        },
      },
    },

    link: {
      height: '100%',
      justifyContent: 'flex-start',
      paddingLeft: spacing(3),
      paddingRight: spacing(3),
      width: '100%',

      [breakpoints.up('md')]: {
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid',
        borderBottomWidth: 2,
        justifyContent: 'center',
        width: 'auto',
      },

      '&[data-current="page"], &.current': {
        borderBottomColor: palette.primary.main,
      },
    },
  }),
  { name: 'HeaderMenu' },
);

type Props = {
  menu?: MenuQuery;
};

const HeaderMenu: React.VFC<Props> = ({ menu }) => {
  const router = useRouter();
  const styles = useStyles();
  const { authenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <ul className={styles.root}>
      {menu?.menuItems?.nodes?.map((menuItem) => (
        <li key={menuItem?.id}>
          <Button
            href={relativeURL(menuItem?.url ?? '/')}
            color="inherit"
            variant="text"
            className={styles.link}
            data-current={
              router.asPath === relativeURL(menuItem?.url ?? '/') ||
              (relativeURL(menuItem?.url ?? '/').startsWith('/shop') &&
                (router.asPath === '/shop' ||
                  router.asPath === '/cart' ||
                  router.asPath.startsWith('/checkout/') ||
                  router.asPath.startsWith('/product/') ||
                  router.asPath.startsWith('/product-category/') ||
                  router.asPath.startsWith('/product-tag/')))
                ? 'page'
                : undefined
            }
          >
            {menuItem?.label}
          </Button>
        </li>
      ))}
      {authenticated && (
        <li>
          <Button color="inherit" variant="text" className={styles.link} onClick={handleLogout}>
            Logout
          </Button>
        </li>
      )}
    </ul>
  );
};

export default HeaderMenu;
