import { Avatar, CircularProgress, Tooltip } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLogin } from '../../../../../api/api';
import PersonIcon from '@material-ui/icons/Person';
import { RootState } from '../../../../../store/store';
import { uiActions } from '../../../../../store/features/ui/ui.slice';
import { userActions } from '../../../../../store/features/user/user.slice';
import UserUtil from '../../../../../utils/user.util';
import { useTranslate } from '../../../../../hooks/hooks';

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface IProps extends Props, WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      fontSize: theme.spacing(2),
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: theme.palette.secondary.main,
    },
  });

function Login(props: IProps) {
  const { classes, setUser, userName, setToken, setLoggingLoading } = props;
  const translate = useTranslate();
  const { data, isLoading } = useLogin(userName);

  const handleClickLogin = () => {
    setUser();
  };

  useEffect(() => {
    if (!isLoading) {
      setToken(data);
    }
    setLoggingLoading(isLoading);
  }, [setToken, isLoading, data, setLoggingLoading]);

  return (
    <ListItem button onClick={handleClickLogin}>
      <ListItemIcon>
        <Tooltip title={userName ? userName : ''}>
          <Avatar className={classes.avatar} color="primary">
            {!isLoading || !userName ? (
              userName ? (
                UserUtil.formatAvatar(userName)
              ) : (
                <PersonIcon />
              )
            ) : (
              <CircularProgress size={25} color="inherit" />
            )}
          </Avatar>
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={userName ? translate('Sign out') : translate('Sign in')} />
    </ListItem>
  );
}

const mapStateToProps = (state: RootState) => ({
  userName: state.user.userName,
  loggingLoading: state.user.loggingLoading,
});

const actionCreators = {
  setExpandedNavigationDrawer: uiActions.setExpandedNavigationDrawer,
  setUser: userActions.setUser,
  setToken: userActions.setToken,
  setLoggingLoading: userActions.setLoggingLoading,
};

const connector = connect(mapStateToProps, actionCreators);
export default connector(withStyles(styles)(Login));
