import React, { FC } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onDeleteLink: () => void;
};

const DeleteLinkDialog: FC<Props> = ({ isOpen, onCancel, onDeleteLink }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>リンクを削除してよろしいですか？</DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button autoFocus onClick={onDeleteLink} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteLinkDialog;
