import Color from "../utils/color";
import Renderable from "../utils/renderable";
import Graphics, { FillStrokeOpts } from "../utils/graphics";
import Vec2 from "../utils/vec2";
import { sphereMass, sphereRadius } from "../utils/math";

export type ParticleParams = {
  radius: number
  position: Vec2,
  velocity?: Vec2,
  acceleration?: Vec2,
  fill?: string | Color,
  stroke?: string | Color,
  strokeWidth?: number,
  density?: number,
}


class Particle extends Renderable {
  public velocity: Vec2;
  public acceleration: Vec2;
  public radius: number;
  public density: number;
  private fillStrokeOpts: FillStrokeOpts
  constructor(
    params: ParticleParams
  ) {
    super(params.position)
    this.radius = params.radius;
    this.velocity = params.velocity ?? new Vec2();
    this.acceleration = params.acceleration ?? new Vec2();
    this.density = params.density ?? 1;
    this.fillStrokeOpts = {
      fill: params.fill,
      stroke: params.stroke,
      strokeWidth: params.strokeWidth
    } 
  }

  setMass(m: number) {
    this.radius = sphereRadius(m, this.density)
  }

  get mass(): number {
    return sphereMass(this.radius, this.density);
  }

  render(graphics: Graphics): void {
    graphics.circle(this.position.x, this.position.y, this.radius, this.fillStrokeOpts);  
  }
}

export default Particle;