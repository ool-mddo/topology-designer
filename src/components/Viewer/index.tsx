import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Line, Stage, Text } from "react-konva";
import { Intent, Node as NodeIntent, Link as LinkIntent } from "models/intent";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  createInterfaceModalState,
  createLinkState,
  createNodeModalState,
  drawCreateLinkState,
  intentState,
  linkDetailModelState,
  modeState,
  routerNodeMenuState,
} from "state";
import Toolbar from "./Toolbar";
import LinkDetail from "./LinkDetail";
import LinkNode, { LinkNodeData } from "./LinkNode";
import { Vector2d } from "konva/lib/types";
import RouterNode, { RouterNodeData } from "./RouterNode";
import CreateLinkModal from "./CreateLinkModal";
import CreateNodeModal from "./CreateNodeModal";
import RouterNodeMenu from "./RouterNodeMenu";
import CreateInterfaceModal from "./CreateInterfaceModal";
import { Box } from "@mui/system";
import styled from "@emotion/styled";
import bgImg from "assets/images/bg.png";
type RouterNodeMap = Map<string, RouterNodeData>;
type LinkNodeMap = Map<string, LinkNodeData>;

const Wrapper = styled(Box)({
  width: "100%",
  height: "100%",
  backgroundImage: `url(${bgImg})`,
  backgroundSize: "contain",
  backgroundRepeat: "repeat",
});

const Viewer: React.FC = () => {
  const [intent, setIntent] = useRecoilState(intentState);
  const mode = useRecoilValue(modeState);
  const [routerNodeMap, setRouterNodeMap] = useState<RouterNodeMap>(new Map());
  const [linkNodeMap, setLinkNodeMap] = useState<LinkNodeMap>(new Map());
  const [createLink, setCreateLink] = useRecoilState(createLinkState);
  const [linkDetailModal, setLinkDetailModal] =
    useRecoilState(linkDetailModelState);
  const createNodeModal = useRecoilValue(createNodeModalState);
  const createInterfaceModal = useRecoilValue(createInterfaceModalState);
  const [routerNodeMenu, setRouterNodeMenu] =
    useRecoilState(routerNodeMenuState);
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
    const newMap: Map<string, LinkNodeData> = new Map();
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
  const ref = useRef<HTMLDivElement>(null);
  const canvasHeight = useMemo(() => {
    return ref.current?.clientHeight;
  }, [ref.current?.clientHeight]);
  const canvasWidth = useMemo(() => {
    return ref.current?.clientWidth;
  }, [ref.current?.clientWidth]);
  return (
    <Wrapper ref={ref}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
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
          <Text text={`{x: ${mousePos.x}, y:${mousePos.y}}`} x={0} y={0} />
          {renderRouterNodes}
          {renderLinkNodes}
          {renderDrawingCreateLink}
        </Layer>
      </Stage>
      <CreateNodeModal isOpen={createNodeModal.isOpen} />
      {renderCreateLinkModal}
      {renderCreateInterfaceModal}
      {renderRouterNodeMenu}
      <Toolbar />
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
    </Wrapper>
  );
};

export default Viewer;
