import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Line, Stage, Text } from "react-konva";
import { Stage as StageDOM } from "konva/lib/Stage";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Box } from "@mui/system";
import styled from "@emotion/styled";
import { Node as NodeIntent, Link as LinkIntent } from "models/intent";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  contextMenuState,
  createInterfaceModalState,
  createLinkState,
  createNodeModalState,
  drawCreateLinkState,
  editNodeModalState,
  linkNodeMenuState,
  modeState,
  newIntentDialogState,
  routerNodeMapState,
  routerNodeMenuState,
} from "state";
import Toolbar from "./Toolbar";
import LinkNode, { LinkNodeData } from "./LinkNode";
import RouterNode, { RouterNodeData } from "./RouterNode";
import RouterNodeMenu from "./RouterNodeMenu";
import CreateLinkModal from "components/modals/CreateLinkModal";
import CreateNodeModal from "components/modals/CreateNodeModal";
import CreateInterfaceModal from "components/modals/CreateInterfaceModal";
import bgImg from "assets/images/bg.png";
import LinkNodeMenu from "./LinkNodeMenu";
import CanvasData from "models/canvas";
import ContextMenu from "./ContextMenu";
import BasicProjectManager from "libs/projectManager/basicProjectManager";
import BatfishL1topoProjectManager from "libs/projectManager/BatfishL1topoProjectManager";
import NewIntentDialog from "./NewIntentDialog";
import EditNodeModal from "components/modals/EditNodeModal";
import useIntent from "hooks/useIntent";
type LinkNodeMap = Map<string, LinkNodeData>;

const Wrapper = styled(Box)({
  width: "100%",
  height: "100%",
  backgroundImage: `url(${bgImg})`,
  backgroundSize: "contain",
  backgroundRepeat: "repeat",
});

