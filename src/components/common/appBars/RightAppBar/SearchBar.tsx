import React, { useState } from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { AppBar, Divider, IconButton, InputBase, Paper, Toolbar } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { connect, ConnectedProps } from 'react-redux';
import clsx from 'clsx';
import { RootState } from '../../../../store/store';

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface IProps extends Props, WithStyles<typeof styles> {}

export interface SearchItem {
  group: string;
  fieldAndValue: string;
}

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.common.white,
    },
    hidden: {
      display: 'none',
    },
    toolBar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    toolBarContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexGrow: 1,
    },
    searchRoot: {
      height: theme.mixins.toolbar.minHeight,
      [theme.breakpoints.up('sm')]: {
        top: 64,
      },
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: 'unset',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  });

function SearchBar(props: IProps) {
  const { classes, searchBar } = props;
  const [searchExpand, setSearchExpand] = useState(false);
  const options: SearchItem[] = [];

  const handleClickSettings = () => {
    setSearchExpand(!searchExpand);
  };

  function searchBarSettings() {
    return (
      <>
        <IconButton disabled={true} className={classes.iconButton} aria-label="search">
          <VisibilityIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          disabled={true}
          className={classes.iconButton}
          aria-label="settings"
          onClick={handleClickSettings}
        >
          <SettingsIcon />
        </IconButton>
      </>
    );
  }

  const handleOnChange = () => {
    console.log('handleOnChange');
  };

  return (
    <AppBar className={clsx(classes.appBar, { [classes.hidden]: !searchBar })} position="sticky">
      <Toolbar className={classes.toolBar} variant="regular">
        <div className={classes.toolBarContent}>
          {options && (
            <Autocomplete
              id="grouped-demo"
              ListboxProps={{ style: { maxHeight: 400 } }}
              onChange={handleOnChange}
              options={options.sort((a, b) => -b.group.localeCompare(a.group))}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.fieldAndValue}
              style={{ width: '100%' }}
              renderInput={(params) => (
                <Paper
                  elevation={0}
                  ref={params.InputProps.ref}
                  component="form"
                  className={classes.searchRoot}
                >
                  <IconButton aria-readonly="true" className={classes.iconButton} aria-label="menu">
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    {...params.inputProps}
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                  {searchBarSettings()}
                </Paper>
              )}
            />
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = (state: RootState) => ({
  searchBar: state.ui.searchBar,
});

const connector = connect(mapStateToProps);

export default connector(withStyles(styles)(SearchBar));
