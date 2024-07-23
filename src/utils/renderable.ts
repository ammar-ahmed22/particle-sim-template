import Graphics from "./graphics";
import Vec2 from "./vec2";

abstract class Renderable {
  constructor(
    public position: Vec2 = new Vec2()
  ) {}


  abstract render(graphics: Graphics): void;
}

export default Renderable;