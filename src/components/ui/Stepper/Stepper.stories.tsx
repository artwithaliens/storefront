import { Meta, Story } from '@storybook/react';
import React from 'react';
import Stepper, { StepperProps } from './Stepper';

export default {
  title: 'Stepper',
  component: Stepper,
} as Meta<StepperProps>;

export const Base: Story<StepperProps> = (args) => <Stepper {...args} />;
