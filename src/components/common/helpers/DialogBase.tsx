import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import { DialogBaseContext } from '../../../store/contexts/DialogBase.context';
import clsx from 'clsx';
import DialogBaseType from '../../../types/dialogBase.type';
import { SlideProps } from '@material-ui/core/Slide/Slide';

type Props = WithStyles<typeof styles> & DialogBaseType;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<SlideProps> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = () =>
  createStyles({
    fullHeight: {
      minHeight: '90vh',
      maxHeight: '90vh',
    },
  });

function DialogBase(props: Props) {
  const {
    classes,
    open,
    handleClose,
    handleOpen,
    destroyChildrenOnClose,
    fullScreen,
    fullWidth,
    fullHeight,
  } = props;

  return (
    <Dialog
      onEscapeKeyDown={handleClose}
      maxWidth={false}
      open={open}
      keepMounted={destroyChildrenOnClose === undefined ? false : !destroyChildrenOnClose}
      fullScreen={fullScreen === undefined ? false : fullScreen}
      fullWidth={fullWidth === undefined ? false : fullWidth}
      classes={{
        paper: clsx({ [classes.fullHeight]: fullHeight === undefined ? false : fullHeight }),
      }}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogBaseContext.Provider
        value={{
          open: open,
          handleOpen: handleOpen,
          handleClose: handleClose,
        }}
      >
        {props.children}
      </DialogBaseContext.Provider>
    </Dialog>
  );
}

export default withStyles(styles)(DialogBase);
