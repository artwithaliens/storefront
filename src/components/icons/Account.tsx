import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import AccountSVG from '../../assets/icons/account.svg';

const Account: React.VFC<SvgIconProps> = (props) => <SvgIcon {...props} component={AccountSVG} />;

export default Account;
