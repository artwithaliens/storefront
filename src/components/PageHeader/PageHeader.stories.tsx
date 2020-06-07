/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import PageHeader from './PageHeader';

export default {
  title: 'PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
  },
};

export const base = () => (
  <PageHeader
    fullHeight={boolean('Full Height', false)}
    image={{
      sourceUrl: '/home.png',
      srcSet: '/home@2x.png 2x',
    }}
    title={text('Title', 'Contact')}
  />
);
