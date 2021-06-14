import React from 'react';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import { useMediaQuery } from '@material-ui/core';
import Constant from '../../../config/constant';

type Props = WithStyles<typeof styles> & {
  children?: React.ReactChild | React.ReactChild[];
  center?: boolean;
  adjustCenterWithAppBar?: boolean;
  scale?: boolean;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
      [theme.breakpoints.up('sm')]: {
        height: `calc(100vh - ${Constant.APP_BAR_MUI_SM_BREAKPOINT_HEIGHT}px)`,
      },
    },
    center: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    adjustCenterWithAppBar: {
      transform: 'translateY(calc( -' + theme.mixins.toolbar.minHeight + 'px / 2))',
      [theme.breakpoints.up('sm')]: {
        transform: `translateY(calc( -${Constant.APP_BAR_MUI_SM_BREAKPOINT_HEIGHT}px / 2))`,
      },
    },
    scaleContentWithheightMedium: {
      transform: 'scale(0.66)',
    },
    scaleContentWithheightSmall: {
      transform: 'scale(0.33)',
    },
    scaleContentWithHeightAnimation: {
      transitionProperty: 'transform',
      transitionTimingFunction: theme.transitions.easing.easeInOut,
      transitionDuration: theme.transitions.duration.complex + 'ms',
    },
  });

function FullHeight(props: Props) {
  const { classes } = props;
  const isMatchMedium = useMediaQuery<Theme>(`(max-height:${600}px)`);
  const isMatchSmall = useMediaQuery<Theme>(`(max-height:${300}px)`);

  return (
    <div
      className={clsx(classes.root, {
        [classes.center]: props.center,
      })}
    >
      <div
        className={clsx({
          [classes.adjustCenterWithAppBar]: props.adjustCenterWithAppBar,
          [classes.scaleContentWithheightMedium]: props.scale && isMatchMedium,
          [classes.scaleContentWithheightSmall]: props.scale && isMatchSmall,
          [classes.scaleContentWithHeightAnimation]: props.scale,
        })}
      >
        {props.children}
      </div>
    </div>
  );
}

export default withStyles(styles)(FullHeight);
