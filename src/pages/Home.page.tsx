import React from 'react';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Card, Fade } from '@material-ui/core';
import FullHeight from '../components/common/helpers/FullHeight';
import Logo from '../components/common/brand/AppLogo';
import Typography from '@material-ui/core/Typography';

type IProps = WithStyles<typeof styles>;

const styles = (theme: Theme) =>
  createStyles({
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    card: {
      marginTop: theme.spacing(6),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      padding: `${theme.spacing(1)}px ${theme.spacing(6)}px`,
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  });

function HomePage({ classes }: IProps) {
  return (
    <Fade in {...{ timeout: 1200 }}>
      <FullHeight center={true} adjustCenterWithAppBar={true} scale={true}>
        <div className={classes.content}>
          <Logo animate />
          <Card className={classes.card}>
            <Typography color="inherit" variant="button" display="block">
              md threads
            </Typography>
          </Card>
        </div>
      </FullHeight>
    </Fade>
  );
}

export default withStyles(styles)(HomePage);
