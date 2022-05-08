import React, { FC } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onDeleteNode: () => void;
};

const DeleteNodeDialog: FC<Props> = ({ isOpen, onCancel, onDeleteNode }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>ノードを削除してよろしいですか？</DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button autoFocus onClick={onDeleteNode} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteNodeDialog;
