import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { DecoratorFunction } from '@storybook/addons';
import { addDecorator, addParameters } from '@storybook/react';
import React from 'react';
import { withNextRouter } from 'storybook-addon-next-router';
import theme from '../src/components/ui/theme';

addParameters({
  layout: 'centered',
});

const withThemeProvider: DecoratorFunction<React.ReactElement> = (storyFn) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {storyFn()}
  </ThemeProvider>
);

addDecorator(withNextRouter());
addDecorator(withThemeProvider);
