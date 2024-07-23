import ECS, { System, SystemType } from "../utils/ecs";
import Renderable from "../utils/renderable";
import { SimulationResource } from ".";
import Particle from "../objects/particle";
import Vec2 from "../utils/vec2";
import AABB from "../objects/aabb";

export const surfaceCollisionResponse = (surfaceNormal: Vec2, initialVel: Vec2, f: number = 1, e: number = 1) => {
  if (f < 0 || f > 1 || e < 0 || e > 1) {
    console.warn(`surface collision damping co-efficient's are out of bounds! May result in obscure results. f = ${f}, e = ${e}`);
  }

  let dot = Vec2.Dot(initialVel.clone(), surfaceNormal.clone());
  return initialVel.clone().scale(f).sub(surfaceNormal.clone().scale(dot * (f + e)));
}

class PhysicsSystem implements System<Renderable, SimulationResource> {
  type: SystemType = "update"
  filter(component: Renderable, resources: SimulationResource): boolean {
    return component instanceof Particle
  }

  update(entities: number[], components: Map<number, Renderable>, ecs: ECS<Renderable, SimulationResource>, resources: SimulationResource): void {
    for (const entity of entities) {
      const particle = components.get(entity) as Particle;
      particle.velocity = particle.velocity.clone().add(particle.acceleration.clone().scale(resources.dt));
      particle.position = particle.position.clone().add(particle.velocity.clone().scale(resources.dt));
      particle.acceleration = new Vec2();
    }
  }
}

export class GravitySystem implements System<Renderable, SimulationResource> {
  private g: number;
  constructor(g?: number) {
    this.g = g ?? 9.81;
  }
  type: SystemType = 'update'
  filter(component: Renderable, resources: SimulationResource): boolean {
    return component instanceof Particle
  }

  update(entities: number[], components: Map<number, Renderable>, ecs: ECS<Renderable, SimulationResource>, resources: SimulationResource): void {
    for (const entity of entities) {
      const particle = components.get(entity) as Particle;
      particle.acceleration = new Vec2(0, this.g);
    }
  }
}

export class ConstrainSystem implements System<Renderable, SimulationResource> {
  type: SystemType = "update";
  filter(component: Renderable, resources: SimulationResource): boolean {
    return true;
  }

  update(entities: number[], components: Map<number, Renderable>, ecs: ECS<Renderable, SimulationResource>, resources: SimulationResource): void {
    // O(n)
    const boxEntity = entities.find(e => components.get(e) instanceof AABB);
    if (boxEntity) {
      const box = components.get(boxEntity) as AABB;
      let particleEntities = entities.filter(e => components.get(e) instanceof Particle);
      for (const entity of particleEntities) {
        const particle = components.get(entity) as Particle;
        let pos = particle.position.clone();
        let rad = particle.radius;
        for (let i = -1; i <= 1; i += 2) {
          for (let verticalEdge = 0; verticalEdge <= 1; verticalEdge++) {
            let surfaceNormal = new Vec2(i, i);
            if (verticalEdge) {
              surfaceNormal.x = 0;
            } else {
              surfaceNormal.y = 0;
            }
            let particleEdge = surfaceNormal.clone().scale(-rad);
            if (!box.contains(pos.clone().add(particleEdge))) {
              if (verticalEdge) {
                particle.position.y = box.edge(!!verticalEdge, (i * -1) as (1 | -1)) + (i * rad);
              } else {
                particle.position.x = box.edge(!!verticalEdge, (i * -1) as (1 | -1)) + (i * rad);
              }
              particle.velocity = surfaceCollisionResponse(surfaceNormal, particle.velocity, 0.8, 0.8);
            }
          }
        }
      }
    }
  }
}

export class CollisionSystem implements System<Renderable, SimulationResource> {
  private elastic: boolean;
  private restitution: number;
  constructor(opts?: { elastic?: boolean, restitution?: number}) {
    this.elastic = opts?.elastic ?? false;
    this.restitution = opts?.restitution ?? 1;
  }
  
  type: SystemType = "update";
  filter(component: Renderable, resources: SimulationResource): boolean {
    return component instanceof Particle;
  }

  private elasticCollision(a: Particle, b: Particle, restitution: number = 1) {
    let normal = Vec2.Subtract(a.position, b.position).normalize();
    let relVel = Vec2.Subtract(a.velocity, b.velocity);
    let colNormal = Vec2.Dot(relVel, normal);
    if (colNormal > 0) {
      return;
    }
    let aInvMass = 1 / a.mass;
    let bInvMass = 1 / b.mass;
    let impulseMag = (-(1 + restitution) * colNormal) / (aInvMass + bInvMass);
    let impulse = normal.clone().scale(impulseMag);
    a.velocity.add(impulse.clone().scale(aInvMass));
    b.velocity.sub(impulse.clone().scale(bInvMass));
  }

  private intersection(a: Particle, b: Particle, opts?: { elastic?: boolean, restitution?: number }) {
    const dist = Vec2.Distance(a.position.clone(), b.position.clone());
    const combinedRadii = a.radius + b.radius;
    if (dist < combinedRadii) {
      const overlap = 0.5 * (combinedRadii - dist);
      const n = Vec2.Subtract(a.position.clone(), b.position.clone()).div(dist);
      a.position.add(n.clone().scale(overlap));
      b.position.sub(n.clone().scale(overlap));
      if (opts?.elastic) {
        this.elasticCollision(a, b, opts.restitution);
      }
    }
  }

  update(entities: number[], components: Map<number, Renderable>, ecs: ECS<Renderable, SimulationResource>, resources: SimulationResource): void {
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = components.get(entities[i]) as Particle;
        const b = components.get(entities[j]) as Particle;
        this.intersection(a, b, { elastic: this.elastic, restitution: this.restitution });
      }
    }
  }
}

export default PhysicsSystem