import {
  AppBar,
  Button,
  Collapse,
  Hidden,
  IconButton,
  makeStyles,
  SvgIcon,
  Toolbar,
} from '@material-ui/core';
import React, { useState } from 'react';
import { MenuLocationEnum, useMenuQuery } from '../graphql';
import MenuSvg from '../icons/menu.svg';
import CartButton from './cart/CartButton';
import Link from './Link';
import Logo from './Logo';
import Menu from './Menu';

const useStyles = makeStyles(
  ({ breakpoints, palette }) => ({
    root: {
      position: 'relative',
    },

    toolbar: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: breakpoints.values.lg,
      minHeight: 60,
      width: '100%',

      [breakpoints.up('md')]: {
        minHeight: 110,
      },
    },

    toolbarLeft: {
      flexGrow: 1,
    },

    toolbarRight: {
      alignItems: 'center',
      alignSelf: 'stretch',
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'flex-end',
    },

    logo: {
      color: palette.common.white,

      '& > svg': {
        height: 44,
        width: 'auto',

        [breakpoints.up('md')]: {
          height: 62,
        },
      },
    },

    contact: {
      alignItems: 'center',
      display: 'flex',
      height: '100%',
      position: 'absolute',
      right: 24,
    },

    contactButton: {
      borderRadius: 54,
      display: 'none',
    },
  }),
  { name: 'Header' },
);

const Header: React.FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);

  const { data: menu } = useMenuQuery({
    variables: { location: MenuLocationEnum.PRIMARY_NAVIGATION },
  });

  return (
    <AppBar className={styles.root} color="default" position="static">
      <Toolbar className={styles.toolbar}>
        <Hidden mdUp>
          <div className={styles.toolbarLeft}>
            <IconButton aria-label="Menu" onClick={() => setOpen(!open)}>
              <SvgIcon component={MenuSvg} />
            </IconButton>
          </div>
        </Hidden>
        <Link className={styles.logo} href="/" underline="none">
          <Logo height={46} />
        </Link>
        <div className={styles.toolbarRight}>
          <Hidden smDown>
            <Menu menu={menu} />
          </Hidden>
          <CartButton />
        </div>
      </Toolbar>
      <div className={styles.contact}>
        <Button className={styles.contactButton} variant="contained" color="primary">
          Book an appointment
        </Button>
      </div>
      <Collapse unmountOnExit in={open} timeout="auto">
        <Menu menu={menu} />
      </Collapse>
    </AppBar>
  );
};

export default Header;
