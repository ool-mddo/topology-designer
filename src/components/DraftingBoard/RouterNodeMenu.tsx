import React, { FC } from "react";
import { Vector2d } from "konva/lib/types";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  createInterfaceModalState,
  intentState,
  routerNodeMenuState,
} from "state";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import Intent, { Node as NodeIntent } from "models/intent";

type Props = {
  node: NodeIntent;
  pos: Vector2d;
};

const RouterNodeMenu: FC<Props> = ({ node, pos }) => {
  const setCreateInterfaceModal = useSetRecoilState(createInterfaceModalState);
  const resetMenu = useResetRecoilState(routerNodeMenuState);
  const [intent, setIntent] = useRecoilState(intentState);
  const onClickDeleteBtn = () => {
    const newIntent = new Intent(intent.id, intent.nodes, intent.links);
    newIntent.removeNodeByName(node.name);
    setIntent(newIntent);
    resetMenu();
  };
  return (
    <Box component={"div"} onMouseLeave={() => resetMenu()}>
      <Paper sx={{ width: 320, position: "absolute", left: pos.x, top: pos.y }}>
        <MenuList dense>
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
    </Box>
  );
};

export default RouterNodeMenu;
