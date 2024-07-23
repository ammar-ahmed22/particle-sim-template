import Renderable from "../utils/renderable";
import Vec2 from "../utils/vec2";
import Graphics, { FillStrokeOpts } from "../utils/graphics";
import Color from "../utils/color";

export type AABBParams = {
  position: Vec2,
  size: Vec2,
  fill?: string | Color,
  stroke?: string | Color,
  strokeWidth?: number
}

class AABB extends Renderable {
  public size: Vec2;
  public fillStrokeOpts: FillStrokeOpts
  constructor(params: AABBParams) {
    super(params.position);
    this.size = params.size;
    this.fillStrokeOpts = {
      fill: params.fill,
      stroke: params.stroke,
      strokeWidth: params.strokeWidth
    }
  }

  contains(p: Vec2): boolean {
    let min = this.position.clone();
    let max = this.position.clone().add(this.size.clone());
    if (p.x < min.x || p.x > max.x || p.y < min.y || p.y > max.y) {
      return false;
    }
    return true;
  }

  edge(vertical: boolean, direction: 1 | -1): number {
    if (vertical) {
      if (direction === -1) return this.position.y;
      return this.position.y + this.size.y;
    } else {
      if (direction === -1) return this.position.x;
      return this.position.x + this.size.x;
    }
  }

  render(graphics: Graphics): void {
    graphics.rect(this.position.x, this.position.y, this.size.x, this.size.y, this.fillStrokeOpts);
  }

  static fromCenter(center: Vec2, size: Vec2, opts?: FillStrokeOpts): AABB {
    let halfSize = size.clone().div(2);
    let origin = center.clone().sub(halfSize);
    return new AABB({
      position: origin,
      size,
      fill: opts?.fill,
      stroke: opts?.stroke,
      strokeWidth: opts?.strokeWidth
    })
  }
}

export default AABB;