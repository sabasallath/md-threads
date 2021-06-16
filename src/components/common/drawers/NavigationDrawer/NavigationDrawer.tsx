import { Collapse } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { ChevronLeft, ChevronRight, Home, Settings, Chat } from '@material-ui/icons';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Constant from '../../../../config/constant';
import { uiActions } from '../../../../store/features/ui/ui.slice';
import { RootState } from '../../../../store/store';
import LeftAppBar from '../../app-bars/LeftAppBar/LeftAppBar';
import { userActions } from '../../../../store/features/user/user.slice';
import Login from './Login/Login';
import { useTranslation } from 'react-i18next';
import { useTranslate } from '../../../../hooks/useTranslate';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import FlagIcon from './FlagIcon/FlagIcon';
import NotReadyFlagIcon from '@material-ui/icons/Flag';

type Props = ConnectedProps<typeof connector> & WithStyles<typeof styles>;

const styles = (theme: Theme) =>
  createStyles({
    drawer: {
      border: 'none',
      width: Constant.NAVIGATION_DRAWER_WIDTH,
      height: '100vh',
    },
    drawerContainer: {
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerClose: {
      transform: 'translateX(' + -Constant.NAVIGATION_DRAWER_WIDTH + 'px)',
    },
    // Used to slowdown the closing of mini drawer
    drawerCloseMini: {
      transform: 'translateX(' + -Constant.NAVIGATION_DRAWER_REDUCED_WIDTH + 'px)',
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    drawerOpen: {
      transform: 'none',
    },
    drawerContent: {
      overflow: 'auto',
      overflowX: 'hidden',
      height: '100vh',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    },
    drawerFull: {
      transitionProperty: 'transform, width',
      transitionTimingFunction: theme.transitions.easing.easeInOut,
      transitionDuration: theme.transitions.duration.enteringScreen + 'ms',
    },
    drawerReduce: {
      transitionProperty: 'transform, width',
      transitionTimingFunction: theme.transitions.easing.easeOut,
      transitionDuration: theme.transitions.duration.leavingScreen + 'ms',
    },
    drawerMini: {
      overflowX: 'hidden',
      width: Constant.NAVIGATION_DRAWER_REDUCED_WIDTH,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    flagIcon: {
      width: '30px',
      display: 'flex',
      fontSize: '1.2rem',
    },
  });

function NavigationDrawer(props: Props) {
  const {
    classes,
    expandedNavigationDrawer,
    setExpandedNavigationDrawer,
    openedNavigationDrawer,
    switchTheme,
  } = props;
  const { i18n, ready } = useTranslation();
  const translate = useTranslate();
  const { pathname } = useLocation();
  const [openSettings, setOpenSettings] = React.useState(false);

  const handleClickSettings = () => {
    if (!expandedNavigationDrawer) {
      setExpandedNavigationDrawer(true);
      setOpenSettings(true);
    } else {
      setOpenSettings(!openSettings);
    }
  };

  const handleClickChangeLanguage = () => {
    i18n.language === Constant.LOCAL_CODES[0]
      ? i18n.changeLanguage(Constant.LOCAL_CODES[1])
      : i18n.changeLanguage(Constant.LOCAL_CODES[0]);
  };

  const navigationItems = [
    { name: 'Home', icon: <Home />, to: '/' },
    { name: 'Topics', icon: <Chat />, to: '/topics' },
  ];

  const handleDrawerOpen = () => {
    setExpandedNavigationDrawer(!props.expandedNavigationDrawer);
  };

  const drawerClasses = {
    [classes.drawerFull]: expandedNavigationDrawer,
    [classes.drawerMini]: !expandedNavigationDrawer,
    [classes.drawerReduce]: !expandedNavigationDrawer && openedNavigationDrawer,
    [classes.drawerClose]: !openedNavigationDrawer && expandedNavigationDrawer,
    [classes.drawerCloseMini]: !openedNavigationDrawer && !expandedNavigationDrawer,
    [classes.drawerOpen]: openedNavigationDrawer,
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, classes.drawerContainer, drawerClasses)}
      classes={{
        paper: clsx(classes.drawer, drawerClasses),
      }}
    >
      <LeftAppBar />
      <div className={classes.drawerContent}>
        <List>
          {navigationItems.map((item) => (
            <ListItem
              selected={pathname === item.to}
              key={item.name}
              button
              component={Link}
              to={item.to}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={translate(item.name)} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <ListItem button onClick={handleClickSettings}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary={translate('Settings')} />
          {openSettings ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSettings && expandedNavigationDrawer} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested} onClick={() => handleClickChangeLanguage()}>
              <ListItemIcon>
                <div className={classes.flagIcon}>
                  {ready ? <FlagIcon code={i18n.language} /> : <NotReadyFlagIcon />}
                </div>
              </ListItemIcon>
              <ListItemText primary={translate(i18n.language)} />
            </ListItem>
            <ListItem className={classes.nested} button onClick={() => switchTheme()}>
              <ListItemIcon>
                <InvertColorsIcon />
              </ListItemIcon>
              <ListItemText primary={'switch theme'} />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
        <Login />
        <Divider />
        <List>
          <ListItem button key={'openSettings-drawer'} onClick={handleDrawerOpen}>
            <ListItemIcon>
              {!expandedNavigationDrawer ? <ChevronRight /> : <ChevronLeft />}
            </ListItemIcon>
            <ListItemText primary={translate('Reduce menu')} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

const mapStateToProps = (state: RootState) => ({
  openedNavigationDrawer: state.ui.openedNavigationDrawer,
  expandedNavigationDrawer: state.ui.expandedNavigationDrawer,
  userName: state.user.userName,
});

const actionCreators = {
  setExpandedNavigationDrawer: uiActions.setExpandedNavigationDrawer,
  switchTheme: uiActions.switchTheme,
  setUser: userActions.setUser,
};

const connector = connect(mapStateToProps, actionCreators);
export default connector(withStyles(styles)(NavigationDrawer));
