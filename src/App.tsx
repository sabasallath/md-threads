import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationDrawer from './components/common/NavigationDrawer/NavigationDrawer';
import Constant from './config/constant';
import { href } from './config/path';
import HomePage from './pages/Home.page';
import NotFoundPage from './pages/NotFound.page';
import { RootState } from './store/store';
import RightAppBar from './components/common/appBars/RightAppBar/RightAppBar';
import DemoPage from './pages/Demo.page';
import SearchBar from './components/common/appBars/RightAppBar/SearchBar';
import MarkdownEditorPage from './pages/MarkdownEditor.page';
import TopicPage from './pages/Topic.page';

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface IProps extends Props, WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    expandedNavigationDrawer: {
      marginLeft: -Constant.NAVIGATION_DRAWER_WIDTH,
    },
    reducedNavigationDrawer: {
      marginLeft: -Constant.NAVIGATION_DRAWER_REDUCED_WIDTH,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    toolbarReserveSpace: {
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
  });

function App(props: IProps) {
  const { classes, openedNavigationDrawer, expandedNavigationDrawer } = props;

  return (
    <div className={classes.root}>
      <Router basename={href()}>
        <NavigationDrawer />
        <main
          className={clsx(classes.content, {
            [classes.expandedNavigationDrawer]: expandedNavigationDrawer,
            [classes.reducedNavigationDrawer]: !expandedNavigationDrawer,
            [classes.contentShift]: openedNavigationDrawer,
          })}
        >
          <Switch>
            <Route exact path="/" component={() => <RightAppBar center>Welcome</RightAppBar>} />
            <Route exact path="/demo" component={() => <SearchBar />} />
            <Route exact path="/topic" component={() => <SearchBar />} />
            <Route component={RightAppBar} />
          </Switch>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/demo" component={DemoPage} />
            <Route exact path="/md-editor" component={MarkdownEditorPage} />
            <Route exact path="/topic" component={TopicPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  openedNavigationDrawer: state.ui.openedNavigationDrawer,
  expandedNavigationDrawer: state.ui.expandedNavigationDrawer,
});

const connector = connect(mapStateToProps);
export default connector(withStyles(styles)(App));
