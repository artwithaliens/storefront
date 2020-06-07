/* eslint-disable import/no-extraneous-dependencies */
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const base = () => (
  <Button
    color={select('Color', ['inherit', 'primary', 'secondary', 'default'], 'primary')}
    disabled={boolean('Disabled', false)}
    loading={boolean('Loading', false)}
    size={select('Size', ['small', 'medium', 'large'], 'medium')}
    variant={select('Variant', ['text', 'outlined', 'contained'], 'outlined')}
  >
    {text('Button Label', 'Add to cart')}
  </Button>
);
