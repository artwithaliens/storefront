import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import PinSVG from '../../assets/icons/pin.svg';

const Pin: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={PinSVG} />;

export default Pin;
