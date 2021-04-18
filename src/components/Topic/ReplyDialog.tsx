import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { ThreadNodeType } from '../../types/thread.type';
import { useDialogBaseContext } from '../../store/contexts/DialogBase.context';
import { DialogContent, DialogTitle, Grid } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import MarkdownEditor from '../markdown/MarkdownEditor';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { DateUtil } from '../../utils/date.util';
import { useTranslate } from '../../hooks/hooks';
import { useReply } from '../../api/api';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store/store';
import { useTopicContext } from '../../store/contexts/Topic.context';

type PropsFromRedux = ConnectedProps<typeof connector>;
interface IProps extends PropsFromRedux, WithStyles<typeof styles> {
  node: ThreadNodeType;
}
const styles = (theme: Theme) =>
  createStyles({
    previousMessage: {
      maxHeight: '160px',
      overflowY: 'auto',
    },
    date: {
      color: theme.palette.text.hint,
    },
  });

function ReplyDialog({ classes, node, flatMap, user, token }: IProps) {
  const { handleClose } = useDialogBaseContext();
  const { rootNodeId } = useTopicContext();
  const { title, date, isPublic, markdown, author } = node;
  const translate = useTranslate();
  const { mutate, isLoading } = useReply(node.id, rootNodeId, token);

  const handleOnCancelClick = () => {
    handleClose();
  };

  const handleOnSendClick = (markdown: string, isPublic: boolean) => {
    const fromRootPathToNodeExcluded = flatMap?.[node.id].fromRootPathToNodeIncluded;
    if (fromRootPathToNodeExcluded) {
      mutate({
        fromRootPathToNodeExcluded: fromRootPathToNodeExcluded,
        title: 'Re: ' + node.title,
        markdown: markdown,
        isPublic: isPublic,
        author: user?.userName ? user.userName : '',
      });
    }
    handleClose();
  };

  return (
    <>
      <DialogTitle>{`${translate('Reply to')} ${author}`}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="button">
              {!isPublic
                ? `${translate('Previous message')} : (${translate('private')}) ${title}`
                : `${translate('Previous message')} : ${title}`}
            </Typography>
            <Typography className={classes.date} variant="body2">
              {DateUtil.formatDateForDisplay(date)}
            </Typography>
            <div className={classes.previousMessage}>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <MarkdownEditor
              isLoading={isLoading}
              defaultValue={''}
              handleOnSendClick={handleOnSendClick}
              handleOnCancelClick={handleOnCancelClick}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  flatMap: state.thread.flatMap,
  token: state.user.token,
});

const connector = connect(mapStateToProps);

export default connector(withStyles(styles)(ReplyDialog));
