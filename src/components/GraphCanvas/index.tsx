import React, { FC } from "react";
import RouterImg from "assets/images/router.png";
import { Image, Layer, Line, Stage } from "react-konva";
import useImage from "use-image";
import { Image as ImageShape } from "konva/lib/shapes/Image";
import { Line as LineShape } from "konva/lib/shapes/Line";

const calcObjCenter = (
  x: number,
  y: number,
  width: number,
  height: number
): number[] => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return [cx, cy];
};

const GraphCanvas: FC = () => {
  const [image] = useImage(RouterImg);
  const routerA = new ImageShape({ image: image, x: 50, y: 50 });
  const routerB = new ImageShape({
    image: image,
    x: 200,
    y: 200,
  });
  const centerRouterA = calcObjCenter(
    routerA.x(),
    routerA.y(),
    (routerA.image()?.width as number) ?? 0,
    (routerA.image()?.height as number) ?? 0
  );
  const centerRouterB = calcObjCenter(
    routerB.x(),
    routerB.y(),
    (routerB.image()?.width as number) ?? 0,
    (routerB.image()?.height as number) ?? 0
  );
  const link = new LineShape({
    points: [
      centerRouterA[0],
      centerRouterA[1],
      centerRouterB[0],
      centerRouterB[1],
    ],
    stroke: "red",
    strokeWidth: 2,
  });
  const routerViews = (routers: ImageShape[]) => {
    return routers.map((router, key) => {
      return (
        <Image
          image={router.image()}
          x={router.x()}
          y={router.y()}
          key={`router-${key}`}
        />
      );
    });
  };
  const linkViews = (links: LineShape[]) => {
    return links.map((link, key) => {
      console.log(link);
      return (
        <Line
          points={link.points()}
          strokeWidth={link.strokeWidth()}
          stroke={link.stroke()}
          key={`line-${key}`}
        />
      );
    });
  };
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>{routerViews([routerA, routerB])}</Layer>
      <Layer>{linkViews([link])}</Layer>
    </Stage>
  );
};

export default GraphCanvas;
