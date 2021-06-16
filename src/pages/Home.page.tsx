import React from 'react';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Card, Fade } from '@material-ui/core';
import FullHeight from '../components/common/helpers/FullHeight';
import AppLogo from '../components/common/brand/AppLogo';
import Typography from '@material-ui/core/Typography';
import { RootState } from '../store/store';
import { connect, ConnectedProps } from 'react-redux';

type Props = ConnectedProps<typeof connector> & WithStyles<typeof styles>;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.palette.background.default,
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

function HomePage({ classes, isDarkTheme }: Props) {
  return (
    <div className={classes.root}>
      <Fade in {...{ timeout: 1200 }}>
        <FullHeight center={true} adjustCenterWithAppBar={true} scale={true}>
          <div className={classes.content}>
            <AppLogo animate />
            <Card className={classes.card}>
              <Typography color="inherit" variant="button" display="block">
                md threads
              </Typography>
            </Card>
          </div>
        </FullHeight>
      </Fade>
    </div>
  );
}
const mapStateToProps = (state: RootState) => ({
  isDarkTheme: state.ui.isDarkTheme,
});

const connector = connect(mapStateToProps);
export default connector(withStyles(styles)(HomePage));
