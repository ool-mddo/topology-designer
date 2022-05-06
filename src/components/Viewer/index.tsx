import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Line, Stage, Text } from "react-konva";
import { Stage as StageDOM } from "konva/lib/Stage";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Box } from "@mui/system";
import styled from "@emotion/styled";
import { Intent, Node as NodeIntent, Link as LinkIntent } from "models/intent";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  createInterfaceModalState,
  createLinkState,
  createNodeModalState,
  drawCreateLinkState,
  intentState,
  linkNodeMenuState,
  modeState,
  routerNodeMenuState,
} from "state";
import Toolbar from "./Toolbar";
import LinkNode, { LinkNodeData } from "./LinkNode";
import RouterNode, { RouterNodeData } from "./RouterNode";
import RouterNodeMenu from "./RouterNodeMenu";
import CreateLinkModal from "./CreateLinkModal";
import CreateNodeModal from "./CreateNodeModal";
import CreateInterfaceModal from "./CreateInterfaceModal";
import bgImg from "assets/images/bg.png";
import LinkNodeMenu from "./LinkNodeMenu";
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
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageDOM>(null);
  const [routerNodeMap, setRouterNodeMap] = useState<RouterNodeMap>(new Map());
  const [linkNodeMap, setLinkNodeMap] = useState<LinkNodeMap>(new Map());
  const [mousePos, setMousePos] = useState<Vector2d>({ x: 0, y: 0 });
  const [intent, setIntent] = useRecoilState(intentState);
  const mode = useRecoilValue(modeState);
  const [createLink, setCreateLink] = useRecoilState(createLinkState);
  const [linkNodeMenu, setLinkNodeMenu] = useRecoilState(linkNodeMenuState);
  const resetLinkNodeMenu = useResetRecoilState(linkNodeMenuState);
  const createNodeModal = useRecoilValue(createNodeModalState);
  const createInterfaceModal = useRecoilValue(createInterfaceModalState);
  const [routerNodeMenu, setRouterNodeMenu] =
    useRecoilState(routerNodeMenuState);
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
          onLineContextMenu={(evt) => {
            const stage = evt.target.getStage();
            if (!stage) return;
            const pos = stage.getPointerPosition();
            if (!pos) return;
            setLinkNodeMenu({
              isOpen: true,
              link: linkNodeData.link,
              pos: pos,
            });
          }}
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

  const renderLinkNodeMenu = useMemo(() => {
    if (linkNodeMenu.isOpen && linkNodeMenu.pos) {
      return (
        <LinkNodeMenu
          pos={linkNodeMenu.pos}
          onClickRemoveLink={() => {
            const targetLink = linkNodeMenu.link;
            if (targetLink) {
              const newIntent = new Intent(
                intent.id,
                intent.nodes,
                intent.links
              );
              newIntent.removeLink(targetLink.id);
              setIntent(newIntent);
              resetLinkNodeMenu();
            }
          }}
        />
      );
    }
    return null;
  }, [linkNodeMenu]);

  useEffect(() => {
    console.log("useEffect trigger: intent");
    syncRouterNodeMapWithIntent(intent.nodes);
    syncLinkNodeMapWithIntent(intent.links);
  }, [intent]);

  useEffect(() => {
    console.log("useEffect trigger: routerNodeMap");
    syncLinkNodeMapWithIntent(intent.links);
  }, [routerNodeMap]);

  const onMouseDownHandler = (evt: KonvaEventObject<MouseEvent>) => {
    resetLinkNodeMenu();
  };
  const onMouseMove = (evt: KonvaEventObject<MouseEvent>) => {
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
  const onMouseUpHandler = (evt: KonvaEventObject<MouseEvent>) => {
    resetDrawCreateLink();
  };

  const onClickDownloadIntent = () => {
    console.log("onClickDownloadIntent");
    if (stageRef.current === null) return;
    const fileData = stageRef.current.toJSON();
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = "intent-" + intent.id + ".json";
    aTag.click();
  };

  return (
    <Wrapper ref={ref}>
      <Stage
        ref={stageRef}
        width={ref.current?.clientWidth}
        height={ref.current?.clientHeight}
        onMouseDown={onMouseDownHandler}
        onMouseup={onMouseUpHandler}
        onMouseMove={onMouseMove}
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
      {renderLinkNodeMenu}
      <Toolbar onClickDownload={onClickDownloadIntent} />
    </Wrapper>
  );
};

export default Viewer;
