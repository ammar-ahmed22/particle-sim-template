import Graphics from "../utils/graphics";
import CanvasTransformer from "../utils/transform";
import { MouseState } from "..";

export type SimulationResource = {
  graphics: Graphics,
  dt: number,
  transformer: CanvasTransformer,
  mouseState: MouseState
}
