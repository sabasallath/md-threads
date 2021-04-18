import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import MarkdownEditor from '../components/markdown/MarkdownEditor';
import { Box, Grid } from '@material-ui/core';
import { RandomUtil } from '../utils/random.util';

type IProps = WithStyles<typeof styles>;
const styles = () => createStyles({});

function MarkdownEditorPage(props: IProps) {
  const handleOnCancelClick = () => {
    console.log('handleOnCancelClick');
  };

  const handleOnSendClick = (markdown: string, isPublic: boolean) => {
    return;
  };

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MarkdownEditor
            defaultValue={RandomUtil.genMarkdown(1, 1)}
            handleOnCancelClick={handleOnCancelClick}
            handleOnSendClick={handleOnSendClick}
          />
        </Grid>
        <Grid item xs={12}>
          <MarkdownEditor
            defaultValue={RandomUtil.genMarkdown(5, 5)}
            handleOnCancelClick={handleOnCancelClick}
            handleOnSendClick={handleOnSendClick}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default withStyles(styles)(MarkdownEditorPage);
