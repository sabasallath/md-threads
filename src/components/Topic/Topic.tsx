import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import MarkdownNode from './MarkdownNode';
import { ThreadType } from '../../types/thread.type';

interface IProps extends WithStyles<typeof styles> {
  thread: ThreadType;
}
const styles = (theme: Theme) => createStyles({});

function Topic({ thread }: IProps) {
  return (
    <div>
      {thread.root.descendant.map((e) => (
        <MarkdownNode key={e.id} {...e} level={0} />
      ))}
    </div>
  );
}

export default withStyles(styles)(Topic);
