import { Vector2d } from "konva/lib/types";

export type RouterNodeData = {
  nodeId: string;
  pos: Vector2d;
  connPos: Vector2d;
};

export type SerializedCanvasData = {
  routerNodeMap: [string, RouterNodeData][];
};

export default class CanvasData {
  routerNodeMap: Map<string, RouterNodeData>;
  constructor(routerNodeMap: Map<string, RouterNodeData> = new Map()) {
    this.routerNodeMap = routerNodeMap;
  }
  public toJSON(): SerializedCanvasData {
    return {
      routerNodeMap: Array.from(this.routerNodeMap),
    };
  }
}
