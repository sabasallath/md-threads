import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import FullHeight from '../components/common/helpers/FullHeight';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import { Typography } from '@material-ui/core';
type IProps = WithStyles<typeof styles>;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '1em',
    },
    message: {
      display: 'flex',
      flexDirection: 'column',
    },
    center: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    message404: {
      alignItems: 'center',
      paddingBottom: theme.spacing(5),
      fontWeight: theme.typography.fontWeightRegular,
    },
  });

function NotFoundPage(props: IProps) {
  const { classes } = props;
  const color = 'primary';
  const vpnLockIcon = <VpnLockIcon style={{ transform: 'scale(0.9)' }} fontSize={'inherit'} />;
  return (
    <FullHeight center={true} adjustCenterWithAppBar={true} scale={true}>
      <div className={classes.message}>
        <Typography
          color={color}
          variant="h1"
          className={classes.center + ' ' + classes.message404}
        >
          4{vpnLockIcon}4
        </Typography>
        <Typography color={color} variant={'h4'} className={classes.center}>
          Error: 404 page not found
        </Typography>
        <Typography color={color} variant={'body1'} className={classes.center}>
          Sorry, the page you&apos;re looking for cannot be accessed
        </Typography>
      </div>
    </FullHeight>
  );
}
export default withStyles(styles)(NotFoundPage);
