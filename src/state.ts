import { Vector2d } from "konva/lib/types";
import { Intent, Interface, Link, Node } from "models/intent";
import { atom } from "recoil";

export type Mode = "View" | "CreateLink";

type ModeState = {
  currentMode: Mode;
};

type ModalProps = {
  isOpen: boolean;
  pos: Vector2d | null;
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

export const linkDetailModelState = atom<
  ModalProps & { targetLink: Link | null }
>({
  key: "LinkDetailModalState",
  default: {
    isOpen: false,
    pos: null,
    targetLink: null,
  },
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
