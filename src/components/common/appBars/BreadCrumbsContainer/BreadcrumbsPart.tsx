import React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import SubjectIcon from '@material-ui/icons/Subject';
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

interface IProps extends WithStyles<typeof styles> {
  pathPart: string;
  isActive: boolean;
  index: number;
  handlePathPartClick: (index: number, pathPart: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    link: {
      display: 'flex',
      placeItems: 'center',
      textTransform: 'capitalize',
      cursor: 'pointer',
      color: 'inherit',
      flexWrap: 'nowrap',
    },
    icon: {
      marginRight: theme.spacing(0.5),
    },
  });

function BreadcrumbsPart(props: IProps) {
  const { classes, isActive, pathPart, index, handlePathPartClick } = props;
  const isRoot = index === 0;

  function handleClick(event: React.SyntheticEvent) {
    event.preventDefault();

    return handlePathPartClick(index, pathPart);
  }

  return (
    <Typography color={isActive ? 'textPrimary' : 'inherit'}>
      {isRoot ? (
        <Link component={RouterLink} className={classes.link} to={'/topics'}>
          <HomeIcon className={classes.icon} />
          <span>{pathPart}</span>
        </Link>
      ) : (
        <Link onClick={handleClick} className={classes.link}>
          <SubjectIcon className={classes.icon} />
          <span>{pathPart}</span>
        </Link>
      )}
    </Typography>
  );
}

export default withStyles(styles)(BreadcrumbsPart);
