import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import GithubSVG from '../../assets/icons/github.svg';

const Github: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={GithubSVG} />;

export default Github;
