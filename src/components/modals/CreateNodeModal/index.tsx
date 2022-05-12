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
import { NodeType } from "models/intent";
import { useSetRecoilState } from "recoil";
import { createNodeModalState } from "state";
import useIntent from "hooks/useIntent";

type Props = {
  isOpen: boolean;
};

type FormData = {
  name: string;
  type: string;
  mgmtAddr: string;
  loopback: string;
};

const initFormData: FormData = {
  name: "",
  type: "Unknown",
  mgmtAddr: "",
  loopback: "",
};

const CreateNodeModal: FC<Props> = ({ isOpen }) => {
  const { intent, addNode } = useIntent();
  const setCreateNodeModal = useSetRecoilState(createNodeModalState);
  const [formData, setFormData] = useState<FormData>(initFormData);
  const onClickCreateBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (intent.findNodeByName(formData.name)) {
      alert("その名前のノードは登録されています");
      return;
    }
    addNode(
      formData.name,
      formData.type as NodeType,
      formData.mgmtAddr !== "" ? formData.mgmtAddr : undefined,
      {
        IPv4: formData.loopback !== "" ? formData.loopback : undefined,
      }
    );
    setCreateNodeModal({ isOpen: false });
    setFormData(initFormData);
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

export default CreateNodeModal;
