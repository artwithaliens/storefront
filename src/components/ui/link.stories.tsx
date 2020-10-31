import { Meta, Story } from '@storybook/react';
import React from 'react';
import Link from './link';

export default {
  title: 'Link',
  component: Link,
  argTypes: {
    children: { control: 'text' },
    underline: { control: { type: 'select', options: ['none', 'hover', 'always'] } },
  },
} as Meta;

export const Base: Story = (args) => <Link {...args} href="/" />;

Base.args = {
  children: 'Shipping Costs',
  underline: 'hover',
};
