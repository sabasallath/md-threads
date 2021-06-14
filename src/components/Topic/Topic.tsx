import React, { useState } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import MarkdownNode from './MarkdownNode';
import { ThreadNodeType, ThreadType } from '../../types/thread.type';
import DialogBase from '../common/helpers/DialogBase';
import ReplyDialog from './ReplyDialog';
import { ThreadUtil } from '../../utils/thread.util';
import { TopicContext } from '../../store/contexts/Topic.context';
import CouldNotSendReplyErrorDisplay from './CouldNotSendReplyErrorDisplay';

type Props = WithStyles<typeof styles> & {
  thread: ThreadType;
  handleOnOpenTopicClick: (node: ThreadNodeType) => void;
  loading?: boolean;
};

const styles = () => createStyles({});

function Topic({ thread, handleOnOpenTopicClick, loading }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [replyNode, setReplyNode] = useState<ThreadNodeType>(ThreadUtil.emptyNode());

  const handleOnReplyClick = (node: ThreadNodeType) => {
    setReplyNode(node);
    setOpen(true);
  };

  return (
    <div>
      <TopicContext.Provider
        value={{
          handleOnReplyClick,
          handleOnOpenTopicClick,
          rootNodeId: thread.root.id,
        }}
      >
        <MarkdownNode loading={loading !== undefined && loading} level={0} node={thread.root} />
        <DialogBase fullWidth open={open} handleClose={handleClose} handleOpen={handleOpen}>
          <ReplyDialog node={replyNode} />
        </DialogBase>
      </TopicContext.Provider>
      <CouldNotSendReplyErrorDisplay />
    </div>
  );
}

export default withStyles(styles)(Topic);
