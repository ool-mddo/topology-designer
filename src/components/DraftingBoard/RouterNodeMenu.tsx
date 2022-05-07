import React, { FC } from "react";
import styled from "@emotion/styled";
import { Vector2d } from "konva/lib/types";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  createInterfaceModalState,
  intentState,
  routerNodeMenuState,
} from "state";
import { Box, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import Intent, { Node as NodeIntent } from "models/intent";

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
  const [intent, setIntent] = useRecoilState(intentState);
  const onClickDeleteBtn = () => {
    const newIntent = new Intent(intent.id, intent.nodes, intent.links);
    newIntent.removeNodeByName(node.name);
    setIntent(newIntent);
    resetMenu();
  };
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
          <MenuItem onClick={onClickDeleteBtn}>Delete Node</MenuItem>
        </MenuList>
      </Paper>
    </Wrapper>
  );
};

export default RouterNodeMenu;
