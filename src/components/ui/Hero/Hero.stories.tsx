import { Meta, Story } from '@storybook/react';
import React from 'react';
import Hero from './Hero';

export default {
  title: 'Hero',
  component: Hero,
  argTypes: {
    fullHeight: { control: 'boolean' },
    title: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Base: Story = (args) => (
  <Hero
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
