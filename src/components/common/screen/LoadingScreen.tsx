import React from 'react';
import { CircularProgress } from '@material-ui/core';
import FullHeight from '../helpers/FullHeight';

const LoadingScreen: React.FunctionComponent = () => {
  return (
    <FullHeight center adjustCenterWithAppBar scale>
      <CircularProgress color="primary" />
    </FullHeight>
  );
};

export default LoadingScreen;
