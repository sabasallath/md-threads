import React, { createContext } from 'react';

export interface DialogBaseContextType {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}

export const DialogBaseContext = createContext<DialogBaseContextType>({
  open: false,
  handleClose: () => {
    return;
  },
  handleOpen: () => {
    return;
  },
});
export const useDialogBaseContext = (): DialogBaseContextType =>
  React.useContext(DialogBaseContext);
