import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Fade } from '@material-ui/core';
import FullHeight from '../components/common/helpers/FullHeight';
import Logo from '../components/common/brand/AppLogo';

type IProps = WithStyles<typeof styles>;
const styles = () => createStyles({});

function HomePage(props: IProps) {
  return (
    <Fade in {...{ timeout: 1200 }}>
      <FullHeight center={true} adjustCenterWithAppBar={true} scale={true}>
        <Logo animate />
      </FullHeight>
    </Fade>
  );
}

export default withStyles(styles)(HomePage);
