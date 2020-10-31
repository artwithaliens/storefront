import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import InstagramSVG from '../../assets/icons/instagram.svg';

const Instagram: React.VFC<SvgIconProps> = (props) => (
  <SvgIcon {...props} component={InstagramSVG} />
);

export default Instagram;
