import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import DialogBase from '../components/common/helpers/DialogBase';
import { RandomUtil } from '../utils/random.util';
import { useDialogBaseContext } from '../store/contexts/DialogBase.context';
import RightDrawer from '../components/common/NavigationDrawer/RightDrawer';

const DialogDemoContent: React.FunctionComponent = () => {
  const { handleClose } = useDialogBaseContext();
  return (
    <>
      <DialogTitle>Dialog demo title</DialogTitle>
      <DialogContent>
        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              Dialog content
            </Grid>
            <Grid item xs={6}>
              Some other...
            </Grid>
            <Grid item xs={6}>
              ...content
            </Grid>
          </Grid>
        </Box>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Close Dialog
          </Button>
        </DialogActions>
      </DialogContent>
    </>
  );
};

const DialogDemo: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <DialogBase open={open} handleClose={handleClose} handleOpen={handleOpen}>
        <DialogDemoContent />
      </DialogBase>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Open dialog
      </Button>
    </div>
  );
};

type IProps = WithStyles<typeof styles>;
const styles = () =>
  createStyles({
    root: {
      display: 'flex',
    },
  });

function DemoPage(props: IProps) {
  const { classes } = props;

  const genParagraph = (p: number) => (
    <>
      {RandomUtil.lorem(p).map((e, index) => (
        <Grid item key={index}>
          {e}
        </Grid>
      ))}
    </>
  );

  return (
    <div className={classes.root}>
      <Box p={4}>
        <Grid container spacing={2} justify="center">
          {genParagraph(1)}
          <Grid item>
            <DialogDemo />
          </Grid>
          {genParagraph(10)}
        </Grid>
      </Box>
      <RightDrawer />
    </div>
  );
}

export default withStyles(styles)(DemoPage);
