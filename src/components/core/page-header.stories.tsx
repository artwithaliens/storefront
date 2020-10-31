import { Meta, Story } from '@storybook/react';
import React from 'react';
import PageHeader from './page-header';

export default {
  title: 'PageHeader',
  component: PageHeader,
  argTypes: {
    fullHeight: { control: 'boolean' },
    title: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Base: Story = (args) => (
  <PageHeader
    {...args}
    image={{
      sourceUrl: '/home.png',
      srcSet: '/home@2x.png 2x',
    }}
  />
);

Base.args = {
  title: 'Contact',
};
