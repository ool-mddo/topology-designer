import styled from "@emotion/styled";
import { Box, MenuItem, MenuList, Paper } from "@mui/material";
import Portal from "components/Portal";
import { Vector2d } from "konva/lib/types";
import React, { MouseEvent } from "react";

type Props = {
  pos: Vector2d;
  onClickRemoveLink?: (e: MouseEvent<HTMLElement>) => void;
};

const LinkDetail: React.FC<Props> = ({ pos, onClickRemoveLink }) => {
  console.log(`LinkDetail rendered. at<{${pos.x}, ${pos.y}}>`);
  return (
    <Portal>
      <Box
        style={{
          position: "absolute",
          top: pos.x,
          left: pos.y,
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

export default LinkDetail;
