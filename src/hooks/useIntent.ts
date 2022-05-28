import Intent, { Interface, Loopback, Node, NodeType } from "models/intent";
import { useRecoilState, useResetRecoilState } from "recoil";
import { intentState } from "state";

const useIntent = () => {
  const [intent, setIntent] = useRecoilState(intentState);
  const _resetIntent = useResetRecoilState(intentState);
  const addNode = (
    name: string,
    type: NodeType = "Unknown",
    mgmtAddr: string | undefined = undefined,
    loopback: Loopback | undefined = undefined,
    interfaces: { name: string; ipv4Addr: string | undefined }[] = []
  ): Node => {
    const cloneIntent = intent.clone();
    const node = cloneIntent.addNode(
      name,
      type,
      mgmtAddr,
      loopback,
      interfaces
    );
    setIntent(cloneIntent);
    return node;
  };
  const updateNode = (node: Node) => {
    const cloneIntent = intent.clone();
    cloneIntent.updateNode(node);
    setIntent(cloneIntent);
  };
  const addInterface = (
    node: Node,
    interfaceName: string,
    ipv4Address: string
  ) => {
    const cloneIntent = intent.clone();
    const targetNode = cloneIntent.findNodeById(node.id);
    if (targetNode === undefined) {
      throw new Error("not found node");
    }
    targetNode.addInterface(interfaceName, ipv4Address);
    cloneIntent.updateNode(targetNode);
    setIntent(cloneIntent);
  };
  const removeNode = (nodeId: string) => {
    const cloneIntent = intent.clone();
    cloneIntent.removeNode(nodeId);
    setIntent(cloneIntent);
  };
  const addLink = (from: Interface, to: Interface) => {
    const cloneIntent = intent.clone();
    cloneIntent.addLink(from, to);
    setIntent(cloneIntent);
  };
  const removeLink = (linkId: string) => {
    const cloneIntent = intent.clone();
    cloneIntent.removeLink(linkId);
    setIntent(cloneIntent);
  };
  const loadIntent = (intent: Intent) => {
    setIntent(intent.clone());
  };
  const resetIntent = () => {
    _resetIntent();
  };
  return {
    intent,
    addNode,
    updateNode,
    removeNode,
    addLink,
    removeLink,
    loadIntent,
    resetIntent,
    addInterface,
  };
};

export default useIntent;
