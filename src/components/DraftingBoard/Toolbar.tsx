import styled from "@emotion/styled";
import { Cable, NearMe } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import Portal from "components/Portal";
import React from "react";
import { useSetRecoilState } from "recoil";
import { modeState } from "state";

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
      </Wrapper>
    </Portal>
  );
};

export default Toolbar;
