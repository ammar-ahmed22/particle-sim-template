import Graphics from "../utils/graphics";
import CanvasTransformer from "../utils/transform";
import Vec2 from "../utils/vec2";

export type MouseState = {
  clicked?: Vec2,
  drag?: Vec2,
  released?: Vec2
}

export type SimulationResource = {
  graphics?: Graphics,
  dt: number,
  transformer: CanvasTransformer,
  mouseState: MouseState
}
