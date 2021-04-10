import React from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AppButton from '../../brand/AppButton';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

type IProps = WithStyles<typeof styles>;

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      width: '100%',
      overflowX: 'hidden',
    },
    toolBar: {
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: '2px',
    },
    listItem: {
      padding: 0,
    },
  });

function LeftAppBar(props: IProps) {
  const { classes } = props;

  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar className={classes.toolBar} variant="regular">
        <ListItem className={classes.listItem}>
          <ListItemIcon>
            <AppButton />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="button">Md Threads</Typography>} />
        </ListItem>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(LeftAppBar);
