import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import Intent from "models/intent";
import React, { FC, MouseEvent, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { createNodeModalState, intentState } from "state";

type Props = {
  isOpen: boolean;
};

type FormData = {
  name: string;
};

const CreateNodeModal: FC<Props> = ({ isOpen }) => {
  const [intent, setIntent] = useRecoilState(intentState);
  const setCreateNodeModal = useSetRecoilState(createNodeModalState);
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const onClickCreateBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (intent.findNodeByName(formData.name)) {
      alert("その名前のノードは登録されています");
      return;
    }
    const newIntent = new Intent(intent.id, intent.nodes, intent.links);
    newIntent.addNode(formData.name);
    setIntent(newIntent);
    setCreateNodeModal({ isOpen: false });
    return;
  };
  const onClickCancelBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCreateNodeModal({ isOpen: false });
    return;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason && reason == "backdropClick") {
          setCreateNodeModal({ isOpen: false });
          return;
        }
      }}
    >
      <DialogTitle>Create Node Form</DialogTitle>
      <TextField
        id="outlined-basic"
        label="Node Name"
        variant="outlined"
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
        }}
        required
      />
      <Button onClick={onClickCreateBtn}>Create</Button>
      <Button onClick={onClickCancelBtn}>Cancel</Button>
    </Dialog>
  );
};

export default CreateNodeModal;
