import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import MenuSVG from '../../assets/icons/menu.svg';

const Menu: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={MenuSVG} />;

export default Menu;
