import React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import withStyles from '@material-ui/core/styles/withStyles';
import BreadcrumbsPart from './BreadcrumbsPart';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { fade } from '@material-ui/core/styles/colorManipulator';

type Props = WithStyles<typeof styles> & {
  path: string[];
  handlePathPartClick: (index: number) => void;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(1),
      backgroundColor: fade(theme.palette.background.default, 0.75),
    },
  });

function BreadcrumbsContainer(props: Props) {
  const { path, classes, handlePathPartClick } = props;

  return (
    <div className={classes.root}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {path.map((pathPart, index) => (
          <BreadcrumbsPart
            key={index}
            pathPart={pathPart}
            index={index}
            isActive={index === path.length - 1}
            handlePathPartClick={handlePathPartClick}
          />
        ))}
      </Breadcrumbs>
    </div>
  );
}

export default withStyles(styles)(BreadcrumbsContainer);
