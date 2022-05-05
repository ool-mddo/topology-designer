import React, { ReactElement, useEffect, useState } from "react";
import Viewer from "components/Viewer";
import { Intent, Node } from "models/intent";
import { useSetRecoilState } from "recoil";
import { intentState } from "state";
import { Box } from "@mui/system";
import { AppBar, Toolbar, Typography } from "@mui/material";
import styled from "@emotion/styled";

const makeTestIntent = (): Intent => {
  const intent = new Intent("testIntent");
  const nodeA = new Node(intent, "nodeA");
  const nodeB = new Node(intent, "nodeB");
  nodeA.addInterface("interface1");
  nodeA.addInterface("interface2");
  nodeA.addInterface("interface3");
  nodeB.addInterface("interface1");
  nodeB.addInterface("interface2");
  nodeB.addInterface("interface3");
  intent.addNode(nodeA);
  intent.addNode(nodeB);
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
            Network Drawering Tool
          </Typography>
        </Toolbar>
      </AppBar>
      <ViewerWrapper>
        <Viewer />
      </ViewerWrapper>
    </Box>
  );
};

export default App;
