import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import theme from '../src/theme';

addons.setConfig({
  theme: create({
    base: theme.palette.mode,

    colorPrimary: theme.palette.common.white,
    colorSecondary: theme.palette.primary.main,

    appBg: '#060409',
    appContentBg: '#060409',
    appBorderColor: '#131215',

    textColor: '#aeaeae',

    barBg: '#131215',

    inputBg: '#060409',
    inputBorder: 'rgba(255, 255, 255, 0.23)',
    inputTextColor: '#aeaeae',
    inputBorderRadius: 0,

    brandTitle: 'Art With Aliens',
    brandImage: '/logo.svg',
  }),
});
