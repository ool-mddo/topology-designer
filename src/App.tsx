import React, { ReactElement, useEffect } from "react";
import Intent from "models/intent";
import { useSetRecoilState } from "recoil";
import { intentState } from "state";
import { Box } from "@mui/system";
import { AppBar, Toolbar, Typography } from "@mui/material";
import styled from "@emotion/styled";
import DraftingBoard from "components/DraftingBoard";

const makeTestIntent = (): Intent => {
  const intent = new Intent("testIntent");
  const nodeA = intent.addNode("nodeA");
  const nodeB = intent.addNode("nodeB");
  nodeA.addInterface("interface1");
  nodeA.addInterface("interface2");
  nodeA.addInterface("interface3");
  nodeB.addInterface("interface1");
  nodeB.addInterface("interface2");
  nodeB.addInterface("interface3");
  intent.updateNode(nodeA);
  intent.updateNode(nodeB);
  const nodeAIf = nodeA.findInterface("interface1");
  const nodeBIf = nodeB.findInterface("interface1");
  if (nodeAIf && nodeBIf) {
    intent.addLink(nodeAIf, nodeBIf);
  }
  return intent;
};

const ViewerWrapper = styled(Box)({
  height: "calc(100% - 50px)",
  width: "100%",
});

const App = (): ReactElement => {
  const setIntent = useSetRecoilState(intentState);
  useEffect(() => {
    setIntent(makeTestIntent());
  }, []);
  return (
    <Box style={{ width: "100vw", height: "100vh" }}>
      <AppBar position="static" style={{ height: "50px" }}>
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Network Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <ViewerWrapper>
        <DraftingBoard />
      </ViewerWrapper>
    </Box>
  );
};

export default App;
