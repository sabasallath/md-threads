import React, { useEffect } from 'react';
import { createStyles, fade, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { animated, useSpring } from 'react-spring';
import { TransitionProps } from '@material-ui/core/transitions';
import SubjectIcon from '@material-ui/icons/Subject';
import RemoveIcon from '@material-ui/icons/Remove';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { Typography } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import clsx from 'clsx';
import union from 'lodash/union';
import difference from 'lodash/difference';
import { useScrollSpy } from '../../../../../store/contexts/ScrollSpy.context';
import { RootState } from '../../../../../store/store';
import Constant from '../../../../../config/constant';
import { ThreadNodeType } from '../../../../../types/thread.type';
import { ThreadUtil } from '../../../../../utils/thread.util';
import cloneDeep from 'lodash/cloneDeep';
import SmsIcon from '@material-ui/icons/Sms';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslate } from '../../../../../hooks/useTranslate';
import { useScrollToNode } from '../../../../../hooks/useScrollToNode';
import { useThreadsWrapper } from '../../../../../hooks/useThreadsWrapper';
import { useFlatMap } from '../../../../../hooks/useFlatMap';
type Props = ConnectedProps<typeof connector>;

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  })
)((props: TreeItemProps) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: '100%',
      overflowX: 'hidden',
      paddingLeft: 7,
      marginLeft: 4,
    },
    // todo fix hardcoded value
    withSearchHeight: {
      maxHeight: 'calc(100vh - 176px - 64px)',
    },
    withoutSearchHeight: {
      maxHeight: 'calc(100vh - 176px)',
    },
    hidden: {
      visibility: 'hidden',
    },
    home: {
      display: 'flex',
      flexDirection: 'row',
    },
    homeGroup: {
      marginLeft: 7,
    },
    tree: {
      marginLeft: 4,
    },
    active: {
      backgroundColor: 'red',
      color: 'blue',
    },
    loadingTree: {
      marginLeft: 0,
      paddingLeft: 0,
    },
    loading: {
      display: 'block',
    },
  })
);

function CustomizedTreeView(props: Props) {
  const classes = useStyles();
  const { expandedRightDrawer, orderByDate, searchBar } = props;
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string>('');
  const { spy, auditedSpy$, pauseSpy$ } = useScrollSpy();
  const scrollToNode = useScrollToNode();
  const { data, isLoading, isError } = useThreadsWrapper();
  const isAbstract = data && data.nested?.root?.isAbstract;
  const translate = useTranslate();
  const flatMap = useFlatMap();

  const scrollTrigger = (nodeId: string | undefined) => {
    if (nodeId && flatMap?.[nodeId]?.fromRootPathToNodeIncluded) {
      setExpanded(flatMap[nodeId].fromRootPathToNodeIncluded);
      setSelected(nodeId);
    }
  };

  useEffect(() => {
    const subs = [
      spy.obs$.subscribe(),
      auditedSpy$.subscribe(scrollTrigger),
      pauseSpy$.subscribe(),
    ];
    return () => {
      subs.forEach((sub) => sub.unsubscribe());
    };
  });

  function turnPause(value: boolean, delay: number) {
    setTimeout(() => {
      pauseSpy$.next(value);
    }, delay);
  }

  function setPause(duration: number) {
    turnPause(true, 0); // stop
    turnPause(false, duration); // restart after duration
  }

  const onIconClick = (nodeId: string) => {
    if (expanded.includes(nodeId)) {
      setExpanded(difference(expanded, [nodeId]));
    } else if (flatMap) {
      setExpanded(union(expanded, flatMap[nodeId].fromRootPathToNodeIncluded));
    }
  };

  const onLabelClick = (nodeId: string) => {
    setPause(Constant.SCROLL_ANIMATION_PAUSE_DURATION);
    if (nodeId) {
      scrollToNode(nodeId);
      setSelected(nodeId);
      if (flatMap) {
        setExpanded(flatMap[nodeId].fromRootPathToNodeIncluded);
      }
    }
  };

  function genNode(node: ThreadNodeType) {
    return (
      <StyledTreeItem
        onIconClick={(event) => {
          event.stopPropagation();
          onIconClick(node.id);
        }}
        onLabelClick={(event) => {
          event.preventDefault();
          onLabelClick(node.id);
        }}
        key={node.id}
        nodeId={node.id}
        label={node.title ? node.title : `(${translate('private')})`}
      >
        {node.descendant &&
          ThreadUtil.sortByDate(node.descendant).map((node) => {
            return genNode(node);
          })}
      </StyledTreeItem>
    );
  }

  return (
    <TreeView
      className={clsx(classes.root, {
        [classes.hidden]: !expandedRightDrawer,
        [classes.withSearchHeight]: !!searchBar,
        [classes.withoutSearchHeight]: !searchBar,
      })}
      classes={{
        root: isLoading ? classes.loadingTree : undefined,
      }}
      expanded={expanded}
      selected={selected}
      defaultCollapseIcon={<RemoveIcon color="action" />}
      defaultExpandIcon={<SubjectIcon color="action" />}
      defaultEndIcon={isAbstract ? <SubjectIcon color="action" /> : <SmsIcon color="action" />}
      multiSelect={false}
    >
      {!isLoading && !isError && data ? (
        <>
          <div className={classes.home}>
            {isAbstract ? <MenuBookIcon color="action" /> : <SubjectIcon color="action" />}
            <Typography className={classes.homeGroup}>
              {isAbstract ? translate('Topics') : data.nested?.root.title}
            </Typography>
          </div>
          <div className={classes.tree}>
            {orderByDate && data.flatten
              ? ThreadUtil.sortByDate(cloneDeep(data.flatten.root.descendant)).map(genNode)
              : data && ThreadUtil.sortByDate(data.nested.root.descendant).map(genNode)}
          </div>
        </>
      ) : (
        <LinearProgress className={classes.loading} color="primary" />
      )}
    </TreeView>
  );
}

const mapStateToProps = (state: RootState) => ({
  expandedRightDrawer: state.ui.expandedRightDrawer,
  searchBar: state.ui.searchBar,
  orderByDate: state.ui.orderByDate,
});

const connector = connect(mapStateToProps);
export default connector(CustomizedTreeView);
