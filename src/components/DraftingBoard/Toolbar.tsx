import React from "react";
import { Cable, Menu, NearMe } from "@mui/icons-material";
import { Box, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { modeState, contextMenuState } from "state";

const Toolbar: React.FC = () => {
  const setContextMenu = useSetRecoilState(contextMenuState);
  const resetContextMenu = useResetRecoilState(contextMenuState);
  const outsideClickHandler = () => {
    resetContextMenu();
    removeOutsideClickHandler();
  };
  const addOutsideClickHandler = () => {
    document.body.addEventListener("click", outsideClickHandler);
  };
  const removeOutsideClickHandler = () => {
    document.body.removeEventListener("click", outsideClickHandler);
  };
  const [mode, setMode] = useRecoilState(modeState);
  return (
    <Box
      sx={{
        position: "absolute",
        top: 100,
        left: 30,
        cursor: "pointer",
      }}
    >
      <Paper>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <Tooltip title="Menu">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setContextMenu({ isOpen: true, pos: { x: 30, y: 150 } });
                addOutsideClickHandler();
              }}
            >
              <Menu />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Mode">
            <IconButton
              onClick={() => {
                setMode({ currentMode: "View" });
              }}
              color="primary"
              sx={{
                backgroundColor:
                  mode.currentMode === "View" ? "#bdbdbd" : "white",
              }}
            >
              <NearMe />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create Link Mode">
            <IconButton
              onClick={() => {
                setMode({ currentMode: "CreateLink" });
              }}
              color="primary"
              sx={{
                backgroundColor:
                  mode.currentMode === "CreateLink" ? "#bdbdbd" : "white",
              }}
            >
              <Cable />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Toolbar;
