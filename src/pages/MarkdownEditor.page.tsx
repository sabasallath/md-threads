import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import MarkdownEditor from '../components/markdown/MarkdownEditor';

type IProps = WithStyles<typeof styles>;
const styles = () => createStyles({});

function MarkdownEditorPage(props: IProps) {
  return (
    <div>
      <MarkdownEditor />
    </div>
  );
}

export default withStyles(styles)(MarkdownEditorPage);
