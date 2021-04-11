import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box } from '@material-ui/core';
import Topic from '../components/Topic/Topic';
import { RandomUtil } from '../utils/random.util';

type IProps = WithStyles<typeof styles>;
const styles = () => createStyles({});

function TopicPage(props: IProps) {
  const thread = RandomUtil.genThread(3, 3, 5, true);
  return (
    <Box p={4}>
      <Topic thread={thread} />
    </Box>
  );
}

export default withStyles(styles)(TopicPage);
