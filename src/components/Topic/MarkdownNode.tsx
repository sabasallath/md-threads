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
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import SmsIcon from '@material-ui/icons/Sms';
import RoomIcon from '@material-ui/icons/Room';

interface ThreadNodeTypeWithLevel extends ThreadNodeType {
  level: number;
  handleOnReplyClick: (node: ThreadNodeType) => void;
}
type IProps = ThreadNodeTypeWithLevel;

const useStyles = makeStyles<Theme, ThreadNodeTypeWithLevel>((theme) => ({
  root: {
    width: '100%',
    backgroundColor: (props) => fade(theme.palette.secondary.light, 0.02 * props.level),
    paddingLeft: `calc(${theme.spacing(2)}px)`,
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: (props) =>
      !props.isPublic ? theme.palette.secondary.dark : theme.palette.secondary.light,
  },
}));

const MarkdownNode: React.FunctionComponent<IProps> = (props: IProps) => {
  const classes = useStyles(props);
  const { title, descendant, date, isPublic, markdown, level, author, handleOnReplyClick } = props;
  const { t, ready } = useTranslation();
  const getTranslation = (k: string) => (ready ? t(k) : k);

  const formatAvatar = (author: string) => author.split(' ').map((e) => (e?.[0] ? e[0] : ''));

  function getTitle() {
    // level === 0 is root level
    const formattedTitle = !level ? `${getTranslation('Topic')} : ${title}` : title;
    return !isPublic ? `(${getTranslation('private')}) ${formattedTitle}` : formattedTitle;
  }

  return (
    <Box p={1}>
      <Card className={classes.root} elevation={level}>
        <CardHeader
          avatar={
            <Avatar aria-label="avatar" className={classes.avatar}>
              {!level ? <RoomIcon /> : formatAvatar(author)}
            </Avatar>
          }
          action={
            <Tooltip title={getTranslation('Reply')}>
              <IconButton
                color={!level ? 'secondary' : undefined}
                onClick={() => handleOnReplyClick({ ...props })}
                aria-label="reply"
              >
                <SmsIcon />
              </IconButton>
            </Tooltip>
          }
          title={<Typography variant={!level ? 'h5' : 'body1'}>{getTitle()}</Typography>}
          subheader={
            <>
              <Typography variant="body1">{author}</Typography>
              {DateUtil.formatDate(date)}
            </>
          }
        />
        <CardContent>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </CardContent>
        {descendant.map((e) => {
          return (
            <MarkdownNode
              handleOnReplyClick={handleOnReplyClick}
              level={level + 1}
              key={e.id}
              {...e}
            />
          );
        })}
      </Card>
    </Box>
  );
};

export default MarkdownNode;
