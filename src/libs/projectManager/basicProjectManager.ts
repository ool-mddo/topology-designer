import AbstractProjectManager from "./abs";
import { Project } from "models/project";
import Intent, { Node as NodeIntent, NodeType } from "models/intent";
import CanvasData, { SerializedCanvasData } from "models/canvas";

type BasicProject = {
  intent: BasicProjectIntent;
  canvas: SerializedCanvasData;
};

type BasicProjectIntent = {
  Name: string;
  Topology: {
    Nodes: BasicProjectNode[];
    Links: BasicProjectLink[];
  };
};

type BasicProjectNode = {
  Hostname: string;
  InstanceType: NodeType | null;
  ManagementAddr: string | null;
  Loopback: {
    IPv4: string | null;
  };
  Interfaces: BasicProjectInterface[];
};

type BasicProjectInterface = {
  Name: string;
  IPv4: string | null;
};

type BasicProjectLink = {
  Hostname: string;
  InterfaceName: string;
}[];

export default class BasicProjectManager extends AbstractProjectManager {
  public importFromJSON(json: string): Project {
    const jsonData: BasicProject = JSON.parse(json);
    const intent = new Intent(jsonData.intent.Name);
    jsonData.intent.Topology.Nodes.map((node) => {
      const nodeIntent = new NodeIntent(
        intent,
        node.Hostname,
        node.InstanceType ?? "UnKnown",
        node.ManagementAddr ?? undefined,
        {
          IPv4: node.Loopback.IPv4 ?? undefined,
        }
      );
      node.Interfaces.map((i) => {
        nodeIntent.addInterface(i.Name, i.IPv4 ?? undefined);
      });
      intent.updateNode(nodeIntent);
    });
    jsonData.intent.Topology.Links.map((link) => {
      if (link.length !== 2) {
        return;
      }
      const fromInterface = intent
        .findNodeByName(link[0].Hostname)
        ?.findInterface(link[0].InterfaceName);
      const toInterface = intent
        .findNodeByName(link[1].Hostname)
        ?.findInterface(link[1].InterfaceName);
      if (fromInterface && toInterface) {
        intent.addLink(fromInterface, toInterface);
      }
    });
    return {
      intent: intent,
      canvas: new CanvasData(new Map(jsonData.canvas?.routerNodeMap)),
    };
  }

  public exportToJSON(project: Project): string {
    const intent = project.intent;
    const canvasData = project.canvas?.toJSON() ?? { routerNodeMap: [] };
    const basicProject: BasicProject = {
      intent: {
        Name: intent.id,
        Topology: {
          Nodes: [],
          Links: [],
        },
      },
      canvas: canvasData,
    };
    intent.nodes.map((node) => {
      const interfaces: BasicProjectInterface[] = [];
      node.interfaces.map((i) => {
        interfaces.push({
          Name: i.name,
          IPv4: i.ipv4Addr ?? null,
        });
      });
      basicProject.intent.Topology.Nodes.push({
        Hostname: node.name,
        InstanceType: node.type,
        ManagementAddr: node.mgmtAddr ?? null,
        Loopback: { IPv4: node.loopback.IPv4 ?? null },
        Interfaces: interfaces,
      });
    });
    intent.links.map((link) => {
      basicProject.intent.Topology.Links.push([
        {
          Hostname: link.from.p.name,
          InterfaceName: link.from.name,
        },
        {
          Hostname: link.to.p.name,
          InterfaceName: link.to.name,
        },
      ]);
    });
    return JSON.stringify(basicProject, null, 4);
  }
}
