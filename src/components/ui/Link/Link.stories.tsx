import { Meta, Story } from '@storybook/react';
import React from 'react';
import Link, { LinkProps } from './Link';

export default {
  title: 'Link',
  component: Link,
  argTypes: {
    children: { control: 'text' },
    underline: { control: { type: 'select', options: ['none', 'hover', 'always'] } },
  },
} as Meta<LinkProps>;

export const Base: Story<LinkProps> = (args) => <Link {...args} href="/" />;

Base.args = {
  children: 'Shipping Costs',
  underline: 'hover',
};
