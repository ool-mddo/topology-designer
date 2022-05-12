export type NodeType = "XRv" | "vMX" | "Unknown";

export type Loopback = {
  IPv4: string | undefined;
};

export default class Intent {
  private _id: string | undefined = undefined;
  private _nodeMap: Map<string, Node> = new Map();
  private _linkMap: Map<string, Link> = new Map();
  constructor(id: string, nodes: Node[] = [], links: Link[] = []) {
    this.id = id;
    this.nodes = nodes;
    this.links = links;
  }

  public get id(): string {
    if (this._id === undefined) {
      throw new Error("intent id is undefined");
    }
    return this._id;
  }

  public set id(v: string) {
    this._id = v;
  }

  public get nodes(): Node[] {
    return Array.from(this._nodeMap.values());
  }

  public set nodes(v: Node[]) {
    v.map((node) => {
      const clonedNode = node.clone(this);
      this._nodeMap.set(this.makeNodeId(clonedNode.name), clonedNode);
    });
  }

  public removeNode(nodeId: string) {
    const targetNode = this._nodeMap.get(nodeId);
    if (targetNode === undefined) return;
    // remove links
    targetNode.interfaces.map((i) => {
      this.findLinksRelatedInterface(i).map((link) => {
        this.removeLink(link.id);
      });
    });
    this._nodeMap.delete(targetNode.id);
  }

  public removeNodeByName(name: string) {
    const targetNode = this._nodeMap.get(this.makeNodeId(name));
    if (targetNode === undefined) return;
    // remove links
    targetNode.interfaces.map((i) => {
      this.findLinksRelatedInterface(i).map((link) => {
        this.removeLink(link.id);
      });
    });
    this._nodeMap.delete(targetNode.id);
  }

  public get links(): Link[] {
    return Array.from(this._linkMap.values());
  }

  public set links(v: Link[]) {
    this._linkMap = new Map();
    v.map((link) => {
      const clonedLink = link.clone(this);
      this._linkMap.set(clonedLink.id, clonedLink);
    });
  }

  public findNodeById(id: string): Node | undefined {
    return this._nodeMap.get(id);
  }

  public findNodeByName(name: string): Node | undefined {
    return this._nodeMap.get(this.makeNodeId(name));
  }

  public addNode(
    nodeName: string,
    type: NodeType = "Unknown",
    mgmtAddr: string | undefined = undefined,
    loopback: Loopback = { IPv4: undefined },
    interfaces: Interface[] = []
  ): Node {
    const node = new Node(this, nodeName, type, mgmtAddr, loopback, interfaces);
    this._nodeMap.set(node.id, node);
    return node;
  }

  public updateNode(node: Node) {
    this._nodeMap.set(node.id, node);
  }

  public findLinksRelatedInterface(i: Interface) {
    return this.links.filter(
      (link) => link.from.id === i.id || link.to.id === i.id
    );
  }

  public addLink(from: Interface, to: Interface) {
    const newLink = new Link(this, from, to);
    this._linkMap.set(newLink.id, newLink);
  }

  public removeLink(id: string) {
    this._linkMap.delete(id);
  }

  private makeNodeId(nodeName: string) {
    return `node-${this.id}-${nodeName}`;
  }

  public toJSON() {
    return {
      nodes: this.nodes,
      links: this.links,
    };
  }

  public clone(): Intent {
    return new Intent(this.id, this.nodes, this.links);
  }
}

export class Node {
  private _p: Intent | undefined = undefined;
  private _name: string | undefined = undefined;
  private _type: NodeType | undefined = undefined;
  private _mgmtAddr: string | undefined = undefined;
  private _loopback: Loopback | undefined = undefined;
  private _interfaceMap: Map<string, Interface> = new Map();
  constructor(
    p: Intent,
    name: string,
    type: NodeType = "Unknown",
    mgmtAddr: string | undefined = undefined,
    loopback: Loopback = { IPv4: undefined },
    interfaces: Interface[] = []
  ) {
    this.p = p;
    this.name = name;
    this.type = type;
    this.mgmtAddr = mgmtAddr;
    this.loopback = loopback;
    this.interfaces = interfaces;
  }

  public get id(): string {
    return `node-${this.p.id}-${this.name}`;
  }

  public get p(): Intent {
    if (this._p === undefined) {
      throw new Error("intent is undefined");
    }
    return this._p;
  }

  public set p(p: Intent) {
    this._p = p;
  }

