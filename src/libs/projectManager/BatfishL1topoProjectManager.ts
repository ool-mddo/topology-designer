import AbstractProjectManager from "./abs";
import { Project } from "models/project";
import Intent, { Node as NodeIntent, NodeType } from "models/intent";
import CanvasData, { SerializedCanvasData } from "models/canvas";

type BatfishL1topoProject = {
  edges: BatfishL1topoProjectEdge[];
  extension: BatfishL1topoProjectExtension;
};

type BatfishL1topoProjectEdge = {
  node1: BatfishL1topoProjectEdgeNode;
  node2: BatfishL1topoProjectEdgeNode;
};

type BatfishL1topoProjectEdgeNode = {
  hostname: string;
  interfaceName: string;
};

type BatfishL1topoProjectExtension = {
  TopologyDesignerCanvas: SerializedCanvasData;
};

export default class BatfishL1topoProjectManager extends AbstractProjectManager {
  public importFromJSON(json: string): Project {
    const jsonData: BatfishL1topoProject = JSON.parse(json);
    const intent = new Intent("Batfish L1");
    jsonData.edges.map((edge) => {
      const node = intent.findNodeByName(edge.node1.hostname)
      if (node) {
        node.addInterface(edge.node1.interfaceName, undefined);
        intent.updateNode(node);
      } else {
        const nodeIntent = new NodeIntent(
          intent,
          edge.node1.hostname,
          "Unknown",
          undefined,
          {
            IPv4: undefined,
          }
        );
        nodeIntent.addInterface(edge.node1.interfaceName, undefined);
        intent.updateNode(nodeIntent);
      }
      const fromInterface = intent
        .findNodeByName(edge.node1.hostname)
        ?.findInterface(edge.node1.interfaceName);
      const toInterface = intent
        .findNodeByName(edge.node2.hostname)
        ?.findInterface(edge.node2.interfaceName);
      if (fromInterface && toInterface) {
        intent.addLink(fromInterface, toInterface);
      }
    });
    return {
      intent: intent,
      canvas: new CanvasData(new Map(jsonData.extension?.TopologyDesignerCanvas?.routerNodeMap)),
    };
  }

  public exportToJSON(project: Project): string {
    const intent = project.intent;
    const canvasData = project.canvas?.toJSON() ?? { routerNodeMap: [] };
    const BatfishL1topoProject: BatfishL1topoProject = {
      edges: [],
      extension: {
        TopologyDesignerCanvas: canvasData,
      },
    };
    intent.links.map((link) => {
      BatfishL1topoProject.edges.push({
        node1:{
          hostname: link.to.p.name,
          interfaceName: link.to.name,
        },
        node2:{
          hostname: link.from.p.name,
          interfaceName: link.from.name,
        },
      });
      BatfishL1topoProject.edges.push({
        node1:{
          hostname: link.from.p.name,
          interfaceName: link.from.name,
        },
        node2:{
          hostname: link.to.p.name,
          interfaceName: link.to.name,
        },
      });
    });
    return JSON.stringify(BatfishL1topoProject, null, 2);
  }
}
