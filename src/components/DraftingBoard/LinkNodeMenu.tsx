import React, { MouseEvent } from "react";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import { Vector2d } from "konva/lib/types";
import { useResetRecoilState } from "recoil";
import { linkNodeMenuState } from "state";

type Props = {
  pos: Vector2d;
  onClickRemoveLink?: (e: MouseEvent<HTMLElement>) => void;
};

const LinkNodeMenu: React.FC<Props> = ({ pos, onClickRemoveLink }) => {
  const closeMenu = useResetRecoilState(linkNodeMenuState);
  return (
    <Box component={"div"} onMouseLeave={() => closeMenu()}>
      <Paper sx={{ width: 320, position: "absolute", left: pos.x, top: pos.y }}>
        <MenuList dense>
          <MenuItem onClick={onClickRemoveLink}>Delete Link</MenuItem>
        </MenuList>
      </Paper>
    </Box>
  );
};

export default LinkNodeMenu;
