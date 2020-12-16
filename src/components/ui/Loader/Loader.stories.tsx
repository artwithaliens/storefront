import { Meta, Story } from '@storybook/react';
import React from 'react';
import Loader, { LoaderProps } from './Loader';

export default {
  title: 'Loader',
  component: Loader,
  argTypes: {
    fullHeight: { control: 'boolean' },
  },
} as Meta<LoaderProps>;

export const Base: Story<LoaderProps> = (args) => <Loader {...args} />;
