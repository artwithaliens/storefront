import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import HomeSVG from '../../assets/icons/home.svg';

const Home: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={HomeSVG} />;

export default Home;
