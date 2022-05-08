import React, { FC, MouseEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import Intent, { Node as NodeIntent } from "models/intent";
import { useRecoilState, useResetRecoilState } from "recoil";
import { createInterfaceModalState, intentState } from "state";

type Props = {
  isOpen: boolean;
  node: NodeIntent;
};

type FormData = {
  name: string;
};

const CreateInterfaceModal: FC<Props> = ({ isOpen, node }) => {
  const [intent, setIntent] = useRecoilState(intentState);
  const resetCreateInterfaceModal = useResetRecoilState(
    createInterfaceModalState
  );
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const onClickCreateBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (node.findInterface(formData.name)) {
      alert("その名前のインタフェースは登録されています");
      return;
    }
    const newIntent = new Intent(intent.id, intent.nodes, intent.links);
    node.addInterface(formData.name);
    newIntent.updateNode(node);
    setIntent(newIntent);
    resetCreateInterfaceModal();
    return;
  };
  const onClickCancelBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    resetCreateInterfaceModal();
    return;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason && reason == "backdropClick") {
          resetCreateInterfaceModal();
          return;
        }
      }}
      fullWidth
    >
      <DialogTitle>Create Interface</DialogTitle>
      <DialogContent dividers={true}>
        <Stack spacing={2}>
          <TextField
            id="outlined-basic"
            label="Interface Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            required
          />
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Button onClick={onClickCreateBtn} variant="contained">
              Create
            </Button>
            <Button onClick={onClickCancelBtn}>Cancel</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInterfaceModal;
