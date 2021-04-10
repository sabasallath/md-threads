import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { connect, ConnectedProps } from 'react-redux';
import Constant from '../../../config/constant';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import withStyles from '@material-ui/core/styles/withStyles';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../store/store';
import SearchIcon from '@material-ui/icons/Search';
import { FormGroup, IconButton, Switch } from '@material-ui/core';
import { uiActions } from '../../../store/features/ui/ui.slice';

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface IProps extends Props, WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    drawer: {
      overflowX: 'hidden',
      zIndex: 30,
      width: Constant.RIGHT_DRAWER_WIDTH,
      maxWidth: Constant.RIGHT_DRAWER_WIDTH,
    },
    toolbar: theme.mixins.toolbar,
    drawerContainer: {
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
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
      width: Constant.RIGHT_DRAWER_REDUCED_WIDTH,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  });

function RightDrawer(props: IProps) {
  const { classes, expandedRightDrawer, setExpandedRightDrawer, setSearchBar, searchBar } = props;
  const { t, ready } = useTranslation();

  const [state, setState] = React.useState({
    search: searchBar,
  });

  const navigationItems = [{ name: 'Search bar', icon: <SearchIcon />, switchName: 'search' }];

  const handleChange = (name: string) => {
    if (name === 'search') {
      setSearchBar(!searchBar);
    }
    setState({ ...state, [name]: !state[name] });
  };

  const handleDrawerOpen = () => {
    setExpandedRightDrawer(!expandedRightDrawer);
  };

  const drawerClasses = {
    [classes.drawerFull]: expandedRightDrawer,
    [classes.drawerMini]: !expandedRightDrawer,
    [classes.drawerReduce]: !expandedRightDrawer,
  };

  return (
    <Drawer
      anchor="right"
      variant="permanent"
      className={clsx(classes.drawer, classes.drawerContainer, drawerClasses)}
      classes={{
        paper: clsx(classes.drawer, drawerClasses),
      }}
    >
      {searchBar ? <div className={classes.toolbar} /> : null}

      <div style={{ flexGrow: 1 }}>
        {expandedRightDrawer ? <span>Right drawer content</span> : ''}
      </div>
      {ready ? (
        <div className={classes.drawerContent}>
          <Divider />
          <FormGroup>
            <List dense style={{ flexGrow: 1 }}>
              {navigationItems.map((item) => (
                <ListItem key={item.name} style={{ flexGrow: 1, display: 'flex' }}>
                  <ListItemIcon>
                    <IconButton
                      color={state[item.switchName] ? 'secondary' : 'default'}
                      onClick={() => handleChange(item.switchName)}
                      size="small"
                    >
                      {item.icon}
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText primary={t(item.name)} />
                  <span>{state[item.name]}</span>
                  <Switch
                    size="small"
                    checked={state[item.switchName] || false}
                    onChange={() => handleChange(item.switchName)}
                  />
                </ListItem>
              ))}
            </List>
          </FormGroup>
          <Divider />
          <List>
            <ListItem button key={'openSettings-drawer'} onClick={handleDrawerOpen}>
              <ListItemIcon>
                {!expandedRightDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </ListItemIcon>
              <ListItemText primary={t('Reduce menu')} />
            </ListItem>
          </List>
        </div>
      ) : null}
    </Drawer>
  );
}

const mapStateToProps = (state: RootState) => ({
  expandedRightDrawer: state.ui.expandedRightDrawer,
  searchBar: state.ui.searchBar,
});

const actionCreators = {
  setExpandedRightDrawer: uiActions.setExpandedRightDrawer,
  setSearchBar: uiActions.setSearchBar,
};

const connector = connect(mapStateToProps, actionCreators);
export default connector(withStyles(styles)(RightDrawer));
