import { Close } from '@components/icons';
import { IconButton } from '@components/ui';
import {
  Dialog as MuiDialog,
  DialogContent,
  DialogProps as MuiDialogProps,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';
import { useUI } from '../context';

export type DialogProps = MuiDialogProps;

const Dialog: React.FC<DialogProps> = ({ children, ...props }) => {
  const { closeModal } = useUI();

  return (
    <MuiDialog {...props}>
      <DialogTitle disableTypography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </MuiDialog>
  );
};

export default Dialog;
