import styled from "@emotion/styled";
import { Cable, NearMe, Router } from "@mui/icons-material";
import { Icon, MenuItem, MenuList, Paper } from "@mui/material";
import { Box } from "@mui/system";
import Portal from "components/Portal";
import React from "react";
import { useSetRecoilState } from "recoil";
import { createNodeModalState, modeState } from "state";

const Wrapper = styled(Paper)({
  position: "absolute",
  width: "50px",
  height: "500px",
  top: "100px",
  left: "30px",
  zIndex: 1000,
  cursor: "pointer",
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  justifyItems: "center",
});

const IconWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
});

const Toolbar: React.FC = () => {
  const setMode = useSetRecoilState(modeState);
  const setCreateNodeModal = useSetRecoilState(createNodeModalState);
  return (
    <Portal>
      <Wrapper>
        <IconWrapper
          onClick={() => {
            setMode({ currentMode: "View" });
          }}
        >
          <NearMe
            style={{
              width: "30px",
              height: "30px",
              padding: "10px",
            }}
          />
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            setMode({ currentMode: "CreateLink" });
          }}
        >
          <Cable style={{ width: "30px", height: "30px", padding: "10px" }} />
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            setCreateNodeModal({ isOpen: true });
          }}
        >
          <Router style={{ width: "30px", height: "30px", padding: "10px" }} />
        </IconWrapper>
      </Wrapper>
    </Portal>
  );
};

export default Toolbar;
