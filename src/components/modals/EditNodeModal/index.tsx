import React, { FC, MouseEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Intent, { Node, NodeType } from "models/intent";
import { useRecoilState, useSetRecoilState } from "recoil";
import { editNodeModalState, intentState } from "state";

type Props = {
  isOpen: boolean;
  node: Node;
};

type FormData = {
  name: string;
  type: string;
  mgmtAddr: string;
  loopback: string;
};

const EditNodeModal: FC<Props> = ({ isOpen, node }) => {
  const [intent, setIntent] = useRecoilState(intentState);
  const setEditNodeModal = useSetRecoilState(editNodeModalState);
  const [formData, setFormData] = useState<FormData>({
    name: node.name,
    type: node.type,
    mgmtAddr: node.mgmtAddr ?? "",
    loopback: node.loopback.IPv4 ?? "",
  });
  const onClickUpdateBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newIntent = new Intent(intent.id, intent.nodes, intent.links);
    const newNode = new Node(
      newIntent,
      formData.name,
      formData.type as NodeType,
      formData.mgmtAddr !== "" ? formData.mgmtAddr : undefined,
      { IPv4: formData.loopback !== "" ? formData.loopback : undefined }
    );
    newIntent.updateNode(newNode);
    setIntent(newIntent);
    setEditNodeModal({ isOpen: false, node: null });
    return;
  };
  const onClickCancelBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditNodeModal({ isOpen: false, node: null });
    return;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason && reason == "backdropClick") {
          setEditNodeModal({ isOpen: false, node: null });
          return;
        }
      }}
      fullWidth
    >
      <DialogTitle>Create Node</DialogTitle>
      <DialogContent dividers={true}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            type="text"
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="node-type-select-label">Type</InputLabel>
            <Select
              labelId="node-type-select-label"
              id="node-type-select"
              value={formData.type}
              label="Type"
              onChange={(e) => {
                setFormData({ ...formData, type: e.target.value as NodeType });
              }}
              defaultValue="Unknown"
            >
              <MenuItem value={"XRv"}>XRv</MenuItem>
              <MenuItem value={"vMX"}>vMX</MenuItem>
              <MenuItem value={"Unknown"}>Unknown</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-basic"
            label="Management Address"
            variant="outlined"
            value={formData.mgmtAddr}
            onChange={(e) => {
              setFormData({ ...formData, mgmtAddr: e.target.value });
            }}
            placeholder="10.254.0.100"
            required
          />
          <TextField
            id="outlined-basic"
            label="Loopback Address"
            variant="outlined"
            value={formData.loopback}
            onChange={(e) => {
              setFormData({ ...formData, loopback: e.target.value });
            }}
            placeholder="10.255.1.2/32"
            required
          />
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Button onClick={onClickUpdateBtn} variant="contained">
              Update
            </Button>
            <Button onClick={onClickCancelBtn}>Cancel</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditNodeModal;
