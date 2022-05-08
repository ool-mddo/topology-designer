import React, { FC, useMemo, useState } from "react";
import { Vector2d } from "konva/lib/types";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  createInterfaceModalState,
  editNodeModalState,
  intentState,
  routerNodeMenuState,
} from "state";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import Intent, { Node as NodeIntent } from "models/intent";
import DeleteNodeDialog from "./DeleteNodeDialog";

type Props = {
  node: NodeIntent;
  pos: Vector2d;
};

const RouterNodeMenu: FC<Props> = ({ node, pos }) => {
  const setCreateInterfaceModal = useSetRecoilState(createInterfaceModalState);
  const setEditNodeModal = useSetRecoilState(editNodeModalState);
  const resetMenu = useResetRecoilState(routerNodeMenuState);
  const [isOpenDeleteNodeDialog, setIsOpenDeleteNodeDialog] = useState(false);
  const [intent, setIntent] = useRecoilState(intentState);
  const onClickDeleteBtn = () => {
    setIsOpenDeleteNodeDialog(true);
  };
  const renderDeleteNodeDialog = useMemo(() => {
    return (
      <DeleteNodeDialog
        isOpen={isOpenDeleteNodeDialog}
        onDeleteNode={() => {
          const newIntent = new Intent(intent.id, intent.nodes, intent.links);
          newIntent.removeNodeByName(node.name);
          setIntent(newIntent);
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
