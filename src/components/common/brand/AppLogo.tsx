import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { getIsDarkTheme } from '../../../store/features/ui/ui.slice';

type Props = WithStyles<typeof styles> & {
  animate?: boolean;
  icon?: boolean;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '300px', // Firefox fix
      fill: theme.palette.primary.main,
      width: '100%',
      height: '100%',
    },
    icon: {
      width: 30,
      height: 30,
      fill: theme.palette.common.white,
    },
  });

const AppLogo = ({ classes, animate, icon }: Props) => {
  const isDarkTheme = useSelector(getIsDarkTheme);
  return (
    <svg
      className={clsx(classes.root, { [classes.icon]: icon })}
      version="1.1"
      viewBox="-10 -10 200 240"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="f" x="0" y="0" width="200%" height="200%">
          {!isDarkTheme ? (
            <feOffset result="offOut" in="SourceGraphic" dx="5" dy="10" />
          ) : undefined}
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="6" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          <feColorMatrix type="hueRotate" values="45">
            <animate
              attributeType="XML"
              attributeName="values"
              values="0;0;0;0;0;45;30;0;0;0;0;0;-45;-30;0;0;0;0"
              dur="14s"
              repeatCount="indefinite"
            />
          </feColorMatrix>
        </filter>
        <linearGradient
          id="lgrad"
          x1="36.345"
          x2="77.233"
          y2="113.58"
          gradientTransform="scale(.75719 1.3207)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7189bf" offset=".3" />
          <stop stopColor="#72d6c9" offset=".9" />
        </linearGradient>
        <linearGradient
          id="linearGradient55"
          x1="36.345"
          x2="77.233"
          y2="113.58"
          gradientTransform="scale(.75719 1.3207)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#lgrad"
        />
      </defs>
      <g filter={animate ? 'url(#f)' : undefined} transform="translate(44.127 25.058)">
        <polygon
          transform="rotate(120 71.923 174.47)"
          points="0 250 0 150 86 200"
          fill="#72d6c9"
          opacity=".7"
        />
        <g fill={!icon ? 'url(#linearGradient55)' : undefined}>
          <polygon transform="rotate(-60 42.085 124.9)" points="86 100 0 150 0 50 86 0" />
          <polygon transform="rotate(240 28.287 49.949)" points="0 150 0 50 86 0 86 100" />
        </g>
      </g>
    </svg>
  );
};

export default withStyles(styles)(AppLogo);
