import {
  Divider,
  makeStyles,
  Step,
  StepButton,
  Stepper as MuiStepper,
  StepperProps as MuiStepperProps,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(
  ({ spacing }) => ({
    root: {
      backgroundColor: 'transparent',
      padding: spacing(0, 0, 3),
    },

    stepActive: {
      cursor: 'normal',
    },

    stepCompleted: {
      cursor: 'pointer',
    },

    stepIconContainer: {
      paddingRight: spacing(2),
    },
  }),
  { name: 'Stepper' },
);

export type StepperProps = Omit<MuiStepperProps, 'activeStep'> & {
  activeStep?: string;
  children: (events: {
    handleNext: () => void;
    handlePrevious: (step?: number) => () => void;
  }) => React.ReactChild[];
  onChangeStep?: (step: { path: string; title: string }) => void;
  steps: { path: string; title: string }[];
};

const Stepper: React.FC<StepperProps> = ({
  activeStep: initialActiveStep,
  children,
  onChangeStep,
  steps,
  ...props
}) => {
  const styles = useStyles();
  const [activeStep, setActiveStep] = useState(
    steps.findIndex((step) => step.path === initialActiveStep),
  );

  useEffect(() => {
    if (onChangeStep != null) {
      onChangeStep(steps[activeStep]);
    }
  }, [activeStep, onChangeStep, steps]);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrevious =
    (step = activeStep - 1) =>
    () => {
      if (step < activeStep && step >= 0) {
        setActiveStep(step);
      }
    };

  return (
    <>
      <MuiStepper
        alternativeLabel
        activeStep={activeStep}
        className={styles.root}
        orientation="horizontal"
        {...props}
      >
        {steps.map((step, i) => (
          <Step key={step.path}>
            <StepButton onClick={handleStep(i)}>{step.title}</StepButton>
          </Step>
        ))}
      </MuiStepper>
      <Divider />
      {children({ handleNext, handlePrevious })[activeStep]}
    </>
  );
};

export default Stepper;
