import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { RootState } from '../../store/store';
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface IProps extends Props, WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
  });

function MarkdownEditor(props: IProps) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <ReactMarkdown># Hello, *world*! salut</ReactMarkdown>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({});
const actionCreators = {};
const connector = connect(mapStateToProps, actionCreators);

export default connector(withStyles(styles)(MarkdownEditor));
