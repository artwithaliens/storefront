import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import MinusSVG from '../../assets/icons/minus.svg';

const Minus: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={MinusSVG} />;

export default Minus;
