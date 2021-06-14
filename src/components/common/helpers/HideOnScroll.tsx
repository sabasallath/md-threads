import React from 'react';
import { Slide, useScrollTrigger } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = WithStyles<typeof styles> & {
  children?: React.ReactChild | React.ReactChild[];
};

const styles = () =>
  createStyles({
    children: {
      width: '100%',
    },
  });

function HideOnScroll(props: Props) {
  const { classes, children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <div className={classes.children}>{children}</div>
    </Slide>
  );
}

export default withStyles(styles)(HideOnScroll);
