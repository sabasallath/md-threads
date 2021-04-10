import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import React from 'react';
import { uiActions } from '../../../store/features/ui/ui.slice';
import { RootState } from '../../../store/store';
import AppLogo from './AppLogo';
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface IProps extends Props, WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    button: {
      marginRight: theme.spacing(2),
    },
  });

function AppButton(props: IProps) {
  const { classes, expandedNavigationDrawer, setExpandedNavigationDrawer } = props;

  return (
    <Tooltip title={expandedNavigationDrawer ? 'Shrink' : 'Expand'}>
      <IconButton
        className={classes.button}
        color="inherit"
        aria-label="menu"
        onClick={() => setExpandedNavigationDrawer(!expandedNavigationDrawer)}
      >
        <AppLogo icon />
      </IconButton>
    </Tooltip>
  );
}

const mapStateToProps = (state: RootState) => ({
  expandedNavigationDrawer: state.ui.expandedNavigationDrawer,
});

const actionCreators = {
  setExpandedNavigationDrawer: uiActions.setExpandedNavigationDrawer,
};

const connector = connect(mapStateToProps, actionCreators);

export default connector(withStyles(styles)(AppButton));
