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
import PersonIcon from '@material-ui/icons/Person';
import { useTopicContext } from '../../store/contexts/Topic.context';
import { RandomUtil } from '../../utils/random.util';
import clsx from 'clsx';
import { RootState } from '../../store/store';
import { connect, ConnectedProps } from 'react-redux';
import LockIcon from '@material-ui/icons/Lock';
import UserUtil from '../../utils/user.util';
import { useTranslate } from '../../hooks/hooks';
import { ThreadUtil } from '../../utils/thread.util';

interface ThreadNodeTypeWithLevel {
  level: number;
  loading?: boolean;
  node: ThreadNodeType;
}
type PropsFromRedux = ConnectedProps<typeof connector>;
interface IProps extends PropsFromRedux, ThreadNodeTypeWithLevel {}

const useStyles = makeStyles<Theme, ThreadNodeTypeWithLevel>((theme) => ({
  root: {
    width: '100%',
    backgroundColor: (props) => fade(theme.palette.secondary.light, 0.02 * props.level),
    paddingLeft: (props) => (!props.node.isAbstract ? `calc(${theme.spacing(2)}px)` : undefined),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: (props) =>
      !props.node.isPublic ? theme.palette.secondary.dark : theme.palette.secondary.light,
  },
  loadingBlur: {
    filter: 'blur(0.25rem)',
  },
  circularProgress: {
    width: '30px',
    height: '30px',
  },
  buttonPlaceholder: {
    width: '54px',
    height: '54px',
  },
}));

const MarkdownNodeToConnect: React.FunctionComponent<IProps> = (props: IProps) => {
  const classes = useStyles(props);
  const { loading, user, level, node } = props;
  const { title, descendant, date, isPublic, markdown, author, isAbstract, isPlaceHolder } = node;
  const translate = useTranslate();
  const { handleOnReplyClick, handleOnOpenTopicClick } = useTopicContext();
  const replyOrOpenDisabled = !isPublic && !user.token.access_token && (!level || !isAbstract);

  const MarkdownNodeAvatar = (
    <Avatar aria-label="avatar" className={classes.avatar}>
      {isPublic || user.token.access_token ? (
        !level || isAbstract ? (
          <SubjectIcon />
        ) : author ? (
          UserUtil.formatAvatar(author)
        ) : (
          <PersonIcon />
        )
      ) : (
        <LockIcon />
      )}
    </Avatar>
  );

  function handleOnClick() {
    if (isPlaceHolder || loading || replyOrOpenDisabled) return;
    return !isAbstract ? handleOnReplyClick(node) : handleOnOpenTopicClick(node);
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
          {isPlaceHolder || loading ? (
            <CircularProgress size={20} color="secondary" />
          ) : !isAbstract ? (
            <SmsIcon />
          ) : (
            <SubjectIcon />
          )}
        </IconButton>
      ) : (
        <div className={classes.buttonPlaceholder} />
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
          {ThreadUtil.sortByDate(descendant).map((e) => {
            return (
              <MarkdownNode
                loading={loading !== undefined && loading}
                level={level + 1}
                key={e.id}
                node={e}
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
