import {
  AppBar,
  Collapse,
  Hidden,
  IconButton,
  makeStyles,
  SvgIcon,
  Toolbar,
} from '@material-ui/core';
import React, { useState } from 'react';
import MenuSvg from '../../assets/icons/menu.svg';
import { MenuLocationEnum, useMenuQuery } from '../../graphql';
import HeaderCartButton from './header-cart-button';
import HeaderLogo from './header-logo';
import HeaderMenu from './header-menu';
import Link from './link';

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
          <HeaderLogo height={46} />
        </Link>
        <div className={styles.toolbarRight}>
          <Hidden smDown>
            <HeaderMenu menu={menu} />
          </Hidden>
          <HeaderCartButton />
        </div>
      </Toolbar>
      <Collapse unmountOnExit in={open} timeout="auto">
        <HeaderMenu menu={menu} />
      </Collapse>
    </AppBar>
  );
};

export default Header;
