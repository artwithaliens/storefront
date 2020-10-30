import { Box } from '@material-ui/core';
import React from 'react';

const Step: React.FC = ({ children }) => (
  <div>{children && <Box sx={{ mt: 4 }}>{children}</Box>}</div>
);

export default Step;
