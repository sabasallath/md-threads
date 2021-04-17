import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  Fade,
  Grid,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import { SubjectUtil, SubObs } from '../../utils/subject.util';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ReactMarkdown from 'react-markdown';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Constant from '../../config/constant';
import clsx from 'clsx';
import { useTranslate } from '../../hooks/hooks';

interface IProps extends WithStyles<typeof styles> {
  defaultValue?: string;
  handleOnCancelClick: () => void;
  handleOnSendClick: (markdown: string) => void;
  isLoading?: boolean;
}

const styles = (theme: Theme) => {
  const fadedColor = fade(theme.palette.secondary.light, 0.3);
  return createStyles({
    root: {
      width: '100%',
      '& *,*:focus,*:hover': {
        outline: 'none',
      },
    },
    appBar: {
      zIndex: theme.zIndex.appBar - 1,
    },
    appBarEdit: {
      backgroundColor: theme.palette.secondary.main,
    },
    appBarPreview: {
      backgroundColor: theme.palette.secondary.dark,
    },
    editorButton: {
      marginRight: theme.spacing(2),
    },
    zonePreview: {
      backgroundColor: fadedColor,
    },
    area: {
      maxHeight: `${Constant.MARKDOWN_EDITOR_MAX_HEIGHT}px`,
      minHeight: `${Constant.MARKDOWN_EDITOR_MIN_HEIGHT}px`,
    },
    textArea: {
      width: '100%',
      height: '100%',
      resize: 'none',
      borderColor: fadedColor,
      color: 'black',
      display: 'flex',
    },
    previewArea: {
      wordBreak: 'break-all',
      color: 'inherit',
      overflowY: 'auto',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(1),
    },
    button: {
      minWidth: '100px',
      minHeight: 42,
    },
  });
};

/**
 * Prevent triggering a rerender at every input change in the textarea,
 * Instead : trigger change at a maximum rate
 * See https://www.learnrxjs.io/learn-rxjs/operators/filtering/audittime
 * @param setMarkdown
 */
function useAuditedMarkdownStream(
  setMarkdown: (value: ((prevState: string) => string) | string) => void
): Subject<string> | undefined {
  const [markdownStream, setMarkdownStream] = React.useState<SubObs<string>>();

  useEffect(() => {
    const stream = SubjectUtil.subjectObs<string>();
    const auditedStream: Observable<string> = stream.obs$.pipe(
      auditTime(Constant.MARKDOWN_EDITOR_AUDIT_TIME * 2),
      distinctUntilChanged((prev, curr) => prev === curr)
    );
    const subs = [stream.subject?.subscribe(), auditedStream?.subscribe(setMarkdown)];

    setMarkdownStream({ subject: stream.subject, obs$: auditedStream });
    return () => subs.forEach((sub) => sub?.unsubscribe());
  }, [setMarkdown]);

  return markdownStream?.subject;
}

function MarkdownEditor(props: IProps) {
  const { classes, defaultValue, handleOnCancelClick, handleOnSendClick, isLoading } = props;
  const [markdown, setMarkdown] = React.useState(defaultValue ? defaultValue : '');
  const [preview, setPreview] = React.useState(true);
  const [previewExited, setPreviewExited] = React.useState(true);
  const [edit, setEdit] = React.useState(true);
  const [editExited, setEditExited] = React.useState(true);
  const markdownStreamSubject = useAuditedMarkdownStream(setMarkdown);
  const translate = useTranslate();

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    markdownStreamSubject?.next(event.target.value);
  };

  /**
   * Since we use an audited stream for markdown input
   * we delay the submit trigger by at least the audited duration.
   * (An alternative need to be set up if the delay is big enough)
   */
  function delayHandleOnSendClick() {
    // todo prevent second click
    return () =>
      setTimeout(() => {
        if (!isLoading) {
          handleOnSendClick(markdown);
        }
      }, Constant.MARKDOWN_EDITOR_AUDIT_TIME);
  }

  const handlePreviewButtonClick = () => {
    if (!preview) {
      setPreview(true);
    } else {
      setEdit(!edit);
    }
  };

  const handleEditButtonClick = () => {
    if (!edit) {
      setEdit(true);
    } else {
      setPreview(!preview);
    }
  };

  return (
    <div className={classes.root}>
      <Card elevation={0}>
        <Grid container alignItems={'stretch'}>
          <Grid item xs={6}>
            <AppBar
              className={clsx(classes.appBar, classes.appBarEdit)}
              variant="outlined"
              position="relative"
            >
              <Toolbar variant="dense">
                <IconButton
                  className={classes.editorButton}
                  onClick={handleEditButtonClick}
                  size="small"
                  color="inherit"
                >
                  {edit ? <SpeakerNotesIcon /> : <SpeakerNotesOffIcon />}
                </IconButton>
                <Typography variant="button">{translate('Edit')}</Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={6}>
            <AppBar
              className={clsx(classes.appBar, classes.appBarPreview)}
              variant="outlined"
              position="relative"
            >
              <Toolbar variant="dense">
                <IconButton
                  className={classes.editorButton}
                  onClick={handlePreviewButtonClick}
                  size="small"
                  color="inherit"
                >
                  {preview ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
                <Typography variant="button">{translate('Preview')}</Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Fade
            in={edit}
            timeout={Constant.MARKDOWN_EDITOR_FADE_ANIMATION_DURATION}
            onEnter={() => setEditExited(false)}
            onExited={() => setEditExited(true)}
            unmountOnExit
            mountOnEnter
          >
            <Grid item xs={previewExited ? 12 : 6}>
              <textarea
                className={clsx(classes.area, classes.textArea)}
                defaultValue={markdown}
                onChange={handleOnChange}
              />
            </Grid>
          </Fade>
          <Fade
            in={preview}
            timeout={Constant.MARKDOWN_EDITOR_FADE_ANIMATION_DURATION}
            onEnter={() => setPreviewExited(false)}
            onExited={() => setPreviewExited(true)}
            unmountOnExit
            mountOnEnter
          >
            <Grid className={classes.zonePreview} item xs={editExited ? 12 : 6}>
              <div className={clsx(classes.area, classes.previewArea)}>
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </Grid>
          </Fade>
        </Grid>
        <CardActions className={classes.cardActions}>
          <Button
            className={classes.button}
            disabled={isLoading}
            onClick={handleOnCancelClick}
            variant="outlined"
            color="primary"
            aria-label="cancel"
          >
            {translate('Cancel')}
          </Button>
          <Button
            className={classes.button}
            disabled={isLoading}
            onClick={delayHandleOnSendClick()}
            variant="contained"
            color="primary"
            aria-label="send"
          >
            {!isLoading ? translate('Send') : <CircularProgress size={25} color="inherit" />}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default withStyles(styles)(MarkdownEditor);
