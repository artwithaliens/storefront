import styled from '@emotion/styled';
import { AppBar, Collapse, Hidden, IconButton, SvgIcon, Theme, Toolbar } from '@material-ui/core';
import React, { useContext } from 'react';
import { useToggle } from 'react-use';
import MenuSvg from '../../assets/icons/menu.svg';
import { MenuLocationEnum, useMenuQuery } from '../../graphql';
import HeaderCartButton from './header-cart-button';
import HeaderLogo from './header-logo';
import HeaderMenu from './header-menu';
import Link from './link';
import { SettingsContext } from './settings-provider';

const HeaderRoot = styled(AppBar)({
  position: 'relative',
});

const HeaderToolbar = styled(Toolbar)<{}, Theme>(({ theme }) => ({
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: theme.breakpoints.values.lg,
  minHeight: 60,
  width: '100%',

  [theme.breakpoints.up('md')]: {
    minHeight: 110,
  },
}));

const HeaderToolbarLeft = styled('div')({
  flexGrow: 1,
});

const HeaderToolbarRight = styled('div')({
  alignItems: 'center',
  alignSelf: 'stretch',
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'flex-end',
});

const HeaderLogoLink = styled(Link)<{}, Theme>(({ theme }) => ({
  color: theme.palette.common.white,

  '& > svg': {
    height: 44,
    width: 'auto',

    [theme.breakpoints.up('md')]: {
      height: 62,
    },
  },
}));

const Header: React.VFC = () => {
  const settings = useContext(SettingsContext);
  const [open, toggleOpen] = useToggle(false);

  const { data: menu } = useMenuQuery({
    variables: { location: MenuLocationEnum.PRIMARY_NAVIGATION },
  });

  return (
    <HeaderRoot color="default" position="static">
      <HeaderToolbar>
        <Hidden mdUp>
          <HeaderToolbarLeft>
            <IconButton aria-label="Menu" onClick={toggleOpen}>
              <SvgIcon component={MenuSvg} />
            </IconButton>
          </HeaderToolbarLeft>
        </Hidden>
        <HeaderLogoLink href="/" underline="none">
          <HeaderLogo titleAccess={settings.title} />
        </HeaderLogoLink>
        <HeaderToolbarRight>
          <Hidden mdDown>
            <HeaderMenu menu={menu} />
          </Hidden>
          <HeaderCartButton />
        </HeaderToolbarRight>
      </HeaderToolbar>
      <Collapse unmountOnExit in={open} timeout="auto">
        <HeaderMenu menu={menu} />
      </Collapse>
    </HeaderRoot>
  );
};

export default Header;
