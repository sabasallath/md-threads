import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationDrawer from './components/common/Drawer/NavigationDrawer/NavigationDrawer';
import Constant from './config/constant';
import { href } from './config/path';
import HomePage from './pages/Home.page';
import NotFoundPage from './pages/NotFound.page';
import { RootState } from './store/store';
import RightAppBar from './components/common/appBars/RightAppBar/RightAppBar';
import SearchBar from './components/common/appBars/RightAppBar/SearchBar';
import TopicsPage from './pages/Topics.page';
import { useTranslate } from './hooks/hooks';

type Props = ConnectedProps<typeof connector> & WithStyles<typeof styles>;

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

function App(props: Props) {
  const { classes, openedNavigationDrawer, expandedNavigationDrawer, userName, token } = props;
  const translate = useTranslate();

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
            <Route
              exact
              path="/"
              component={() => (
                <RightAppBar center>
                  {translate('Welcome').concat(
                    userName && token?.access_token ? ` ${userName}` : ''
                  )}
                </RightAppBar>
              )}
            />
            <Route path="/topics" component={() => <SearchBar />} />
            <Route component={RightAppBar} />
          </Switch>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/topics" component={TopicsPage} />
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
  userName: state.user.userName,
  token: state.user.token,
});

const connector = connect(mapStateToProps);
export default connector(withStyles(styles)(App));
