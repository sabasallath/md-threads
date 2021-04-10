import React from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import clsx from 'clsx';

interface IProps extends WithStyles<typeof styles> {
  children?: React.ReactChild | React.ReactChild[];
  center?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      overflowX: 'hidden',
    },
    toolBar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
    },
  });

function RightAppBar(props: IProps) {
  const { classes, children, center } = props;

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar className={clsx(classes.toolBar)}>
        <div className={clsx({ [classes.center]: center })}>{children ? children : null}</div>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(RightAppBar);