  public get name(): string {
    if (this._name === undefined) {
      throw new Error("name is undefined");
    }
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get type(): NodeType {
    if (this._type === undefined) {
      throw new Error("type is undefined");
    }
    return this._type;
  }

  public set type(type: NodeType) {
    this._type = type;
  }

  public get mgmtAddr(): string | undefined {
    return this._mgmtAddr;
  }

  public set mgmtAddr(mgmtAddr: string | undefined) {
    this._mgmtAddr = mgmtAddr;
  }

  public get loopback(): Loopback {
    if (this._loopback === undefined) {
      throw new Error("loopback is undefined");
    }
    return this._loopback;
  }

  public set loopback(loopback: Loopback) {
    this._loopback = loopback;
  }

  public set interfaces(v: Interface[]) {
    this._interfaceMap = new Map();
    v.map((i) => {
      const clonedInterface = i.clone(this);
      this._interfaceMap.set(clonedInterface.name, clonedInterface);
    });
  }

  public get interfaces(): Interface[] {
    return Array.from(this._interfaceMap.values());
  }

  public addInterface(
    ifName: string,
    ipv4Addr: string | undefined = undefined
  ) {
    this._interfaceMap.set(ifName, new Interface(this, ifName, ipv4Addr));
  }

  public rmInterface(ifName: string) {
    this._interfaceMap.delete(ifName);
  }

  public findInterface(ifName: string): Interface | undefined {
    return this._interfaceMap.get(ifName);
  }

  public toJSON() {
    return {
      name: this.name,
      type: this.type,
      mgmtAddr: this.mgmtAddr,
      loopback: this.loopback,
      interfaces: this.interfaces,
    };
  }

  public clone(clonedP: Intent): Node {
    return new Node(
      clonedP,
      this.name,
      this.type,
      this.mgmtAddr,
      this.loopback,
      this.interfaces
    );
  }
}

export class Interface {
  private _p: Node | undefined = undefined;
  private _name: string | undefined = undefined;
  private _ipv4Addr: string | undefined = undefined;
  constructor(p: Node, name: string, ipv4Addr: string | undefined = undefined) {
    this.p = p;
    this.name = name;
    this.ipv4Addr = ipv4Addr;
  }

  public get id(): string {
    return `if-${this.p.id}-${this.name}`;
  }

  public get p(): Node {
    if (this._p === undefined) {
      throw new Error("parentNode is undefined");
    }
    return this._p;
  }

  public set p(p: Node) {
    this._p = p;
  }

  public get name(): string {
    if (this._name === undefined) {
      throw new Error("name is undefined");
    }
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get ipv4Addr(): string | undefined {
    return this._ipv4Addr;
  }

  public set ipv4Addr(ipv4Addr: string | undefined) {
    this._ipv4Addr = ipv4Addr;
  }

  public dst(): Interface | undefined {
    const filtered = this.p.p.links.find(
      (link) => link.from.id === this.id || link.to.id === this.id
    );
    if (filtered === undefined) return undefined;
    if (filtered.from.id === this.id) {
      return filtered.to;
    } else if (filtered.to.id === this.id) {
      return filtered.from;
    } else {
      throw new Error("Unexpected error");
    }
  }

  public toJSON() {
    return {
      name: this.name,
      ipv4Addr: this.ipv4Addr,
    };
  }

  public clone(clonedP: Node): Interface {
    return new Interface(clonedP, this.name, this.ipv4Addr);
  }
}

export class Link {
  private _id: string | undefined;
  private _p: Intent | undefined = undefined;
  private _from: Interface | undefined = undefined;
  private _to: Interface | undefined = undefined;
  constructor(p: Intent, from: Interface, to: Interface) {
    this.p = p;
    this.id = `link-${from.id}-${to.id}`;
    this.from = from;
    this.to = to;
  }

  public get p(): Intent {
    if (this._p === undefined) {
      throw new Error("intent is undefined");
    }
    return this._p;
  }

  public set p(p: Intent) {
    this._p = p;
  }

  public get id(): string {
    if (this._id === undefined) {
      throw new Error("link id is undefined");
    }
    return this._id;
  }

  public set id(v: string) {
    this._id = v;
  }

  public get from(): Interface {
    if (this._from === undefined) {
      throw new Error("from interface is undefined");
    }
    return this._from;
  }

  public set from(v: Interface) {
    this._from = v;
  }

  public get to(): Interface {
    if (this._to === undefined) {
      throw new Error("to interface is undefined");
    }
    return this._to;
  }

  public set to(v: Interface) {
    this._to = v;
  }

  public toJSON() {
    return {
      from: this.from,
      to: this.to,
    };
  }

  public clone(clonedP: Intent): Link {
    const fromNode = clonedP.findNodeById(this.from.p.id);
    const toNode = clonedP.findNodeById(this.to.p.id);
    if (fromNode === undefined || toNode === undefined) {
      throw new Error("not found node");
    }
    const fromI = fromNode.findInterface(this.from.name);
    const toI = toNode.findInterface(this.to.name);
    if (fromI === undefined || toI === undefined) {
      throw new Error("not found interface");
    }
    return new Link(clonedP, fromI, toI);
  }
}
