import React, { FC } from "react";
import { MenuItem, MenuList, Paper } from "@mui/material";
import { Vector2d } from "konva/lib/types";
import { useSetRecoilState } from "recoil";
import { createNodeModalState } from "state";

type Props = {
  pos: Vector2d;
};

const ContextMenu: FC<Props> = ({ pos }) => {
  const setCreateNodeModalState = useSetRecoilState(createNodeModalState);
  return (
    <Paper sx={{ width: 320, position: "absolute", left: pos.x, top: pos.y }}>
      <MenuList dense>
        <MenuItem
          onClick={() => {
            setCreateNodeModalState({ isOpen: true });
          }}
        >
          Add Node
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default ContextMenu;
