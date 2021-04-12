import React, { useState } from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import MarkdownNode from './MarkdownNode';
import { ThreadNodeType, ThreadType } from '../../types/thread.type';
import DialogBase from '../common/helpers/DialogBase';
import ReplyDialog from './ReplyDialog';
import { ThreadUtil } from '../../utils/thread.util';

interface IProps extends WithStyles<typeof styles> {
  thread: ThreadType;
}
const styles = (theme: Theme) => createStyles({});

function Topic({ thread }: IProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [node, setNode] = useState<ThreadNodeType>(ThreadUtil.emptyNode());

  const handleOnReplyClick = (node: ThreadNodeType) => {
    setNode(node);
    setOpen(true);
  };

  return (
    <div>
      <MarkdownNode level={0} {...thread.root} handleOnReplyClick={handleOnReplyClick} />
      <DialogBase fullWidth open={open} handleClose={handleClose} handleOpen={handleOpen}>
        <ReplyDialog node={node} />
      </DialogBase>
    </div>
  );
}

export default withStyles(styles)(Topic);
