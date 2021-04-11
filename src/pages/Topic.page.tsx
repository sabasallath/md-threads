import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box } from '@material-ui/core';
import Topic from '../components/Topic/Topic';

type IProps = WithStyles<typeof styles>;
const styles = () => createStyles({});

function TopicPage(props: IProps) {
  return (
    <Box p={4}>
      Topic Page
      <Topic />
    </Box>
  );
}

export default withStyles(styles)(TopicPage);
