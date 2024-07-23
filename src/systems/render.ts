import ECS, { System, SystemType } from "../utils/ecs";
import Renderable from "../utils/renderable";
import Particle from "../objects/particle";
import { SimulationResource } from ".";
import AABB from "../objects/aabb";
import Vec2 from "../utils/vec2";

export class ParticleRenderSystem implements System<Renderable, SimulationResource> {
  type: SystemType = "update";
  filter(component: Renderable): boolean {
    return component instanceof Particle;
  }

  update(entities: number[], components: Map<number, Renderable>, ecs: ECS<Renderable, SimulationResource>, resources: SimulationResource): void {
    for (const entity of entities) {
      const particle = components.get(entity) as Particle;
      if (!resources.graphics) {
        throw new Error("Cannot render without `graphics` resource!");
      }
      if (particle) {
        particle.render(resources.graphics)
      }
    }
  }
}

export class AABBRenderSystem implements System<Renderable, SimulationResource> {
  type: SystemType = "update";
  filter(component: Renderable, resources: SimulationResource): boolean {
    return component instanceof AABB;
  }

  update(entities: number[], components: Map<number, Renderable>, ecs: ECS<Renderable, SimulationResource>, resources: SimulationResource): void {
    for (const entity of entities) {
      const box = components.get(entity) as AABB;
      if (box) {
        let transformed = resources.transformer.transformPoint(box.position.clone());
        if (!resources.graphics) {
          throw new Error("Cannot render without `graphics` resource!");
        }
        // console.log(transformed);
        // box.position = transformed;
        // box.position = transformed.clone();
        box.render(resources.graphics);
      }
    }
  }
}