import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import CountrySelect from './country-select';

export default {
  title: 'CountrySelect',
  component: CountrySelect,
  argTypes: {
    error: { control: 'boolean' },
    helperText: { control: 'text' },
    label: { control: 'text' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
} as Meta;

export const Base: Story = (args) => <CountrySelect {...args} onChange={action('onChange')} />;

Base.args = {
  label: 'Country',
  value: 'DE',
};
