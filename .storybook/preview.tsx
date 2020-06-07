import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { DecoratorFunction } from '@storybook/addons';
import { addDecorator, addParameters } from '@storybook/react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import Router from 'next/router';
import React, { useState } from 'react';
import theme from '../src/theme';

addParameters({
  layout: 'centered',
});

const MockedRouter: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/');

  const mockRouter: any = {
    route: pathname,
    pathname,
    query: {},
    asPath: pathname,
    prefetch: async () => {},
    push: async (newPathname: string) => {
      action('Navigated')(newPathname);
      setPathname(newPathname);
      return true;
    },
  };

  Router.router = mockRouter;

  return <RouterContext.Provider value={mockRouter}>{children}</RouterContext.Provider>;
};

const withMockedRouter: DecoratorFunction<React.ReactElement> = (storyFn) => (
  <MockedRouter>{storyFn()}</MockedRouter>
);

const withThemeProvider: DecoratorFunction<React.ReactElement> = (storyFn) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {storyFn()}
  </ThemeProvider>
);

addDecorator(withMockedRouter);
addDecorator(withThemeProvider);
