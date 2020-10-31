import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import FacebookSVG from '../../assets/icons/facebook.svg';

const Facebook: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={FacebookSVG} />;

export default Facebook;
