import React, { useMemo, useState } from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { AppBar, Divider, IconButton, InputBase, Paper, Toolbar } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import TodayIcon from '@material-ui/icons/Today';
import { connect, ConnectedProps } from 'react-redux';
import clsx from 'clsx';
import { RootState } from '../../../../store/store';
import Constant from '../../../../config/constant';
import { ThreadUtil } from '../../../../utils/thread.util';
import { ThreadNodeType } from '../../../../types/thread.type';
import { getYear, parseISO } from 'date-fns';
import { useScrollToNode } from '../../../../hooks/useScrollToNode';
import { useFlatMap } from '../../../../hooks/useFlatMap';

type Props = ConnectedProps<typeof connector> & WithStyles<typeof styles>;

export interface SearchItem {
  group: string;
  displayValue: string;
  value: string;
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
        top: Constant.APP_BAR_MUI_SM_BREAKPOINT_HEIGHT,
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
    searchIcon: {
      color: theme.palette.text.secondary,
    },
    settingsIcon: {
      color: theme.palette.action.disabled,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  });

function SearchBar(props: Props) {
  const { classes, searchBar, token, currentThread } = props;
  const flatMap = useFlatMap();
  const scrollToNode = useScrollToNode();

  const groupByIcon = {
    author: <PeopleIcon key={'author'} />,
    year: <TodayIcon key={'year'} />,
    none: <SettingsIcon className={classes.settingsIcon} key={'none'} />,
  };

  const groupByOptions = ['author', 'year', 'none'];
  const [groupBy, setGroupBy] = useState<string>('none');

  const options: SearchItem[] = useMemo(
    () =>
      flatMap
        ? ThreadUtil.sortByDate(
            Object.values(flatMap)
              .filter((e) => e.level !== 0)
              .map((flatNode) => ({ ...flatNode, descendant: [] } as ThreadNodeType))
          )
            .filter((e) => e.isPublic || token?.access_token)
            .map((e) => ({
              group:
                groupBy === 'author'
                  ? e.author
                  : groupBy === 'year'
                  ? getYear(parseISO(e.date)).toString(10)
                  : '',
              displayValue: e.title,
              value: e.id,
            }))
        : [],
    [flatMap, token?.access_token, groupBy]
  );

  const handleGroupByButtonClick = () => {
    const index = groupByOptions.findIndex((e) => e === groupBy);
    if (index >= 0) {
      setGroupBy(groupByOptions[(index + 1) % groupByOptions.length]);
    }
  };

  const searchBarSettings = () => (
    <>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        className={classes.iconButton}
        aria-label="settings"
        onClick={handleGroupByButtonClick}
      >
        {groupByIcon[groupBy]}
      </IconButton>
    </>
  );

  const handleOnChange = (event: React.ChangeEvent<unknown>, value: SearchItem | null) => {
    event.preventDefault();
    if (value) {
      scrollToNode(value.value);
    }
  };

  return (
    <AppBar className={clsx(classes.appBar, { [classes.hidden]: !searchBar })} position="sticky">
      <Toolbar className={classes.toolBar} variant="regular">
        <div className={classes.toolBarContent}>
          {options && (
            <Autocomplete
              key={currentThread + token.access_token} // reset value on rerender
              id="search"
              ListboxProps={{ style: { maxHeight: 400 } }}
              onChange={handleOnChange}
              onSubmit={(event) => event.preventDefault()}
              options={options.sort((a, b) => -b.group.localeCompare(a.group))}
              getOptionSelected={(option, value) => option.value === value.value}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.displayValue}
              style={{ width: '100%' }}
              renderInput={(params) => (
                <Paper
                  elevation={0}
                  ref={params.InputProps.ref}
                  component="form"
                  className={classes.searchRoot}
                >
                  <IconButton
                    color="secondary"
                    disabled={true}
                    aria-readonly="true"
                    className={classes.iconButton}
                    aria-label="menu"
                  >
                    <SearchIcon className={classes.searchIcon} />
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
  token: state.user.token,
  currentThread: state.thread.currentThread,
});

const connector = connect(mapStateToProps);
export default connector(withStyles(styles)(SearchBar));
