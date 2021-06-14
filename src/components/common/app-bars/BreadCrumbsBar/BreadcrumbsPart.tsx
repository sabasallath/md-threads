import React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import SubjectIcon from '@material-ui/icons/Subject';
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuBookIcon from '@material-ui/icons/MenuBook';

type Props = WithStyles<typeof styles> & {
  pathPart: string;
  isActive: boolean;
  index: number;
  handlePathPartClick: (index: number) => void;
};

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

function BreadcrumbsPart(props: Props) {
  const { classes, isActive, pathPart, index, handlePathPartClick } = props;
  const isRoot = index === 0;

  function handleClick(event: React.SyntheticEvent) {
    event.preventDefault();
    return handlePathPartClick(index);
  }

  return (
    <Typography color={isActive ? 'textPrimary' : 'inherit'}>
      <Link onClick={handleClick} className={classes.link}>
        {isRoot ? (
          <MenuBookIcon className={classes.icon} />
        ) : (
          <SubjectIcon className={classes.icon} />
        )}
        <span>{pathPart}</span>
      </Link>
    </Typography>
  );
}

export default withStyles(styles)(BreadcrumbsPart);
