import { Meta, Story } from '@storybook/react';
import React from 'react';
import Button, { ButtonProps } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    children: { control: 'text' },
    color: { control: { type: 'select', options: ['inherit', 'primary', 'secondary'] } },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    variant: { control: { type: 'select', options: ['text', 'outlined', 'contained'] } },
  },
} as Meta<ButtonProps>;

export const Base: Story<ButtonProps> = (args) => <Button {...args} />;

Base.args = {
  children: 'Add to cart',
};
