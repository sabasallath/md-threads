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
  Switch,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import { SubjectUtil, SubObs } from '../../utils/subject.util';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ReactMarkdown from 'react-markdown';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Constant from '../../config/constant';
import clsx from 'clsx';
import { useTranslate } from '../../hooks/hooks';
import { RootState } from '../../store/store';
import { connect, ConnectedProps } from 'react-redux';

type Props = ConnectedProps<typeof connector> &
  WithStyles<typeof styles> & {
    defaultValue?: string;
    handleOnCancelClick: () => void;
    handleOnSendClick: (markdown: string, isPublic: boolean) => void;
    isLoading?: boolean;
  };

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
    buttonPadding: {
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
      justifyContent: 'space-between',
      marginTop: theme.spacing(1),
    },
    cardActionsZone: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      minWidth: '100px',
      minHeight: 42,
    },
    isDisabledIcon: {
      color: theme.palette.action.disabled,
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
      auditTime(Constant.MARKDOWN_EDITOR_AUDIT_TIME),
      distinctUntilChanged((prev, curr) => prev === curr)
    );
    const subs = [stream.subject?.subscribe(), auditedStream?.subscribe(setMarkdown)];

    setMarkdownStream({ subject: stream.subject, obs$: auditedStream });
    return () => subs.forEach((sub) => sub?.unsubscribe());
  }, [setMarkdown]);

  return markdownStream?.subject;
}

function MarkdownEditor(props: Props) {
  const { classes, defaultValue, handleOnCancelClick, handleOnSendClick, isLoading, token } = props;
  const [markdown, setMarkdown] = React.useState(defaultValue ? defaultValue : '');
  const [preview, setPreview] = React.useState(true);
  const [previewExited, setPreviewExited] = React.useState(true);
  const [edit, setEdit] = React.useState(true);
  const [editExited, setEditExited] = React.useState(true);
  const markdownStreamSubject = useAuditedMarkdownStream(setMarkdown);
  const [isPrivate, setIsPrivate] = React.useState(false);
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
    return () =>
      setTimeout(() => {
        if (!isLoading) {
          handleOnSendClick(markdown, !isPrivate);
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

  const handleIsPublicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
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
                  className={classes.buttonPadding}
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
                  className={classes.buttonPadding}
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
            <Grid item xs={12} md={previewExited ? 12 : 6}>
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
            <Grid className={classes.zonePreview} item xs={12} md={editExited ? 12 : 6}>
              <div className={clsx(classes.area, classes.previewArea)}>
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </Grid>
          </Fade>
        </Grid>
        <CardActions className={classes.cardActions}>
          <div className={classes.cardActionsZone}>
            <LockOpenIcon className={clsx({ [classes.isDisabledIcon]: isPrivate })} />
            <Tooltip
              title={!token?.access_token ? translate('Please log in to send private message') : ''}
            >
              <div>
                <Switch
                  disabled={!token.access_token}
                  checked={isPrivate}
                  color="primary"
                  onChange={handleIsPublicChange}
                  name="isPublic"
                  inputProps={{ 'aria-label': 'is public' }}
                />
              </div>
            </Tooltip>

            <LockIcon className={clsx({ [classes.isDisabledIcon]: !isPrivate })} />
          </div>
          <div className={classes.cardActionsZone}>
            <Button
              className={clsx(classes.button, classes.buttonPadding)}
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
              disabled={isLoading || !markdown}
              onClick={delayHandleOnSendClick()}
              variant="contained"
              color="primary"
              aria-label="send"
            >
              {!isLoading ? translate('Send') : <CircularProgress size={25} color="inherit" />}
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  token: state.user.token,
});
const connector = connect(mapStateToProps);
export default connector(withStyles(styles)(MarkdownEditor));
