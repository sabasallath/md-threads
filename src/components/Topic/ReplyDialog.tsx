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

interface IProps extends WithStyles<typeof styles> {
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

function ReplyDialog({ classes, node }: IProps) {
  const { handleClose } = useDialogBaseContext();
  const { title, date, isPublic, markdown, author } = node;
  const translate = useTranslate();

  const handleOnCancelClick = () => {
    handleClose();
  };

  const handleOnSendClick = (markdown: string) => {
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

export default withStyles(styles)(ReplyDialog);
