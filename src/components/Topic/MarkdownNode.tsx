import { Theme } from '@material-ui/core/styles';
import React from 'react';
import { ThreadNodeType } from '../../types/thread.type';
import { DateUtil } from '../../utils/date.util';
import ReactMarkdown from 'react-markdown';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import SmsIcon from '@material-ui/icons/Sms';
import SubjectIcon from '@material-ui/icons/Subject';
import { useTopicContext } from '../../store/contexts/Topic.context';
import { RandomUtil } from '../../utils/random.util';
import clsx from 'clsx';
import { RootState } from '../../store/store';
import { connect, ConnectedProps } from 'react-redux';
import LockIcon from '@material-ui/icons/Lock';
import UserUtil from '../../utils/user.util';
import { useTranslate } from '../../hooks/hooks';

interface ThreadNodeTypeWithLevel extends ThreadNodeType {
  level: number;
  loading?: boolean;
}
type PropsFromRedux = ConnectedProps<typeof connector>;
interface IProps extends PropsFromRedux, ThreadNodeTypeWithLevel {}

const useStyles = makeStyles<Theme, ThreadNodeTypeWithLevel>((theme) => ({
  root: {
    width: '100%',
    backgroundColor: (props) => fade(theme.palette.secondary.light, 0.02 * props.level),
    paddingLeft: (props) => (!props.isAbstract ? `calc(${theme.spacing(2)}px)` : undefined),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: (props) =>
      !props.isPublic ? theme.palette.secondary.dark : theme.palette.secondary.light,
  },
  loadingBlur: {
    filter: 'blur(0.25rem)',
  },
  circularProgress: {
    width: '30px',
    height: '30px',
  },
}));

const MarkdownNodeToConnect: React.FunctionComponent<IProps> = (props: IProps) => {
  const classes = useStyles(props);
  const {
    title,
    descendant,
    date,
    isPublic,
    markdown,
    level,
    author,
    isAbstract,
    loading,
    user,
  } = props;
  const translate = useTranslate();
  const { handleOnReplyClick, handleOnOpenTopicClick } = useTopicContext();
  const replyOrOpenDisabled = !isPublic && !user.token.access_token && (!level || !isAbstract);

  const MarkdownNodeAvatar = (
    <Avatar aria-label="avatar" className={classes.avatar}>
      {isPublic ? (
        !level || isAbstract ? (
          <SubjectIcon />
        ) : (
          UserUtil.formatAvatar(author)
        )
      ) : (
        <LockIcon />
      )}
    </Avatar>
  );

  function handleOnClick() {
    if (loading || replyOrOpenDisabled) return;
    return !isAbstract ? handleOnReplyClick({ ...props }) : handleOnOpenTopicClick({ ...props });
  }

  function getToolTip() {
    return !isAbstract ? translate('Reply') : `${translate('Open')}`;
  }

  const MarkdownNodeAction = (
    <Tooltip title={getToolTip()}>
      {!replyOrOpenDisabled || loading ? (
        <IconButton
          color={!level || isAbstract ? 'secondary' : undefined}
          onClick={handleOnClick}
          aria-label="reply"
        >
          {loading ? (
            <CircularProgress size={20} color="secondary" />
          ) : !isAbstract ? (
            <SmsIcon />
          ) : (
            <SubjectIcon />
          )}
        </IconButton>
      ) : (
        <div />
      )}
    </Tooltip>
  );

  function getTitle() {
    // level === 0 is root level
    const formattedTitle = !level ? `${translate('Topic')} : ${title}` : title;
    return !isPublic ? `(${translate('private')}) ${formattedTitle}` : formattedTitle;
  }

  const MarkdownNodeTitle = <Typography variant={!level ? 'h5' : 'body1'}>{getTitle()}</Typography>;

  const MarkdownNodeSubHeader = (
    <>
      <Typography variant="body1">{author}</Typography>
      {DateUtil.formatDateForDisplay(date)}
    </>
  );

  return (
    <Box p={1}>
      <Card className={classes.root} elevation={level}>
        {!(isAbstract && !level) ? (
          <CardHeader
            avatar={MarkdownNodeAvatar}
            action={MarkdownNodeAction}
            title={MarkdownNodeTitle}
            subheader={MarkdownNodeSubHeader}
          />
        ) : undefined}

        <CardContent>
          <ReactMarkdown>{markdown}</ReactMarkdown>
          {loading && !level && (isPublic || user.token.access_token) ? (
            <ReactMarkdown className={classes.loadingBlur}>
              {RandomUtil.genMarkdown(1, 2)}
            </ReactMarkdown>
          ) : undefined}
        </CardContent>

        <div className={clsx({ [classes.loadingBlur]: loading && !level })}>
          {descendant.map((e) => {
            return (
              <MarkdownNode
                loading={loading !== undefined && loading}
                level={level + 1}
                key={e.id}
                {...e}
              />
            );
          })}
        </div>
      </Card>
    </Box>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

const connector = connect(mapStateToProps);
const MarkdownNode = connector(MarkdownNodeToConnect);
export default MarkdownNode;
