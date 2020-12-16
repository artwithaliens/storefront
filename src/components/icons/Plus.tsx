import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import PlusSVG from '../../assets/icons/plus.svg';

const Plus: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={PlusSVG} />;

export default Plus;
