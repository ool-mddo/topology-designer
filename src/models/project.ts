import CanvasData from "./canvas";
import Intent from "./intent";

export type Project = {
  intent: Intent;
  canvas: CanvasData | null;
};
