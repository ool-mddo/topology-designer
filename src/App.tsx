import React, { ReactElement, useEffect, useState } from "react";
import Viewer from "components/Viewer";
import { Intent, Node, Link } from "models/intent";
import { useRecoilState } from "recoil";
import { intentState } from "state";

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

const App = (): ReactElement => {
  const [intent, setIntent] = useRecoilState(intentState);
  const onClickAddNodeBtn = () => {
    const newIntent = Object.assign(
      new Intent(intent.id, intent.nodes, intent.links),
      intent
    );
    const nodeC = new Node(intent, "nodeC");
    nodeC.addInterface("interface1");
    newIntent.addNode(nodeC);
    setIntent(newIntent);
  };
  const onClickAddLinkBtn = () => {
    console.log("onClickAddLinkBtn");
    const newIntent = Object.assign(
      new Intent(intent.id, intent.nodes, intent.links),
      intent
    );
    console.log(intent);
    const nodeA = intent.findNodeByName("nodeA");
    const nodeC = intent.findNodeByName("nodeC");
    console.log(nodeC);
    if (!(nodeA && nodeC)) {
      console.log("here1");
      return;
    }
    const nodeAIF = nodeA.findInterface("interface1");
    const nodeCIF = nodeC.findInterface("interface1");
    if (!(nodeAIF && nodeCIF)) {
      console.log("here2");
      return;
    }
    newIntent.addLink(nodeAIF, nodeCIF);
    console.log(newIntent);
    setIntent(newIntent);
  };
  useEffect(() => {
    console.log("[App.tsx] useEffect run");
    setIntent(makeTestIntent());
  }, []);
  return (
    <div>
      <button onClick={onClickAddNodeBtn}>Add Node</button>
      <button onClick={onClickAddLinkBtn}>Add Link</button>
      <Viewer />
    </div>
  );
};

export default App;
