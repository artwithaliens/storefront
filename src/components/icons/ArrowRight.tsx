import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import ArrowRightSVG from '../../assets/icons/arrow-right.svg';

const ArrowRight: React.VFC<SvgIconProps> = (props) => (
  <SvgIcon {...props} component={ArrowRightSVG} />
);

export default ArrowRight;
