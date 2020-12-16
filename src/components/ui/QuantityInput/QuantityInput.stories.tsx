import { Meta, Story } from '@storybook/react';
import React from 'react';
import QuantityInput, { QuantityInputProps } from './QuantityInput';

export default {
  title: 'QuantityInput',
  component: QuantityInput,
} as Meta<QuantityInputProps>;

export const Base: Story<QuantityInputProps> = (args) => <QuantityInput {...args} />;
