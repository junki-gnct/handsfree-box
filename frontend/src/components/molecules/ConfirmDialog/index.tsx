import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

interface ConfirmDialogProps {
  title: string;
  description?: string;
  state: boolean;
  cancel_handler(): void;
  cancel_text: string;
  positive_handler(): void;
  positive_text: string;
}

const ConfirmDialog: React.FunctionComponent<ConfirmDialogProps> = (
  props: ConfirmDialogProps,
) => {
  const dialogContent = props.description ? (
    <DialogContent>
      <DialogContentText>{props.description}</DialogContentText>
    </DialogContent>
  ) : (
    <></>
  );
  return (
    <Dialog
      open={props.state}
      onClose={props.cancel_handler}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      {dialogContent}
      <DialogActions>
        <Button onClick={props.cancel_handler} color="primary">
          {props.cancel_text}
        </Button>
        <Button onClick={props.positive_handler} color="primary">
          {props.positive_text}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
