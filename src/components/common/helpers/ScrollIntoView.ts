import { PropsWithChildren, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const ScrollIntoView = (props: PropsWithChildren<any>) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return props?.children;
};

export default withRouter(ScrollIntoView);
