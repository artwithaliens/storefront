import { Cart, Menu } from '@components/icons';
import { IconButton, Link, Logo } from '@components/ui';
import { AppBar, Badge, Box, Collapse, makeStyles, Toolbar } from '@material-ui/core';
import React from 'react';
import { useToggle } from 'react-use';
import { MenuLocationEnum, useCartQuery, useMenuQuery } from '../../../graphql';
import { useSettings } from '../context';
import HeaderMenu from './HeaderMenu';

const useStyles = makeStyles(
  ({ breakpoints }) => ({
    toolbar: {
      maxWidth: breakpoints.values.lg,
    },

    logo: {
      height: 40,
      width: 'auto',

      [breakpoints.up('md')]: {
        height: 64,
      },
    },
  }),
  { name: 'Header' },
);

const Header: React.VFC = () => {
  const styles = useStyles();
  const { settings } = useSettings();
  const [open, toggleOpen] = useToggle(false);

  const { data: menu } = useMenuQuery({
    variables: { location: MenuLocationEnum.PRIMARY_NAVIGATION },
  });

  const { data: { cart } = { cart: undefined } } = useCartQuery({
    fetchPolicy: 'no-cache',
    ssr: false,
  });

  return (
    <AppBar color="default" position="relative">
      <Toolbar
        className={styles.toolbar}
        sx={{
          minHeight: { xs: 60, md: 110 },
          mx: 'auto',
          width: '100%',
        }}
      >
        <Box sx={{ display: { md: 'none' }, flexGrow: 1 }}>
          <IconButton aria-label="Menu" onClick={toggleOpen}>
            <Menu />
          </IconButton>
        </Box>
        <Link href="/" underline="none">
          <Logo className={styles.logo} aria-label={settings.title} />
        </Link>
        <Box
          sx={{
            alignItems: 'center',
            alignSelf: 'stretch',
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'flex' }, height: '100%' }}>
            <HeaderMenu menu={menu} />
          </Box>
          <IconButton href="/cart" color="inherit" aria-label="Cart">
            <Badge badgeContent={cart?.contents?.itemCount}>
              <Cart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
      <Collapse unmountOnExit in={open} timeout="auto">
        <HeaderMenu menu={menu} />
      </Collapse>
    </AppBar>
  );
};

export default Header;
