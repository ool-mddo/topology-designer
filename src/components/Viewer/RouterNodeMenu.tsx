import React, { FC } from "react";
import styled from "@emotion/styled";
import { Vector2d } from "konva/lib/types";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { createInterfaceModalState, routerNodeMenuState } from "state";
import { Box, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import { Node as NodeIntent } from "models/intent";

const Wrapper = styled(Box)<{ pos: Vector2d }>(({ pos }) => ({
  position: "absolute",
  top: `${pos.y}px`,
  left: `${pos.x}px`,
  width: "200px",
  height: "200px",
}));

type Props = {
  node: NodeIntent;
  pos: Vector2d;
};

const RouterNodeMenu: FC<Props> = ({ node, pos }) => {
  const setCreateInterfaceModal = useSetRecoilState(createInterfaceModalState);
  const resetMenu = useResetRecoilState(routerNodeMenuState);
  return (
    <Wrapper
      pos={pos}
      onMouseLeave={(_) => {
        resetMenu();
      }}
    >
      <Paper style={{ width: "100%", height: "100%", padding: "5px" }}>
        <Typography>{`Menu <<${node.name}>>`}</Typography>
        <MenuList>
          <MenuItem
            onClick={(_) =>
              setCreateInterfaceModal({ isOpen: true, node: node })
            }
          >
            Add Interface
          </MenuItem>
        </MenuList>
      </Paper>
    </Wrapper>
  );
};

export default RouterNodeMenu;
