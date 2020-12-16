import { Box } from '@material-ui/core';
import React from 'react';

const Step: React.FC = ({ children }) => (children ? <Box sx={{ mt: 4 }}>{children}</Box> : null);

export default Step;
