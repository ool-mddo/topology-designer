import { Intent, Node as NodeIntent } from "models/intent";
import AbstractIntentManager from "./abs";

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

type ProjectAIntent = {
  Name: string;
  Topology: {
    Nodes: ProjectANode[];
    Links: ProjectALink[];
  };
};

export default class ProjectAIntentManager extends AbstractIntentManager {
  public importFromJSON(json: string): Intent {
    const jsonData: ProjectAIntent = JSON.parse(json);
    const intent = new Intent(jsonData.Name);
    jsonData.Topology.Nodes.map((node) => {
      const nodeIntent = new NodeIntent(intent, node.Hostname);
      node.Interfaces.map((i) => {
        nodeIntent.addInterface(i.Name);
      });
      intent.updateNode(nodeIntent);
    });
    jsonData.Topology.Links.map((link) => {
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
    return intent;
  }

  public exportToJSON(intent: Intent): string {
    const projectAIntent: ProjectAIntent = {
      Name: intent.id,
      Topology: {
        Nodes: [],
        Links: [],
      },
    };
    intent.nodes.map((node) => {
      const interfaces: ProjectAInterface[] = [];
      node.interfaces.map((i) => {
        interfaces.push({
          Name: i.name,
          IPv4: "10.0.0.1/30",
        });
      });
      projectAIntent.Topology.Nodes.push({
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
      projectAIntent.Topology.Links.push([
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
    return JSON.stringify(projectAIntent);
  }
}
