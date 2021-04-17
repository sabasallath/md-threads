import React, { useEffect } from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store/store';
import { uiActions } from '../../store/features/ui/ui.slice';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarCloseReason } from '@material-ui/core/Snackbar/Snackbar';

type PropsFromRedux = ConnectedProps<typeof connector>;
interface IProps extends PropsFromRedux, WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    alert: {
      display: 'flex',
      justifyContent: 'center',
      placeItems: 'center',
    },
    offButton: {
      marginLeft: theme.spacing(3),
    },
  });

function CouldNotSendReplyErrorDisplay({
  classes,
  couldNotSendReplyError,
  setCouldNotSendReplyError,
}: IProps) {
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  useEffect(() => {
    setOpen(!!couldNotSendReplyError);
    if (couldNotSendReplyError) {
      setErrorMessage(couldNotSendReplyError);
    }
  }, [couldNotSendReplyError]);

  const handleClose = (event: React.SyntheticEvent, reason: SnackbarCloseReason | 'button') => {
    if (reason !== 'clickaway') {
      setOpen(false);
      setCouldNotSendReplyError(null);
    }
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <div>
        <MuiAlert
          classes={{ root: classes.alert }}
          elevation={6}
          variant="standard"
          severity="error"
        >
          {errorMessage}
          <IconButton
            size="small"
            className={classes.offButton}
            color="inherit"
            onClick={(event) => handleClose(event, 'button')}
          >
            <CloseIcon />
          </IconButton>
        </MuiAlert>
      </div>
    </Snackbar>
  );
}

const mapStateToProps = (state: RootState) => ({
  couldNotSendReplyError: state.ui.couldNotSendReplyError,
});

const actionCreators = {
  setCouldNotSendReplyError: uiActions.setCouldNotSendReplyError,
};

const connector = connect(mapStateToProps, actionCreators);
export default connector(withStyles(styles)(CouldNotSendReplyErrorDisplay));
