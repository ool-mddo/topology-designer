import styled from "@emotion/styled";
import { MenuItem, MenuList, Paper } from "@mui/material";
import { Box } from "@mui/system";
import Portal from "components/Portal";
import React from "react";
import { useSetRecoilState } from "recoil";
import { createNodeModalState, modeState } from "state";

const Wrapper = styled(Box)({
  position: "absolute",
  top: "200px",
  right: "200px",
  zIndex: 1000,
  cursor: "pointer",
});

const Toolbar: React.FC = () => {
  const setMode = useSetRecoilState(modeState);
  const setCreateNodeModal = useSetRecoilState(createNodeModalState);
  return (
    <Portal>
      <Wrapper sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Paper>
          <MenuList>
            <MenuItem onClick={() => setMode({ currentMode: "View" })}>
              View Mode
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMode({ currentMode: "CreateLink" });
              }}
            >
              Create Link Mode
            </MenuItem>
            <MenuItem
              onClick={() => {
                setCreateNodeModal({ isOpen: true });
              }}
            >
              Create Node
            </MenuItem>
          </MenuList>
        </Paper>
      </Wrapper>
    </Portal>
  );
};

export default Toolbar;
