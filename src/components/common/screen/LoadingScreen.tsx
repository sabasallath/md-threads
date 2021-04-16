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
  const { loadingNode, token } = props;
  const randomThread = RandomUtil.genThreads(1, 2, 1, 3, true).map((thread) => {
    if (loadingNode) {
      // todo better loading Thread generation
      if (!token.access_token) {
        thread = ThreadUtil.privatize(thread);
      }
      thread.root.title = loadingNode.title;
      thread.root.markdown = loadingNode.markdown;
      thread.root.isPublic = loadingNode.isPublic;
      thread.root.date = loadingNode.date;
      thread.root.author = loadingNode.author;
      thread.root.id = loadingNode.id;
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
  });

  if (loadingNode) {
    return <>{randomThread}</>;
  }

  return (
    <FullHeight center adjustCenterWithAppBar scale>
      <CircularProgress color="primary" />
    </FullHeight>
  );
}

const mapStateToProps = (state: RootState) => ({
  token: state.user.token,
});

const connector = connect(mapStateToProps);

export default connector(withStyles(styles)(LoadingScreen));
