import { Meta, Story } from '@storybook/react';
import React from 'react';
import Loader from './loader';

export default {
  title: 'Loader',
  component: Loader,
  argTypes: {
    fullHeight: { control: 'boolean' },
  },
} as Meta;

export const Base: Story = (args) => <Loader {...args} />;
