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
  const offsetX = 0;
  const offsetY = 40;
  const address = "10.0.10.0/24";
  const fromIFAddress = ".1";
  const toIFAddress = ".2";
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
    return {
      x: fromPos.x - offsetY * verticalHosei.x,
      y: fromPos.y - offsetY * verticalHosei.y,
    };
  }, [fromPos, verticalHosei]);

  const fromIFNamePos: Vector2d = useMemo(() => {
    if (isFromBase) {
      return {
        x: 25 * horizontalHosei.x,
        y: 25 * horizontalHosei.y,
      };
    } else {
      return {
        x: -25 * horizontalHosei.x - tagWidth * horizontalHosei.x,
        y: 25 * horizontalHosei.y,
      };
    }
  }, [horizontalHosei, isFromBase]);

  const toIFNamePos: Vector2d = useMemo(() => {
    if (isFromBase) {
      return {
        x:
          toPos.x -
          fromPos.x -
          tagWidth * horizontalHosei.x -
          25 * horizontalHosei.x,
        y:
          toPos.y -
          fromPos.y -
          tagWidth * horizontalHosei.y -
          25 * horizontalHosei.y,
      };
    } else {
      return {
        x:
          toPos.x -
          fromPos.x -
          tagWidth * horizontalHosei.x +
          25 * horizontalHosei.x +
          tagWidth * horizontalHosei.x,
        y:
          toPos.y -
          fromPos.y -
          tagWidth * horizontalHosei.y -
          25 * horizontalHosei.y,
      };
    }
  }, [fromPos, toPos, horizontalHosei, isFromBase]);
  const linkNamePos: Vector2d = useMemo(() => {
    return {
      x: (toPos.x - fromPos.x) / 2 - (tagWidth / 2) * horizontalHosei.x,
      y: (toPos.y - fromPos.y) / 2 - (tagWidth / 2) * horizontalHosei.y,
    };
  }, [fromPos, toPos, horizontalHosei]);
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
    <>
      <Circle x={basePos.x} y={basePos.y} radius={5} fill="red"></Circle>
      <Group x={basePos.x} y={basePos.y}>
        <Text
          text={link.id}
          x={linkNamePos.x}
          y={linkNamePos.y}
          width={tagWidth}
          align="center"
          height={tagHeight}
          verticalAlign="middle"
          rotation={(rotation * 180) / Math.PI}
        />
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
          text={address}
          x={addressPos.x}
          y={addressPos.y}
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
        <Circle
          x={linkNamePos.x}
          y={linkNamePos.y}
          radius={5}
          fill="red"
        ></Circle>
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
      </Group>
    </>
  );
};

export default LinkNode;
