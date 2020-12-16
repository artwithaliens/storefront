import { Meta, Story } from '@storybook/react';
import React from 'react';
import Logo, { LogoProps } from './Logo';

export default {
  title: 'Logo',
  component: Logo,
} as Meta<LogoProps>;

export const Base: Story<LogoProps> = (args) => <Logo {...args} />;
