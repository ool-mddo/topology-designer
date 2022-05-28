import React, { FC, MouseEvent, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Node as NodeIntent } from "models/intent";
import { useResetRecoilState } from "recoil";
import { createInterfaceModalState } from "state";
import useIntent from "hooks/useIntent";

type Props = {
  isOpen: boolean;
  node: NodeIntent;
};

type InterfaceData = {
  name: string;
  ipv4Addr: string;
};

type FormData = {
  interfaceDataList: InterfaceData[];
};

const initFormData: FormData = {
  interfaceDataList: [
    {
      name: "",
      ipv4Addr: "",
    },
  ],
};

const CreateInterfaceModal: FC<Props> = ({ isOpen, node }) => {
  const { updateNode } = useIntent();
  const resetCreateInterfaceModal = useResetRecoilState(
    createInterfaceModalState
  );
  const [formData, setFormData] = useState<FormData>(initFormData);
  const onClickCreateBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    formData.interfaceDataList.map((data) => {
      if (node.findInterface(data.name)) {
        alert("その名前のインタフェースは登録されています");
        return;
      }
      const ipv4Addr = data.ipv4Addr !== "" ? data.ipv4Addr : undefined;
      node.addInterface(data.name, ipv4Addr);
    });
    updateNode(node);
    resetCreateInterfaceModal();
    return;
  };
  const onClickCancelBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    resetCreateInterfaceModal();
    return;
  };
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
  const renderFirstForm = useMemo(() => {
    if (formData.interfaceDataList.length === 0) return null;
    const firstFormData = formData.interfaceDataList[0];
    return (
      <>
        <TextField
          id="outlined-basic"
          label="Interface Name"
          variant="outlined"
          value={firstFormData.name}
          onChange={(e) => {
            onChangeInterfaceName(0, e.target.value);
          }}
          required
          size="small"
        />
        <TextField
          id="outlined-basic"
          label="IPv4 Address"
          variant="outlined"
          value={firstFormData.ipv4Addr}
          placeholder="192.168.1.1/30"
          onChange={(e) => {
            onChangeInterfaceIpv4Addr(0, e.target.value);
          }}
          required
          size="small"
        />
      </>
    );
  }, [formData.interfaceDataList]);

  const renderAdditionalForms = useMemo(() => {
    if (formData.interfaceDataList.length < 2) return null;
    return formData.interfaceDataList.map((i, idx) => {
      if (idx === 0) return null;
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
    });
  }, [formData.interfaceDataList]);

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
          {renderFirstForm}
          <Button onClick={addInterfaceForm}>Add Interface</Button>
          {renderAdditionalForms}
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
