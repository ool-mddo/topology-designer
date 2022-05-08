import styled from "@emotion/styled";
import { Cable, NearMe } from "@mui/icons-material";
import { IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useRecoilState } from "recoil";
import { modeState } from "state";

const Toolbar: React.FC = () => {
  const [mode, setMode] = useRecoilState(modeState);
  return (
    <Box
      sx={{
        position: "absolute",
        top: "100px",
        left: "30px",
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