const DraftingBoard: React.FC = () => {
  const { intent, removeLink, loadIntent, resetIntent } = useIntent();
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageDOM>(null);
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuState);
  const resetContextMenu = useResetRecoilState(contextMenuState);
  const [routerNodeMap, setRouterNodeMap] = useRecoilState(routerNodeMapState);
  const resetRouterNodeMap = useResetRecoilState(routerNodeMapState);
  const [linkNodeMap, setLinkNodeMap] = useState<LinkNodeMap>(new Map());
  const [mousePos, setMousePos] = useState<Vector2d>({ x: 0, y: 0 });
  const mode = useRecoilValue(modeState);
  const [createLink, setCreateLink] = useRecoilState(createLinkState);
  const [linkNodeMenu, setLinkNodeMenu] = useRecoilState(linkNodeMenuState);
  const resetLinkNodeMenu = useResetRecoilState(linkNodeMenuState);

  const [createNodeModal, setCreateNodeModalState] =
    useRecoilState(createNodeModalState);
  const createInterfaceModal = useRecoilValue(createInterfaceModalState);
  const [routerNodeMenu, setRouterNodeMenu] =
    useRecoilState(routerNodeMenuState);
  const [drawCreateLink, setDrawCreateLink] =
    useRecoilState(drawCreateLinkState);
  const resetDrawCreateLink = useResetRecoilState(drawCreateLinkState);
  const [newIntentDialog, setNewIntentDialog] =
    useRecoilState(newIntentDialogState);
  const resetNewIntentDialog = useResetRecoilState(newIntentDialogState);
  const editNodeModal = useRecoilValue(editNodeModalState);

  const updateRouterNodePos = (nodeId: string, pos: Vector2d) => {
    const targetNode = routerNodeMap.get(nodeId);
    if (!targetNode) return;
    const newMap: Map<string, RouterNodeData> = new Map(routerNodeMap);
    const connPos: Vector2d = { x: pos.x + 50, y: pos.y + (100 + 20) / 2 };
    newMap.set(nodeId, { ...targetNode, pos: pos, connPos: connPos });
    setRouterNodeMap(newMap);
  };

  const syncRouterNodeMapWithIntent = (nodes: NodeIntent[]) => {
    const newMap: Map<string, RouterNodeData> = new Map();
    nodes.map((node, idx) => {
      const targetNode = routerNodeMap.get(node.id);
      if (targetNode) {
        newMap.set(node.id, { ...targetNode, node: node });
      } else {
        const initX = 100 * (idx + 1);
        const initY = 100;
        const initConnX = initX + 50;
        const initConnY = initY + (100 + 20) / 2;
        newMap.set(node.id, {
          node: node,
          pos: { x: initX, y: initY },
          connPos: { x: initConnX, y: initConnY },
        });
      }
    });
    setRouterNodeMap(newMap);
  };

  const syncLinkNodeMapWithIntent = (links: LinkIntent[]) => {
    const newLinkMap: Map<string, LinkNodeData> = new Map();
    links.map((link) => {
      const fromNodeId = link.from.p.id;
      const toNodeId = link.to.p.id;
      const key = fromNodeId + toNodeId;
      const fromNode = routerNodeMap.get(fromNodeId);
      const toNode = routerNodeMap.get(toNodeId);
      if (!(fromNode && toNode)) return;
      const data = newLinkMap.get(key);
      if (data !== undefined) {
        newLinkMap.set(key, {
          ...data,
          links: [...data.links, link],
        });
      } else {
        newLinkMap.set(key, {
          fromPos: fromNode.connPos,
          toPos: toNode.connPos,
          links: [link],
        });
      }
    });
    setLinkNodeMap(newLinkMap);
  };

  const renderRouterNodes = useMemo(() => {
    return Array.from(routerNodeMap.values()).map((routerNodeData) => {
      return (
        <RouterNode
          data={routerNodeData}
          draggable={mode.currentMode === "View"}
          onChangePos={(newPos) => {
            updateRouterNodePos(routerNodeData.node.id, newPos);
          }}
          onMouseDown={() => {
            setDrawCreateLink({
              ...drawCreateLink,
              isDrawing: true,
              drawingStartPos: routerNodeData.connPos,
            });
            if (mode.currentMode === "CreateLink") {
              setCreateLink({
                fromNode: routerNodeData.node,
                toNode: null,
              });
            }
          }}
          onMouseUp={() => {
            resetDrawCreateLink();
            if (mode.currentMode === "CreateLink") {
              if (createLink.fromNode) {
                setCreateLink({
                  ...createLink,
                  toNode: routerNodeData.node,
                });
              }
            }
          }}
          onContextMenu={(e) => {
            const stage = e.target.getStage();
            if (!stage) return;
            const pos = stage.getPointerPosition();
            if (!pos) return;
            setRouterNodeMenu({
              isOpen: true,
              node: routerNodeData.node,
              pos: { x: pos.x - 30, y: pos.y + 30 },
            });
          }}
          key={`RouterNode-${routerNodeData.node.id}`}
        />
      );
    });
  }, [routerNodeMap, mode, createLink]);

  const renderLinkNodes = useMemo(() => {
    return Array.from(linkNodeMap.entries()).map(([key, linkNodeData]) => {
      return (
        <LinkNode
          data={linkNodeData}
          onLineContextMenu={(evt) => {
            const stage = evt.target.getStage();
            if (!stage) return;
            const pos = stage.getPointerPosition();
            if (!pos) return;
            setLinkNodeMenu({
              isOpen: true,
              links: linkNodeData.links,
              pos: pos,
            });
          }}
          key={`LinkNode-${key}`}
        />
      );
    });
  }, [linkNodeMap]);

  const renderCreateLinkModal = useMemo(() => {
    if (createLink.fromNode && createLink.toNode) {
      return (
        <CreateLinkModal
          isOpen={true}
          fromNode={createLink.fromNode}
          toNode={createLink.toNode}
        />
      );
    }
    return null;
  }, [createLink]);

  const renderDrawingCreateLink = useMemo(() => {
    if (
      drawCreateLink.isDrawing &&
      drawCreateLink.drawingPointerPos &&
      drawCreateLink.drawingStartPos
    ) {
      return (
        <Line
          stroke="red"
          strokeWidth={10}
          points={[
            drawCreateLink.drawingStartPos.x,
            drawCreateLink.drawingStartPos.y,
            drawCreateLink.drawingPointerPos.x - 5,
            drawCreateLink.drawingPointerPos.y - 5,
          ]}
        />
      );
    } else {
      return null;
    }
  }, [drawCreateLink]);

  const renderRouterNodeMenu = useMemo(() => {
    if (
      !routerNodeMenu.isOpen ||
      routerNodeMenu.pos === null ||
      routerNodeMenu.node === null
    )
      return null;
    return (
      <RouterNodeMenu node={routerNodeMenu.node} pos={routerNodeMenu.pos} />
    );
  }, [routerNodeMenu]);

  const renderCreateInterfaceModal = useMemo(() => {
    if (!createInterfaceModal.isOpen || createInterfaceModal.node === null)
      return null;
    return (
      <CreateInterfaceModal
        isOpen={createInterfaceModal.isOpen}
        node={createInterfaceModal.node}
      />
    );
  }, [createInterfaceModal]);

  const renderLinkNodeMenu = useMemo(() => {
    if (linkNodeMenu.isOpen && linkNodeMenu.pos) {
      return (
        <LinkNodeMenu
          pos={linkNodeMenu.pos}
          links={linkNodeMenu.links}
          onClickRemoveLink={(targetLinkId) => {
            removeLink(targetLinkId);
            resetLinkNodeMenu();
          }}
        />
      );
    }
    return null;
  }, [linkNodeMenu]);

  useEffect(() => {
    syncRouterNodeMapWithIntent(intent.nodes);
    syncLinkNodeMapWithIntent(intent.links);
  }, [intent]);

  useEffect(() => {
    syncLinkNodeMapWithIntent(intent.links);
  }, [routerNodeMap]);

  const onMouseDownHandler = () => {
    resetLinkNodeMenu();
  };
  const onMouseMove = () => {
    const stage = stageRef.current?.getStage();
    if (stage === undefined) return;
    const pointerPos = stage.getPointerPosition() ?? { x: 0, y: 0 };
    setMousePos(pointerPos);
    if (mode.currentMode === "CreateLink" && drawCreateLink.isDrawing) {
      setDrawCreateLink({
        ...drawCreateLink,
        drawingPointerPos: pointerPos,
      });
    }
  };
  const onMouseUpHandler = () => {
    resetDrawCreateLink();
  };

  const onClickDownloadIntent = () => {
    const projectManager = new BasicProjectManager();
    const canvasData = new CanvasData();
    Array.from(routerNodeMap.values()).map((routerNode) => {
      canvasData.routerNodeMap.set(routerNode.node.id, {
        nodeId: routerNode.node.id,
        pos: routerNode.pos,
        connPos: routerNode.connPos,
      });
    });
    const fileData = projectManager.exportToJSON({
      intent: intent,
      canvas: canvasData,
    });
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = "intent-" + intent.id + ".json";
    aTag.click();
  };
  const onClickUploadIntent = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target === null) return;
      if (typeof e.target.result === "string") {
        const projectManager = new BasicProjectManager();
        const project = projectManager.importFromJSON(e.target.result);
        const newMap: Map<string, RouterNodeData> = new Map();
        if (project.canvas) {
          Array.from(project.canvas.routerNodeMap.values()).map(
            (routerNode) => {
              const target = project.intent.findNodeById(routerNode.nodeId);
              if (target === undefined) return;
              newMap.set(target.id, {
                node: target,
                pos: routerNode.pos,
                connPos: routerNode.connPos,
              });
            }
          );
        }
        loadIntent(project.intent);
        setRouterNodeMap(newMap);
      }
    };
    fileReader.readAsText(file);
  };

  const onClickDownloadBatfishL1topo = () => {
    const projectManager = new BatfishL1topoProjectManager();
    const canvasData = new CanvasData();
    Array.from(routerNodeMap.values()).map((routerNode) => {
      canvasData.routerNodeMap.set(routerNode.node.id, {
        nodeId: routerNode.node.id,
        pos: routerNode.pos,
        connPos: routerNode.connPos,
      });
    });
    const fileData = projectManager.exportToJSON({
      intent: intent,
      canvas: canvasData,
    });
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = "layer1_topology.json";
    aTag.click();
  };
  const onClickUploadBatfishL1topo = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target === null) return;
      if (typeof e.target.result === "string") {
        const projectManager = new BatfishL1topoProjectManager();
        const project = projectManager.importFromJSON(e.target.result);
        const newMap: Map<string, RouterNodeData> = new Map();
        if (project.canvas) {
          Array.from(project.canvas.routerNodeMap.values()).map(
            (routerNode) => {
              const target = project.intent.findNodeById(routerNode.nodeId);
              if (target === undefined) return;
              newMap.set(target.id, {
                node: target,
                pos: routerNode.pos,
                connPos: routerNode.connPos,
              });
            }
          );
        }
        loadIntent(project.intent);
        setRouterNodeMap(newMap);
      }
    };
    fileReader.readAsText(file);
  };

  const onClickNewIntent = () => {
    setNewIntentDialog({ isOpen: true });
  };

  const onClickAddNodeMenu = () => {
    setCreateNodeModalState({ isOpen: true });
  };

  const renderContextMenu = useMemo(() => {
    if (contextMenu.isOpen && contextMenu.pos) {
      return (
        <ContextMenu
          pos={contextMenu.pos}
          onClickNewIntentMenu={onClickNewIntent}
          onClickAddNodeMenu={onClickAddNodeMenu}
          onClickExportIntentMenu={onClickDownloadIntent}
          onClickImportIntentMenu={onClickUploadIntent}
          onClickExportBatfishL1topoMenu={onClickDownloadBatfishL1topo}
          onClickImportBatfishL1topoMenu={onClickUploadBatfishL1topo}
        />
      );
    } else {
      return null;
    }
  }, [contextMenu]);

  const renderCreateNodeModal = useMemo(() => {
    return <CreateNodeModal isOpen={createNodeModal.isOpen} />;
  }, [createNodeModal]);

  const onContextMenuHandler = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    if (e.target !== e.currentTarget) return;
    const pos: Vector2d = { x: e.evt.x, y: e.evt.y };
    setContextMenu({
      isOpen: true,
      pos: pos,
    });
    document.body.addEventListener("click", () => {
      resetContextMenu();
    });
  };

  const renderNewIntentDialog = useMemo(() => {
    return (
      <NewIntentDialog
        isOpen={newIntentDialog.isOpen}
        onCreateNewIntent={() => {
          resetIntent();
          resetRouterNodeMap();
          resetNewIntentDialog();
        }}
        onCancel={() => {
          resetNewIntentDialog();
        }}
      />
    );
  }, [newIntentDialog]);

  const renderEditNodeModal = useMemo(() => {
    if (editNodeModal.node === null) return;
    return (
      <EditNodeModal isOpen={editNodeModal.isOpen} node={editNodeModal.node} />
    );
  }, [editNodeModal]);

  return (
    <Wrapper ref={ref}>
      <Stage
        ref={stageRef}
        width={ref.current?.clientWidth}
        height={ref.current?.clientHeight}
        onMouseDown={onMouseDownHandler}
        onMouseup={onMouseUpHandler}
        onMouseMove={onMouseMove}
        onContextMenu={onContextMenuHandler}
      >
        <Layer>
          <Text text={`{x: ${mousePos.x}, y:${mousePos.y}}`} x={0} y={0} />
          {renderRouterNodes}
          {renderLinkNodes}
          {renderDrawingCreateLink}
        </Layer>
      </Stage>
      {renderCreateNodeModal}
      {renderEditNodeModal}
      {renderCreateLinkModal}
      {renderCreateInterfaceModal}
      {renderRouterNodeMenu}
      {renderLinkNodeMenu}
      {renderContextMenu}
      {renderNewIntentDialog}
      <Toolbar />
    </Wrapper>
  );
};

export default DraftingBoard;
