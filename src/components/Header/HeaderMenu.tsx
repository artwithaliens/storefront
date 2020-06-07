import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { MenuQuery } from '../../graphql';
import prefetchURL from '../../utils/prefetchURL';
import relativeURL from '../../utils/relativeURL';
import { AuthContext } from '../AuthProvider';
import Button from '../Button';

const useStyles = makeStyles(
  ({ breakpoints, palette }) => ({
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
          marginRight: 20,
        },
      },
    },

    link: {
      color: palette.common.white,
      fontSize: 18,
      height: '100%',
      justifyContent: 'flex-start',
      paddingLeft: 28,
      paddingRight: 28,
      width: '100%',

      [breakpoints.up('md')]: {
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid',
        borderBottomWidth: 2,
        justifyContent: 'center',
        paddingLeft: 24,
        paddingRight: 24,
        width: 'auto',
      },

      '&:hover': {
        color: palette.common.white,
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

const HeaderMenu: React.FC<Props> = ({ menu }) => {
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
            href={prefetchURL(menuItem?.url ?? '/')}
            as={relativeURL(menuItem?.url ?? '/')}
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
          <Button variant="text" className={styles.link} onClick={handleLogout}>
            Logout
          </Button>
        </li>
      )}
    </ul>
  );
};

export default HeaderMenu;
