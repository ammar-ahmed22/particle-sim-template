import Renderable from "./renderable";

export type Entity = number;
export type SystemType = "setup" | "update";
export interface System<K, R> {
  type: SystemType;
  filter(component: K, resources: R): boolean;
  update(entities: Entity[], components: Map<Entity, K>, ecs: ECS<K, R>, resources: R): void;
}

class ECS<K, R> {
  private nextEntity = 0;
  private entities: Set<Entity> = new Set();
  private components: Map<Entity, K> = new Map();
  private systems: System<K, R>[] = [];
  public resources: R;
  constructor(resources: R) {
    this.resources = resources;
  }

  addResource(resource: R) {
    this.resources = resource;
  }

  createEntity(component: K) {
    let entity = this.nextEntity++;
    this.entities.add(entity);
    this.components.set(entity, component);
    return entity;
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity);
    this.components.delete(entity);
  }

  addSystem(system: System<K, R>) {
    this.systems.push(system);
  }

  addSystems(systems: System<K, R>[]) {
    this.systems.push(...systems);
  }

  private runSystems(type: SystemType) {
    if (!this.resources) throw new Error("Must add resources!");
    for (const system of this.systems) {
      if (system.type !== type) continue;
      let entities = Array.from(this.entities).filter((entity) => {
        let c = this.components.get(entity);
        if (!this.resources) throw new Error("Must add resources!");
        return c ? system.filter(c, this.resources) : true;
      })
      system.update(entities, this.components, this, this.resources);
    }
  }

  setup(): void {
    this.runSystems("setup");
  }

  update(): void {
    this.runSystems("update");
  }
}

export default ECS;
