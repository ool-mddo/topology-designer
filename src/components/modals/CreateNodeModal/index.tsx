import React, { FC, MouseEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { NodeType } from "models/intent";
import { useSetRecoilState } from "recoil";
import { createNodeModalState } from "state";
import useIntent from "hooks/useIntent";

type Props = {
  isOpen: boolean;
};

type InterfaceData = {
  name: string;
  ipv4Addr: string;
};

type FormData = {
  name: string;
  type: string;
  mgmtAddr: string;
  loopback: string;
  interfaceDataList: InterfaceData[];
};

const initFormData: FormData = {
  name: "",
  type: "Unknown",
  mgmtAddr: "",
  loopback: "",
  interfaceDataList: [],
};

const CreateNodeModal: FC<Props> = ({ isOpen }) => {
  const { intent, addNode } = useIntent();
  const setCreateNodeModal = useSetRecoilState(createNodeModalState);
  const [formData, setFormData] = useState<FormData>(initFormData);
  const addInterfaceForm = () => {
    setFormData({
      ...formData,
      interfaceDataList: [
        ...formData.interfaceDataList,
        { name: "", ipv4Addr: "" },
      ],
    });
  };
  const removeInterface = (idx: number) => {
    const copy = [...formData.interfaceDataList];
    copy.splice(idx, 1);
    setFormData({ ...formData, interfaceDataList: copy });
  };
  const onChangeInterfaceName = (idx: number, name: string) => {
    const targetI = formData.interfaceDataList[idx];
    targetI.name = name;
    const copy = [...formData.interfaceDataList];
    copy.splice(idx, 1, targetI);
    setFormData({ ...formData, interfaceDataList: copy });
  };
  const onChangeInterfaceIpv4Addr = (idx: number, ipv4: string) => {
    const targetI = formData.interfaceDataList[idx];
    targetI.ipv4Addr = ipv4;
    const copy = [...formData.interfaceDataList];
    copy.splice(idx, 1, targetI);
    setFormData({ ...formData, interfaceDataList: copy });
  };
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
      },
      formData.interfaceDataList
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
            size="small"
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
              size="small"
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
            size="small"
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
            size="small"
          />
          <Button onClick={addInterfaceForm}>Add Interface</Button>
          {formData.interfaceDataList.map((i, idx) => {
            return (
              <Grid
                container
                spacing={1}
                key={`interface-form-${idx}`}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={10}>
                  <Stack spacing={1}>
                    <TextField
                      id="outlined-basic"
                      label="Interface Name"
                      variant="outlined"
                      value={i.name}
                      onChange={(e) => {
                        onChangeInterfaceName(idx, e.target.value);
                      }}
                      placeholder="ge-0/0/1"
                      required
                      size="small"
                    />
                    <TextField
                      id="outlined-basic"
                      label="Loopback Address"
                      variant="outlined"
                      value={i.ipv4Addr}
                      onChange={(e) => {
                        onChangeInterfaceIpv4Addr(idx, e.target.value);
                      }}
                      placeholder="10.255.1.2/32"
                      required
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => {
                      removeInterface(idx);
                    }}
                    aria-label="delete"
                    size="small"
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
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
