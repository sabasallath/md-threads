import React from 'react';

export interface EditDialogPropsOverride {
  destroyChildrenOnClose?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

interface DialogBaseType extends EditDialogPropsOverride {
  children?: React.ReactChild | React.ReactChild[];
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}

export default DialogBaseType;
