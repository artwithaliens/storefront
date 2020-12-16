import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import CloseSVG from '../../assets/icons/close.svg';

const Close: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={CloseSVG} />;

export default Close;
