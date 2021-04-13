import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box } from '@material-ui/core';
import Topic from '../components/Topic/Topic';
import { RandomUtil } from '../utils/random.util';
import RightDrawer from '../components/common/NavigationDrawer/RightDrawer';

type IProps = WithStyles<typeof styles>;
const styles = () =>
  createStyles({
    root: {
      display: 'flex',
    },
  });

function TopicPage(props: IProps) {
  const { classes } = props;
  const thread = RandomUtil.genThread(3, 3, 5, true);
  return (
    <div className={classes.root}>
      <Box p={4}>
        <Topic thread={thread} />
      </Box>
      <RightDrawer />
    </div>
  );
}

export default withStyles(styles)(TopicPage);
