import Color from "../utils/color";
import Renderable from "../utils/renderable";
import Graphics, { FillStrokeOpts } from "../utils/graphics";
import Vec2 from "../utils/vec2";

export type ParticleParams = {
  radius: number
  position: Vec2,
  velocity?: Vec2,
  acceleration?: Vec2,
  fill?: string | Color,
  stroke?: string | Color,
  strokeWidth?: number
}


class Particle extends Renderable {
  public velocity: Vec2;
  public acceleration: Vec2;
  public radius: number;
  private fillStrokeOpts: FillStrokeOpts
  constructor(
    params: ParticleParams
  ) {
    super(params.position)
    this.radius = params.radius;
    this.velocity = params.velocity ?? new Vec2();
    this.acceleration = params.acceleration ?? new Vec2();
    this.fillStrokeOpts = {
      fill: params.fill,
      stroke: params.stroke,
      strokeWidth: params.strokeWidth
    } 
  }

  render(graphics: Graphics): void {
    graphics.circle(this.position.x, this.position.y, this.radius, this.fillStrokeOpts);  
  }
}

export default Particle;