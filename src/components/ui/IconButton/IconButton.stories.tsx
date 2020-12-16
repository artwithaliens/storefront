import { Meta, Story } from '@storybook/react';
import React from 'react';
import IconButton, { IconButtonProps } from './IconButton';

export default {
  title: 'IconButton',
  component: IconButton,
} as Meta<IconButtonProps>;

export const Base: Story<IconButtonProps> = (args) => <IconButton {...args} />;
