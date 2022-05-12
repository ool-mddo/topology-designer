import React, { FC, useMemo, useState } from "react";
import { Vector2d } from "konva/lib/types";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import {
  createInterfaceModalState,
  editNodeModalState,
  routerNodeMenuState,
} from "state";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import { Node as NodeIntent } from "models/intent";
import DeleteNodeDialog from "./DeleteNodeDialog";
import useIntent from "hooks/useIntent";

type Props = {
  node: NodeIntent;
  pos: Vector2d;
};

const RouterNodeMenu: FC<Props> = ({ node, pos }) => {
  const { removeNode } = useIntent();
  const setCreateInterfaceModal = useSetRecoilState(createInterfaceModalState);
  const setEditNodeModal = useSetRecoilState(editNodeModalState);
  const resetMenu = useResetRecoilState(routerNodeMenuState);
  const [isOpenDeleteNodeDialog, setIsOpenDeleteNodeDialog] = useState(false);
  const onClickDeleteBtn = () => {
    setIsOpenDeleteNodeDialog(true);
  };
  const renderDeleteNodeDialog = useMemo(() => {
    return (
      <DeleteNodeDialog
        isOpen={isOpenDeleteNodeDialog}
        onDeleteNode={() => {
          removeNode(node.id);
          setIsOpenDeleteNodeDialog(false);
          resetMenu();
        }}
        onCancel={() => {
          setIsOpenDeleteNodeDialog(false);
          resetMenu();
        }}
      />
    );
  }, [isOpenDeleteNodeDialog]);

  return (
    <Box component={"div"} onMouseLeave={() => resetMenu()}>
      <Paper sx={{ width: 320, position: "absolute", left: pos.x, top: pos.y }}>
        <MenuList dense>
          <MenuItem
            onClick={() => setEditNodeModal({ isOpen: true, node: node })}
          >
            Edit Node
          </MenuItem>
          <MenuItem
            onClick={() =>
              setCreateInterfaceModal({ isOpen: true, node: node })
            }
          >
            Add Interface
          </MenuItem>
          <MenuItem onClick={onClickDeleteBtn}>Delete Node</MenuItem>
        </MenuList>
      </Paper>
      {renderDeleteNodeDialog}
    </Box>
  );
};

export default RouterNodeMenu;
