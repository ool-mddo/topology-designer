import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Intent, Node as NodeIntent } from "models/intent";
import React, { FC, MouseEvent, MouseEventHandler, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { createLinkState, intentState } from "state";

type Props = {
  isOpen: boolean;
  fromNode: NodeIntent;
  toNode: NodeIntent;
};

const CreateLinkModal: FC<Props> = ({ isOpen, fromNode, toNode }) => {
  const [intent, setIntent] = useRecoilState(intentState);
  const [fromInterfaceName, setFromInterfaceName] = useState("");
  const [toInterfaceName, setToInterfaceName] = useState("");
  const resetCreateLink = useResetRecoilState(createLinkState);
  const onClickCancelBtn = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    resetCreateLink();
    return;
  };
  const onSubmitHandler = () => {
    console.log(fromInterfaceName);
    console.log(toInterfaceName);
    console.log(intent);

    const fromInterface = fromNode.findInterface(fromInterfaceName);
    const toInterface = toNode.findInterface(toInterfaceName);
    console.log(fromInterface);
    console.log(toInterface);
    if (fromInterface && toInterface) {
      const newIntent = new Intent(intent.id, intent.nodes, intent.links);
      newIntent.addLink(fromInterface, toInterface);
      setIntent(newIntent);
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
    >
      <DialogTitle>Create Link</DialogTitle>
      <FormControl fullWidth>
        <InputLabel id="select-from-interface-label">From Interface</InputLabel>
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
            console.log(i);
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
      <Button onClick={onSubmitHandler}>Create Link</Button>
      <Button onClick={onClickCancelBtn}>Cancel</Button>
    </Dialog>
  );
};

export default CreateLinkModal;
