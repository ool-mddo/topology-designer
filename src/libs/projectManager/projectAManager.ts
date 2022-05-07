import AbstractProjectManager from "./abs";
import { Project } from "models/project";
import Intent, { Node as NodeIntent } from "models/intent";
import CanvasData, { SerializedCanvasData } from "models/canvas";

type ProjectA = {
  intent: ProjectAIntent;
  canvas: SerializedCanvasData;
};

type ProjectAIntent = {
  Name: string;
  Topology: {
    Nodes: ProjectANode[];
    Links: ProjectALink[];
  };
};

type ProjectANode = {
  Hostname: string;
  InstanceType: string;
  ManagementAddr: string;
  Loopback: {
    IPv4: string;
  };
  Interfaces: ProjectAInterface[];
};

type ProjectAInterface = {
  Name: string;
  IPv4: string;
};

type ProjectALink = {
  Hostname: string;
  InterfaceName: string;
}[];

export default class ProjectAManager extends AbstractProjectManager {
  public importFromJSON(json: string): Project {
    const jsonData: ProjectA = JSON.parse(json);
    const intent = new Intent(jsonData.intent.Name);
    jsonData.intent.Topology.Nodes.map((node) => {
      const nodeIntent = new NodeIntent(intent, node.Hostname);
      node.Interfaces.map((i) => {
        nodeIntent.addInterface(i.Name);
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
    const projectA: ProjectA = {
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
      const interfaces: ProjectAInterface[] = [];
      node.interfaces.map((i) => {
        interfaces.push({
          Name: i.name,
          IPv4: "10.0.0.1/30",
        });
      });
      projectA.intent.Topology.Nodes.push({
        Hostname: node.name,
        InstanceType: "XRv",
        ManagementAddr: "10.254.0.101",
        Loopback: {
          IPv4: "10.255.1.1/32",
        },
        Interfaces: interfaces,
      });
    });
    intent.links.map((link) => {
      projectA.intent.Topology.Links.push([
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
    return JSON.stringify(projectA);
  }
}
