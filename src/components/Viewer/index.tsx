import React, { useEffect, useMemo, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { Intent, Node as NodeIntent, Link as LinkIntent } from "models/intent";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  createLinkState,
  createNodeModalState,
  drawCreateLinkState,
  intentState,
  linkDetailModelState,
  modeState,
} from "state";
import Toolbar from "./Toolbar";
import LinkDetail from "./LinkDetail";
import LinkNode, { LinkNodeData } from "./LinkNode";
import { Vector2d } from "konva/lib/types";
import RouterNode, { RouterNodeData } from "./RouterNode";
import CreateLinkModal from "./CreateLinkModal";
import CreateNodeModal from "./CreateNodeModal";

type RouterNodeMap = Map<string, RouterNodeData>;
type LinkNodeMap = Map<string, LinkNodeData>;

const Viewer: React.FC = () => {
  const [intent, setIntent] = useRecoilState(intentState);
  const mode = useRecoilValue(modeState);
  const [routerNodeMap, setRouterNodeMap] = useState<RouterNodeMap>(new Map());
  const [linkNodeMap, setLinkNodeMap] = useState<LinkNodeMap>(new Map());
  const [createLink, setCreateLink] = useRecoilState(createLinkState);
  const [linkDetailModal, setLinkDetailModal] =
    useRecoilState(linkDetailModelState);
  const createNodeModal = useRecoilValue(createNodeModalState);
  const [mousePos, setMousePos] = useState<Vector2d>({ x: 0, y: 0 });
  const [drawCreateLink, setDrawCreateLink] =
    useRecoilState(drawCreateLinkState);
  const resetDrawCreateLink = useResetRecoilState(drawCreateLinkState);

  const updateRouterNodePos = (nodeId: string, pos: Vector2d) => {
    const targetNode = routerNodeMap.get(nodeId);
    if (!targetNode) return;
    const newMap: Map<string, RouterNodeData> = new Map(routerNodeMap);
    const connPos: Vector2d = { x: pos.x + 50, y: pos.y + (100 + 20) / 2 };
    newMap.set(nodeId, { ...targetNode, pos: pos, connPos: connPos });
    setRouterNodeMap(newMap);
  };

  const syncRouterNodeMapWithIntent = (nodes: NodeIntent[]) => {
    console.log("called syncRouterNodeMapWithIntent");
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
    console.log("called syncLinkNodeMapWithIntent");
    const newMap: Map<string, LinkNodeData> = new Map(linkNodeMap);
    links.map((link) => {
      const fromRouterNode = routerNodeMap.get(link.from.p.id);
      const toRouterNode = routerNodeMap.get(link.to.p.id);
      if (fromRouterNode && toRouterNode) {
        newMap.set(link.id, {
          link: link,
          fromPos: fromRouterNode.connPos,
          toPos: toRouterNode.connPos,
        });
      }
    });
    setLinkNodeMap(newMap);
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
          onMouseDown={(e) => {
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
          onMouseUp={(e) => {
            resetDrawCreateLink;
            if (mode.currentMode === "CreateLink") {
              if (createLink.fromNode) {
                setCreateLink({
                  ...createLink,
                  toNode: routerNodeData.node,
                });
              }
            }
          }}
          key={`RouterNode-${routerNodeData.node.id}`}
        />
      );
    });
  }, [routerNodeMap, mode, createLink]);

  const renderLinkNodes = useMemo(() => {
    return Array.from(linkNodeMap.values()).map((linkNodeData) => {
      return (
        <LinkNode
          data={linkNodeData}
          key={`LinkNode-${linkNodeData.link.id}`}
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

  useEffect(() => {
    console.log("useEffect trigger: intent");
    syncRouterNodeMapWithIntent(intent.nodes);
    syncLinkNodeMapWithIntent(intent.links);
  }, [intent]);

  useEffect(() => {
    console.log("useEffect trigger: routerNodeMap");
    syncLinkNodeMapWithIntent(intent.links);
  }, [routerNodeMap]);
  useEffect(() => {
    console.log("useEffect trigger: linkNodeMap");
  }, [linkNodeMap]);

  return (
    <>
      <div>Debug: {`{x: ${mousePos.x}, y:${mousePos.y}}`}</div>
      <pre>Pos: {JSON.stringify(createLink)}</pre>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={(evt) => {
          setLinkDetailModal({
            isOpen: false,
            targetLink: null,
            pos: null,
          });
        }}
        onMouseMove={(evt) => {
          const stage = evt.target.getStage();
          setMousePos(stage?.getPointerPosition() ?? { x: 0, y: 0 });
          if (
            mode.currentMode === "CreateLink" &&
            drawCreateLink.isDrawing &&
            stage
          ) {
            setDrawCreateLink({
              ...drawCreateLink,
              drawingPointerPos: stage.getPointerPosition(),
            });
          }
        }}
        onMouseup={() => {
          resetDrawCreateLink();
        }}
      >
        <Layer>
          {renderRouterNodes}
          {renderLinkNodes}
          {renderDrawingCreateLink}
        </Layer>
      </Stage>
      {renderCreateLinkModal}
      <Toolbar />
      <CreateNodeModal isOpen={createNodeModal.isOpen} />
      {linkDetailModal.isOpen && linkDetailModal.pos && (
        <LinkDetail
          pos={linkDetailModal.pos}
          onClickRemoveLink={() => {
            const targetLink = linkDetailModal.targetLink;
            if (targetLink) {
              const newIntent = new Intent(
                intent.id,
                intent.nodes,
                intent.links
              );
              newIntent.removeLink(targetLink.id);
              setIntent(newIntent);
              setLinkDetailModal({
                isOpen: false,
                targetLink: null,
                pos: null,
              });
            }
          }}
        />
      )}
    </>
  );
};

export default Viewer;
