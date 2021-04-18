import React, { useEffect, useState } from 'react';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box, Slide, useScrollTrigger } from '@material-ui/core';
import Topic from '../components/Topic/Topic';
import RightDrawer from '../components/common/Drawer/RightDrawer/RightDrawer';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store/store';
import { ThreadNodeType } from '../types/thread.type';
import { threadActions } from '../store/features/thread/thread.slice';
import BreadcrumbsContainer from '../components/common/appBars/BreadCrumbsContainer/BreadcrumbsContainer';
import clsx from 'clsx';
import Constant from '../config/constant';
import { useHistory } from 'react-router-dom';
import { useThreads } from '../api/api';
import LoadingScreen from '../components/common/screen/LoadingScreen';
import { useTranslate } from '../hooks/hooks';
import cloneDeep from 'lodash/cloneDeep';
import { ScrollSpyContext, NewPageContextFactory } from '../store/contexts/ScrollSpyContext';

interface HideOnScrollProps {
  children: React.ReactElement;
}

const HideOnScroll: React.FunctionComponent<HideOnScrollProps> = (props: HideOnScrollProps) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <div style={{ width: '100%' }}>{children}</div>
    </Slide>
  );
};

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface IProps extends Props, WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    contentTop: {
      zIndex: theme.zIndex.drawer - 1,
      top: 0,
      position: 'sticky',
    },
    contentTopSearchBar: {
      top: theme.mixins.toolbar.minHeight,
      [theme.breakpoints.up('sm')]: {
        top: Constant.APP_BAR_MUI_SM_BREAKPOINT_HEIGHT,
      },
    },
  });

function TopicsPage(props: IProps) {
  const {
    classes,
    currentThread,
    setOpenThread,
    setFlatMap,
    flattenThread,
    searchBar,
    token,
    orderByDate,
  } = props;
  const translate = useTranslate();
  const rootPath = translate('Topics');
  const history = useHistory();
  const { data, isLoading } = useThreads(currentThread, token);
  const [loadingNode, setLoadingNode] = useState<ThreadNodeType | undefined>(undefined);
  const breadCrumbDisplayPath =
    !currentThread || !data
      ? loadingNode
        ? [rootPath, loadingNode.title]
        : [rootPath]
      : [rootPath, data.root.title];

  useEffect(() => {
    const userRefreshOnSubtopicPage =
      data?.root.isAbstract && history.location.pathname !== '/topics';
    const subTopicOutOfSyncWithUrl =
      !data?.root.isAbstract && history.location.pathname === '/topics';

    if (userRefreshOnSubtopicPage) {
      // If user refresh page on subtopic we redirect to main topic page
      // since their is currently no way to retrieve the node id from url
      history.push('/topics');
    } else if (subTopicOutOfSyncWithUrl && data) {
      // If user open a subtopic
      // go to another page and come back to the subtopic page
      // url needs to be set in sync with current subtopic
      history.push('/topics/' + data.root.title.replaceAll(' ', '-'));
    }
  }, [history, data]);

  useEffect(() => {
    if (!isLoading && data) {
      setFlatMap(data);
    }
  }, [data, isLoading, setFlatMap]);

  const handleOnOpenTopicClick = (node: ThreadNodeType) => {
    history.push('/topics/' + node.title.replaceAll(' ', '-'));
    setLoadingNode(node);
    setOpenThread(node.id);
  };

  const handlePathPartClick = (index: number) => {
    if (index || !currentThread) {
      window.scrollTo(0, 0);
    } else {
      setLoadingNode(undefined);
      setOpenThread(null);
    }
  };

  return (
    <div className={classes.root}>
      <ScrollSpyContext.Provider value={NewPageContextFactory.build()}>
        <Box p={4} flexGrow={1}>
          <div className={clsx(classes.contentTop, { [classes.contentTopSearchBar]: searchBar })}>
            <HideOnScroll>
              <BreadcrumbsContainer
                handlePathPartClick={handlePathPartClick}
                path={breadCrumbDisplayPath}
              />
            </HideOnScroll>
          </div>
          {isLoading || !data || !flattenThread ? (
            <LoadingScreen loadingNode={loadingNode} />
          ) : (
            <Topic
              handleOnOpenTopicClick={handleOnOpenTopicClick}
              key={data.root.id}
              thread={!orderByDate ? data : cloneDeep(flattenThread)}
            />
          )}
        </Box>
        <RightDrawer />
      </ScrollSpyContext.Provider>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  searchBar: state.ui.searchBar,
  currentThread: state.thread.currentThread,
  flatMap: state.thread.flatMap,
  flattenThread: state.thread.flattenThread,
  userName: state.user.userName,
  token: state.user.token,
  orderByDate: state.ui.orderByDate,
});

const actionCreators = {
  setOpenThread: threadActions.setOpenThread,
  setFlatMap: threadActions.setFlatMap,
};

const connector = connect(mapStateToProps, actionCreators);

export default connector(withStyles(styles)(TopicsPage));
