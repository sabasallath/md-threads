import React from 'react';
import { CircularProgress } from '@material-ui/core';
import FullHeight from '../helpers/FullHeight';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { RandomUtil } from '../../../utils/random.util';
import Topic from '../../Topic/Topic';
import { ThreadNodeType } from '../../../types/thread.type';
import { RootState } from '../../../store/store';
import { connect, ConnectedProps } from 'react-redux';
import { ThreadUtil } from '../../../utils/thread.util';

type PropsFromRedux = ConnectedProps<typeof connector>;
interface IProps extends PropsFromRedux, WithStyles<typeof styles> {
  loadingNode?: ThreadNodeType;
}

const styles = () => createStyles({});

function LoadingScreen(props: IProps) {
  const { loadingNode, token, orderByDate } = props;

  if (loadingNode) {
    let thread = RandomUtil.genThread(2, 3, 5, true, true);
    thread.root = {
      ...loadingNode,
      descendant: thread.root.descendant,
      isAbstract: thread.root.isAbstract,
    };

    if (!token.access_token) {
      thread = ThreadUtil.privatize(thread);
    }

    if (orderByDate) {
      thread = ThreadUtil.rebuildThreadFromFlatMap(thread, ThreadUtil.flattenAndGroupById(thread));
    }

    return (
      <Topic
        key={thread.root.id}
        handleOnOpenTopicClick={() => {
          return;
        }}
        thread={thread}
        loading={true}
      />
    );
  }

  return (
    <FullHeight center adjustCenterWithAppBar scale>
      <CircularProgress color="primary" />
    </FullHeight>
  );
}

const mapStateToProps = (state: RootState) => ({
  token: state.user.token,
  orderByDate: state.ui.orderByDate,
});

const connector = connect(mapStateToProps);

export default connector(withStyles(styles)(LoadingScreen));
