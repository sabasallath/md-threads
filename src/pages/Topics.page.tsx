import React from 'react';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box } from '@material-ui/core';
import Topic from '../components/Topic/Topic';
import RightDrawer from '../components/common/drawers/RightDrawer/RightDrawer';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store/store';
import { ThreadNodeType } from '../types/thread.type';
import { threadActions } from '../store/features/thread/thread.slice';
import BreadcrumbsContainer from '../components/common/app-bars/BreadCrumbsBar/BreadcrumbsContainer';
import clsx from 'clsx';
import Constant from '../config/constant';
import { useThreads } from '../api/api';
import LoadingScreen from '../components/common/screen/LoadingScreen';
import cloneDeep from 'lodash/cloneDeep';
import { ScrollSpyContext, ScrollSpyContextFactory } from '../store/contexts/ScrollSpy.context';
import { useTranslate } from '../hooks/useTranslate';
import HideOnScroll from '../components/common/helpers/HideOnScroll';

type Props = ConnectedProps<typeof connector> & WithStyles<typeof styles>;

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

function TopicsPage(props: Props) {
  const {
    classes,
    currentThread,
    setOpenThread,
    searchBar,
    token,
    orderByDate,
    loadingNode,
  } = props;
  const translate = useTranslate();
  const rootPath = translate('Topics');
  const { data, isLoading } = useThreads(currentThread, token);
  const breadCrumbDisplayPath: string[] =
    !currentThread || !data
      ? loadingNode
        ? [rootPath, loadingNode.title]
        : [rootPath]
      : [rootPath, data.nested.root.title];

  const handleOnOpenTopicClick = (node: ThreadNodeType) => {
    setOpenThread(node);
    window.scrollTo(0, 0);
  };

  const handlePathPartClick = (index: number) => {
    if (index || !currentThread) {
      window.scrollTo(0, 0);
    } else {
      setOpenThread();
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={classes.root}>
      <ScrollSpyContext.Provider value={ScrollSpyContextFactory.build()}>
        <Box p={4} flexGrow={1}>
          <div className={clsx(classes.contentTop, { [classes.contentTopSearchBar]: searchBar })}>
            <HideOnScroll>
              <BreadcrumbsContainer
                handlePathPartClick={handlePathPartClick}
                path={breadCrumbDisplayPath}
              />
            </HideOnScroll>
          </div>
          {isLoading || !data || !data.flatten ? (
            <LoadingScreen />
          ) : (
            <Topic
              handleOnOpenTopicClick={handleOnOpenTopicClick}
              key={data.nested.root.id}
              thread={!orderByDate ? data.nested : cloneDeep(data.flatten)}
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
  loadingNode: state.thread.loadingNode,
  token: state.user.token,
  orderByDate: state.ui.orderByDate,
});

const actionCreators = {
  setOpenThread: threadActions.setOpenThread,
};

const connector = connect(mapStateToProps, actionCreators);
export default connector(withStyles(styles)(TopicsPage));
