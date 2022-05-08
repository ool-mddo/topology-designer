import React, { FC, useMemo } from "react";
import { Vector2d } from "konva/lib/types";
import { Link } from "models/intent";
import { Circle, Group, Label, Line, Tag, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

export type LinkNodeData = {
  link: Link;
  fromPos: Vector2d;
  toPos: Vector2d;
};

type Props = {
  data: LinkNodeData;
  onLineContextMenu?: (evt: KonvaEventObject<PointerEvent>) => void;
};

const LinkNode: FC<Props> = ({ data, onLineContextMenu }) => {
  const { link, fromPos, toPos } = data;
  const tagHeight = 20;
  const tagWidth = 100;
  const offsetY = 35;
  const nodeIconR = 25;
  const linkAddress: string = useMemo(() => {
    const fromIpv4Addr = data.link.from.ipv4Addr;
    const toIpv4Addr = data.link.to.ipv4Addr;
    if (fromIpv4Addr && toIpv4Addr) {
      return fromIpv4Addr;
    }
    return "";
  }, [data.link.from.ipv4Addr, data.link.to.ipv4Addr]);
  const fromIFAddress = useMemo(() => {
    return link.from.ipv4Addr ?? "";
  }, [link.from.ipv4Addr]);
  const toIFAddress = useMemo(() => {
    return link.to.ipv4Addr ?? "";
  }, [link.to.ipv4Addr]);
  const rotation = useMemo(() => {
    return Math.atan((toPos.y - fromPos.y) / (toPos.x - fromPos.x));
  }, [fromPos, toPos]);
  const isFromBase = useMemo(() => {
    return fromPos.x < toPos.x;
  }, [fromPos, toPos]);
  const horizontalHosei: Vector2d = useMemo(() => {
    const absRotation = Math.abs(rotation);
    if (rotation >= 0) {
      return { x: Math.cos(absRotation), y: +Math.sin(absRotation) };
    } else {
      return { x: Math.cos(absRotation), y: -Math.sin(absRotation) };
    }
  }, [rotation]);
  const verticalHosei: Vector2d = useMemo(() => {
    const absRotation = Math.abs(rotation);
    if (rotation >= 0) {
      return { x: -Math.sin(absRotation), y: Math.cos(absRotation) };
    } else {
      return { x: Math.sin(absRotation), y: Math.cos(absRotation) };
    }
  }, [rotation]);
  const basePos: Vector2d = useMemo(() => {
    if (isFromBase) {
      return {
        x: fromPos.x - offsetY * verticalHosei.x,
        y: fromPos.y - offsetY * verticalHosei.y,
      };
    } else {
      return {
        x: fromPos.x - offsetY * verticalHosei.x,
        y: fromPos.y - offsetY * verticalHosei.y,
      };
    }
  }, [fromPos, verticalHosei]);

  const fromIFNamePos: Vector2d = useMemo(() => {
    if (isFromBase) {
      return {
        x: nodeIconR * horizontalHosei.x,
        y: nodeIconR * horizontalHosei.y,
      };
    } else {
      return {
        x: -1 * (tagWidth + nodeIconR) * horizontalHosei.x,
        y: -1 * (tagWidth + nodeIconR) * horizontalHosei.y,
      };
    }
  }, [horizontalHosei, isFromBase]);

  const fromIFAddressPos: Vector2d = useMemo(() => {
    if (isFromBase) {
      return {
        x:
          nodeIconR * horizontalHosei.x +
          (2 * offsetY - tagHeight) * verticalHosei.x,
        y:
          nodeIconR * horizontalHosei.y +
          (2 * offsetY - tagHeight) * verticalHosei.y,
      };
    } else {
      return {
        x:
          -1 * (tagWidth + nodeIconR) * horizontalHosei.x +
          (2 * offsetY - tagHeight) * verticalHosei.x,
        y:
          -1 * (tagWidth + nodeIconR) * horizontalHosei.y +
          (2 * offsetY - tagHeight) * verticalHosei.y,
      };
    }
  }, [fromPos, verticalHosei, horizontalHosei]);

  const toIFAddressPos: Vector2d = useMemo(() => {
    if (isFromBase) {
      return {
        x:
          toPos.x -
          fromPos.x -
          (nodeIconR + tagWidth) * horizontalHosei.x +
          (2 * offsetY - tagHeight) * verticalHosei.x,
        y:
          toPos.y -
          fromPos.y -
          (nodeIconR + tagWidth) * horizontalHosei.y +
          (2 * offsetY - tagHeight) * verticalHosei.y,
      };
    } else {
      return {
        x:
          toPos.x -
          fromPos.x +
          nodeIconR * horizontalHosei.x +
          (2 * offsetY - tagHeight) * verticalHosei.x,
        y:
          toPos.y -
          fromPos.y +
          nodeIconR * horizontalHosei.y +
          (2 * offsetY - tagHeight) * verticalHosei.y,
      };
    }
  }, [fromPos, verticalHosei, horizontalHosei]);

  const toIFNamePos: Vector2d = useMemo(() => {
    if (isFromBase) {
      return {
        x:
          toPos.x -
          fromPos.x -
          tagWidth * horizontalHosei.x -
          nodeIconR * horizontalHosei.x,
        y:
          toPos.y -
          fromPos.y -
          tagWidth * horizontalHosei.y -
          nodeIconR * horizontalHosei.y,
      };
    } else {
      return {
        x: toPos.x - fromPos.x + nodeIconR * horizontalHosei.x,
        y: toPos.y - fromPos.y + nodeIconR * horizontalHosei.y,
      };
    }
  }, [fromPos, toPos, horizontalHosei, isFromBase]);
  const addressPos: Vector2d = useMemo(() => {
    return {
      x:
        (toPos.x - fromPos.x) / 2 +
        2 * offsetY * verticalHosei.x -
        tagHeight * verticalHosei.x -
        (tagWidth / 2) * horizontalHosei.x,
      y:
        (toPos.y - fromPos.y) / 2 +
        2 * offsetY * verticalHosei.y -
        tagHeight * verticalHosei.y -
        (tagWidth / 2) * horizontalHosei.y,
    };
  }, [fromPos, toPos, horizontalHosei, verticalHosei]);
  const points: number[] = useMemo(() => {
    return [
      offsetY * verticalHosei.x,
      offsetY * verticalHosei.y,
      offsetY * verticalHosei.x + (toPos.x - fromPos.x),
      offsetY * verticalHosei.y + (toPos.y - fromPos.y),
    ];
  }, [fromPos, toPos, verticalHosei]);
  const onLineContextMenuHandler = (evt: KonvaEventObject<PointerEvent>) => {
    evt.evt.preventDefault();
    if (onLineContextMenu) onLineContextMenu(evt);
  };
  return (
    <Group x={basePos.x} y={basePos.y}>
      <Label
        x={fromIFNamePos.x}
        y={fromIFNamePos.y}
        rotation={(rotation * 180) / Math.PI}
        width={tagWidth}
        align="center"
        height={tagHeight}
        verticalAlign="middle"
      >
        <Tag fill="green" opacity={0.7} />
        <Text
          text={link.from.name}
          fontFamily="Calibri"
          fontSize={15}
          width={tagWidth}
          align="center"
          height={tagHeight}
          verticalAlign="middle"
        />
      </Label>
      <Label
        x={toIFNamePos.x}
        y={toIFNamePos.y}
        rotation={(rotation * 180) / Math.PI}
        width={tagWidth}
        align="center"
        height={tagHeight}
        verticalAlign="middle"
      >
        <Tag fill="green" opacity={0.7} />
        <Text
          text={link.to.name}
          fontFamily="Calibri"
          fontSize={15}
          width={tagWidth}
          align="center"
          height={tagHeight}
          verticalAlign="middle"
        />
      </Label>
      <Text
        text={linkAddress}
        fontSize={15}
        fontStyle="bold"
        x={addressPos.x}
        y={addressPos.y}
        rotation={(rotation * 180) / Math.PI}
        width={tagWidth}
        align="center"
        height={tagHeight}
        verticalAlign="middle"
      />
      <Text
        text={fromIFAddress}
        fontSize={15}
        fontStyle="bold"
        x={fromIFAddressPos.x}
        y={fromIFAddressPos.y}
        rotation={(rotation * 180) / Math.PI}
        width={tagWidth}
        align="center"
        height={tagHeight}
        verticalAlign="middle"
      />
      <Text
        text={toIFAddress}
        fontSize={15}
        fontStyle="bold"
        x={toIFAddressPos.x}
        y={toIFAddressPos.y}
        rotation={(rotation * 180) / Math.PI}
        width={tagWidth}
        align="center"
        height={tagHeight}
        verticalAlign="middle"
      />
      <Line
        stroke="black"
        strokeWidth={5}
        points={points}
        onContextMenu={onLineContextMenuHandler}
      />
      <Circle x={0} y={0} radius={5} fill="red"></Circle>
      <Circle
        x={fromIFNamePos.x}
        y={fromIFNamePos.y}
        radius={5}
        fill="blue"
      ></Circle>
      <Circle
        x={toIFNamePos.x}
        y={toIFNamePos.y}
        radius={5}
        fill="blue"
      ></Circle>
      <Circle
        x={addressPos.x}
        y={addressPos.y}
        radius={5}
        fill="green"
      ></Circle>
      <Circle
        x={toIFAddressPos.x}
        y={toIFAddressPos.y}
        radius={5}
        fill="green"
      ></Circle>
    </Group>
  );
};

export default LinkNode;
