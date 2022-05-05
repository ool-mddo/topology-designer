import React, { FC, useMemo } from "react";
import { Vector2d } from "konva/lib/types";
import { Group, Text, Image } from "react-konva";
import useImage from "use-image";
import RouterImg from "assets/images/router.png";
import { Node } from "models/intent";
import { KonvaEventObject } from "konva/lib/Node";

export type RouterNodeData = {
  node: Node;
  pos: Vector2d;
  connPos: Vector2d;
};

type Props = {
  data: RouterNodeData;
  draggable?: boolean;
  onChangePos?: (pos: Vector2d) => void;
  onMouseUp?: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseDown?: (e: KonvaEventObject<MouseEvent>) => void;
};

const RouterNode: FC<Props> = ({
  data,
  onChangePos,
  onMouseUp,
  onMouseDown,
  draggable = false,
}) => {
  console.log("[render] RouterNode");
  const { node, pos } = data;
  const nodeWidth = 100;
  const nodeHeight = 100;
  const nodeNameHeight = 20;
  const [routerIcon] = useImage(RouterImg);
  const routerIconSize = 50;
  const routerIconPos: Vector2d = {
    x: (nodeWidth - routerIconSize) / 2,
    y: (nodeHeight + nodeNameHeight - routerIconSize) / 2,
  };
  const onDragMoveHandler = (e: KonvaEventObject<DragEvent>) => {
    e.target.preventDefault();
    if (onChangePos) {
      onChangePos(e.target.getPosition());
    }
  };
  const onMouseUpHandler = (e: KonvaEventObject<MouseEvent>) => {
    console.log("onMouseDownHandler");
    e.target.preventDefault();
    if (onMouseUp) {
      onMouseUp(e);
    }
  };
  const onMouseDownHandler = (e: KonvaEventObject<MouseEvent>) => {
    e.target.preventDefault();
    console.log("onMouseDownHandler");
    if (onMouseDown) {
      onMouseDown(e);
    }
  };
  return (
    <Group
      x={pos.x}
      y={pos.y}
      width={nodeWidth}
      height={nodeHeight}
      onDragMove={onDragMoveHandler}
      onMouseDown={onMouseDownHandler}
      onMouseUp={onMouseUpHandler}
      draggable={draggable}
    >
      <Text
        text={node.name}
        width={nodeWidth}
        align="center"
        height={nodeNameHeight}
        verticalAlign="middle"
      />
      <Image
        image={routerIcon}
        x={routerIconPos.x}
        y={routerIconPos.y}
        width={routerIconSize}
        height={routerIconSize}
      />
    </Group>
  );
};

export default RouterNode;
