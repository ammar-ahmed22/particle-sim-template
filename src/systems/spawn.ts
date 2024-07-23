import ECS, { System, SystemType } from "../utils/ecs";
import Renderable from "../utils/renderable";
import { SimulationResource } from ".";
import Vec2 from "../utils/vec2";
import Particle, { ParticleParams } from "../objects/particle";
import Color from "../utils/color";

const spawnBundle = (ecs: ECS<Renderable, SimulationResource>, halfWidth: number, halfHeight: number, position: Vec2, params: Omit<ParticleParams, "position">) => {
  if (!Number.isInteger(halfWidth) || !Number.isInteger(halfHeight)) {
    throw new Error("halfWidth and halfHeight must be integers!");
  }

  for (let i = -halfWidth; i <= halfWidth; i++) {
    for (let j = -halfHeight; j <= halfHeight; j++) {
      let pos = position.clone().add(new Vec2(i * params.radius * 2, j * params.radius * 2));
      ecs.createEntity(new Particle({
        position: pos,
        ...params
      }));
    }
  }
}

export class SpawnParticlesSystem implements System<Renderable, SimulationResource> {
  type: SystemType = "update";
  filter(component: Renderable, resources: SimulationResource): boolean {
    return true;
  }
  update(entities: number[], components: Map<number, Renderable>, ecs: ECS<Renderable, SimulationResource>, resources: SimulationResource): void {
    const { clicked, drag, released } = resources.mouseState;
    if (clicked && released) {
      let vel = Vec2.Subtract(released.clone(), clicked.clone()).scale(-1);
      // Spawn bundle
      spawnBundle(ecs, 2, 2, released.clone(), { velocity: vel, radius: 10, strokeWidth: 0.1, stroke: Color.WHITE });
      resources.mouseState = {};
    }
  }
}
