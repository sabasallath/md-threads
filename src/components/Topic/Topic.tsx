import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';

type IProps = WithStyles<typeof styles>;
const styles = (theme: Theme) => createStyles({});

function SearchBar(props: IProps) {
  const { classes } = props;
  return <div>Topic Component</div>;
}

export default withStyles(styles)(SearchBar);
