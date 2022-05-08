import React, { FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onCreateNewIntent: () => void;
};

const NewIntentDialog: FC<Props> = ({
  isOpen,
  onCancel,
  onCreateNewIntent,
}) => {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>インテントを作成してよろしいですか？</DialogTitle>
      <DialogContent>
        <DialogContentText>
          現在編集中のインテントは失われます。
          保存したい場合はダウンロードを行なってください。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button autoFocus onClick={onCreateNewIntent} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewIntentDialog;
