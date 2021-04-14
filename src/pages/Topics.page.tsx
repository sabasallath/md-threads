import React, { useEffect } from 'react';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box, Slide, useScrollTrigger } from '@material-ui/core';
import Topic from '../components/Topic/Topic';
import RightDrawer from '../components/common/NavigationDrawer/RightDrawer';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store/store';
import { ThreadNodeType } from '../types/thread.type';
import { threadActions } from '../store/features/thread/thread.slice';
import BreadcrumbsContainer from '../components/common/appBars/BreadCrumbsContainer/BreadcrumbsContainer';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Constant from '../config/constant';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useThread, useThreads } from '../api/Api';
import LoadingScreen from '../components/common/screen/LoadingScreen';

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

function onAbstractPage(pathname: string) {
  return pathname.length === '/topics'.length;
}

function TopicsPage(props: IProps) {
  const { classes, currentThread, setOpenThread, searchBar } = props;
  const { t, ready } = useTranslation();
  const getTranslation = (k: string) => (ready ? t(k) : k);
  const rootPath = getTranslation('Topics');

  const match = useRouteMatch();
  const history = useHistory();
  const isOnAbstractPage = onAbstractPage(history.location.pathname);
  const threads = useThreads(isOnAbstractPage);
  const thread = useThread(currentThread, !isOnAbstractPage);

  const breadCrumbDisplayPath =
    !currentThread || isOnAbstractPage || !thread.data
      ? [rootPath]
      : [rootPath, thread.data.root.title];

  const refreshOnSubTopicPage = !threads.data && !isOnAbstractPage;

  useEffect(() => {
    if (refreshOnSubTopicPage) {
      history.push('/topics');
    }
  }, [history, refreshOnSubTopicPage]);

  const handleOnOpenTopicClick = (node: ThreadNodeType) => {
    setOpenThread(node.id);
    history.push('/topics/' + node.title.replaceAll(' ', '-'));
  };

  function handlePathPartClick(index: number, pathPart: string) {
    if (index) {
      window.scrollTo(0, 0);
    } else {
      setOpenThread(null);
    }
  }

  return (
    <div className={classes.root}>
      <Box p={4} flexGrow={1}>
        <div className={clsx(classes.contentTop, { [classes.contentTopSearchBar]: searchBar })}>
          <HideOnScroll>
            <BreadcrumbsContainer
              handlePathPartClick={handlePathPartClick}
              path={breadCrumbDisplayPath}
            />
          </HideOnScroll>
        </div>
        <Switch>
          <Route path={`${match.path}/:id`}>
            {thread.isLoading || !thread.data ? (
              <LoadingScreen />
            ) : (
              <Topic
                handleOnOpenTopicClick={handleOnOpenTopicClick}
                key={thread.data.root.id}
                thread={thread.data}
              />
            )}
          </Route>
          <Route path={match.path}>
            {threads.isLoading || !threads.data ? (
              <LoadingScreen />
            ) : (
              threads.data.map((thread) => (
                <Topic
                  handleOnOpenTopicClick={handleOnOpenTopicClick}
                  key={thread.root.id}
                  thread={thread}
                />
              ))
            )}
          </Route>
        </Switch>
      </Box>
      <RightDrawer />
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  searchBar: state.ui.searchBar,
  currentThread: state.thread.currentThread,
});

const actionCreators = {
  setOpenThread: threadActions.setOpenThread,
};

const connector = connect(mapStateToProps, actionCreators);

export default connector(withStyles(styles)(TopicsPage));
