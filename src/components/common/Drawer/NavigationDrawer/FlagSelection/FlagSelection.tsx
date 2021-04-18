import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import FlagIcon from './FlagIcon';
import { IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Constant from '../../../../../config/constant';

type IProps = WithStyles<typeof styles>;

const styles = () =>
  createStyles({
    flagButton: {
      fontSize: '1rem',
    },
  });

function FlagSelection(props: IProps) {
  const { classes } = props;
  const { i18n, ready } = useTranslation();

  const handleClick = () => {
    i18n.language === Constant.LOCAL_CODES[0]
      ? i18n.changeLanguage(Constant.LOCAL_CODES[1])
      : i18n.changeLanguage(Constant.LOCAL_CODES[0]);
  };

  return (
    <div>
      <IconButton className={classes.flagButton} onClick={handleClick}>
        {ready ? <FlagIcon code={i18n.language} /> : null}
      </IconButton>
    </div>
  );
}

export default withStyles(styles)(FlagSelection);
