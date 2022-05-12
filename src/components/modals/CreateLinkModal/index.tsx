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
} from "@mui/material";
import { Node as NodeIntent } from "models/intent";

import { useResetRecoilState } from "recoil";
import { createLinkState } from "state";
import useIntent from "hooks/useIntent";
type Props = {
  isOpen: boolean;
  fromNode: NodeIntent;
  toNode: NodeIntent;
};

const CreateLinkModal: FC<Props> = ({ isOpen, fromNode, toNode }) => {
  const { addLink } = useIntent();
  const [fromInterfaceName, setFromInterfaceName] = useState("");
  const [toInterfaceName, setToInterfaceName] = useState("");
  const resetCreateLink = useResetRecoilState(createLinkState);
  const onClickCancelBtn = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    resetCreateLink();
    return;
  };
  const onSubmitHandler = () => {
    const fromInterface = fromNode.findInterface(fromInterfaceName);
    const toInterface = toNode.findInterface(toInterfaceName);
    if (fromInterface && toInterface) {
      addLink(fromInterface, toInterface);
      resetCreateLink();
    } else {
      alert("インタフェースを指定してください");
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason && reason == "backdropClick") {
          resetCreateLink();
          return;
        }
      }}
      fullWidth
    >
      <DialogTitle>Create Link</DialogTitle>
      <DialogContent dividers={true}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="select-from-interface-label">
              From Interface
            </InputLabel>
            <Select
              labelId="select-from-interface-label"
              label="From Interface"
              onChange={(e) => {
                setFromInterfaceName(e.target.value as string);
              }}
              value={fromInterfaceName}
            >
              {fromNode.interfaces.map((i) => {
                return (
                  <MenuItem
                    value={i.name}
                    disabled={i.dst() !== undefined}
                    key={`CreateLinkModal-${i.name}`}
                  >
                    {i.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-to-interface-label">To Interface</InputLabel>
            <Select
              label="To Interface"
              labelId="select-to-interface-label"
              onChange={(e) => {
                setToInterfaceName(e.target.value as string);
              }}
              value={toInterfaceName}
            >
              {toNode.interfaces.map((i) => {
                return (
                  <MenuItem
                    value={i.name}
                    disabled={i.dst() !== undefined}
                    key={`CreateLinkModal-${i.name}`}
                  >
                    {i.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Button onClick={onSubmitHandler} variant="contained">
              Create Link
            </Button>
            <Button onClick={onClickCancelBtn}>Cancel</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLinkModal;
