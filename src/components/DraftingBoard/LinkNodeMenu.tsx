import React, { MouseEvent } from "react";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import Portal from "components/Portal";
import { Vector2d } from "konva/lib/types";

type Props = {
  pos: Vector2d;
  onClickRemoveLink?: (e: MouseEvent<HTMLElement>) => void;
};

const LinkNodeMenu: React.FC<Props> = ({ pos, onClickRemoveLink }) => {
  return (
    <Portal>
      <Box
        style={{
          position: "absolute",
          top: pos.y,
          left: pos.x,
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
        <Paper>
          <MenuList>
            <MenuItem onClick={onClickRemoveLink}>Remove Link</MenuItem>
          </MenuList>
        </Paper>
      </Box>
    </Portal>
  );
};

export default LinkNodeMenu;
