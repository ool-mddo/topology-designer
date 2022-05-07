import { RouterNodeData } from "components/DraftingBoard/RouterNode";
import { Vector2d } from "konva/lib/types";
import { Intent, Link, Node } from "models/intent";
import { atom } from "recoil";

export type Mode = "View" | "CreateLink";

type ModeState = {
  currentMode: Mode;
};

type CreateLinkState = {
  fromNode: Node | null;
  toNode: Node | null;
};

type DrawState = {
  isDrawing: boolean;
  drawingStartPos: Vector2d | null;
  drawingPointerPos: Vector2d | null;
};

export const modeState = atom<ModeState>({
  key: "ModeState",
  default: {
    currentMode: "View",
  },
});

type RouterNodeMap = Map<string, RouterNodeData>;

export const routerNodeMapState = atom<RouterNodeMap>({
  key: "routerNodeMap",
  default: new Map(),
});

export const drawCreateLinkState = atom<DrawState>({
  key: "DrawCreateLinkState",
  default: {
    isDrawing: false,
    drawingStartPos: null,
    drawingPointerPos: null,
  },
});

export const createLinkState = atom<CreateLinkState>({
  key: "CreateLinkState",
  default: {
    fromNode: null,
    toNode: null,
  },
});

export const intentState = atom<Intent>({
  key: "IntentState",
  default: new Intent("init"),
});

type CreateNodeModalState = {
  isOpen: boolean;
};

export const createNodeModalState = atom<CreateNodeModalState>({
  key: "CreateNodeModalState",
  default: {
    isOpen: false,
  },
});

export const routerNodeMenuState = atom<{
  isOpen: boolean;
  node: Node | null;
  pos: Vector2d | null;
}>({
  key: "RouterNodeMenuState",
  default: {
    isOpen: false,
    node: null,
    pos: null,
  },
});

export const linkNodeMenuState = atom<{
  isOpen: boolean;
  link: Link | null;
  pos: Vector2d | null;
}>({
  key: "LinkNodeMenuState",
  default: {
    isOpen: false,
    link: null,
    pos: null,
  },
});

export const createInterfaceModalState = atom<{
  isOpen: boolean;
  node: Node | null;
}>({
  key: "CreateIFModalState",
  default: {
    isOpen: false,
    node: null,
  },
});
