import ElementBuilder from "./utils/elements";
import Renderer from "./utils/renderer";
import ECS, { Entity, System, SystemType } from "./utils/ecs";
import Renderable from "./utils/renderable";
import Graphics from "./utils/graphics";
import Vec2 from "./utils/vec2";
import Color from "./utils/color";
import { SimulationResource } from "./systems";
import { ParticleRenderSystem, AABBRenderSystem } from "./systems/render";
import PhysicsSystem, { GravitySystem, ConstrainSystem, CollisionSystem } from "./systems/physics";
import { SpawnParticlesSystem } from "./systems/spawn";
import Particle from "./objects/particle";
import CanvasTransformer from "./utils/transform";
import AABB from "./objects/aabb";



const transformer = new CanvasTransformer();
// Simulation handler
const sim = new ECS<Renderable, SimulationResource>({ dt: 1 / 60, transformer, mouseState: {} });

// Creating the Canvas
const canvas = new ElementBuilder("canvas");
canvas
.addAttributes({ width: window.innerWidth.toString(), height: window.innerHeight.toString() })
.addStyles({ border: "solid 1px red", display: "block" })
.addEventListeners({
  wheel: (e: WheelEvent) => {
    const mousePos = transformer.mousePos(e, canvas.element, { relativeTo: "canvas" });
    // console.log(mousePos.toString());
    const zoomFactor = Math.exp(e.deltaY * -0.01);
    transformer.zoom = transformer.zoom * zoomFactor;
    transformer.translate = mousePos.clone().sub(Vec2.Subtract(mousePos, transformer.translate).scale(zoomFactor))
  },
  mousedown: (e: MouseEvent) => {
    const { mouseState } = sim.resources;
    mouseState.clicked = transformer.mousePos(e, canvas.element, { relativeTo: "transform" });
    mouseState.released = undefined;
  },
  mousemove: (e: MouseEvent) => {
    const { mouseState } = sim.resources; 
    if (mouseState.clicked && !mouseState.released) {
      mouseState.drag = transformer.mousePos(e, canvas.element, { relativeTo: "transform" });
    }
  },
  mouseup: (e: MouseEvent) => {
    const { mouseState } = sim.resources; 
    mouseState.released = transformer.mousePos(e, canvas.element, { relativeTo: "transform" });
    mouseState.drag = undefined;
  }
})
.render(document.body);

// Handling resize
window.addEventListener("resize", (_: UIEvent) => {
  canvas.addAttributes({ width: window.innerWidth.toString(), height: window.innerHeight.toString() })
})

// Rendering handler
const renderer = new Renderer(canvas.element);


sim.addSystems([
  new SpawnParticlesSystem(), // Spawns a bundle of particles
  new GravitySystem(9.81), // Adds gravity
  new ConstrainSystem(), // Constrains to inside of AABB
  new CollisionSystem({ elastic: true, restitution: 0.8 }), // Handles particle collisions
  new PhysicsSystem(), // Handles physics integrations
  new ParticleRenderSystem(), // Renders all particles
  new AABBRenderSystem() // Renders all AABBs
])


// Add resources to simulation
const setupECS = (canvas: HTMLCanvasElement, graphics: Graphics) => {
  sim.resources.graphics = graphics;
  sim.setup();
}


// Add setup systems to rendering
renderer.addSystems("setup", [setupECS]);

// Clear the screen and reset transform
const clearScreen = (canvas: HTMLCanvasElement, graphics: Graphics) => {
  graphics.ctx.save();
  transformer.applyDefaultTransform(graphics.ctx);
  graphics.clear();
  graphics.rect(0, 0, canvas.width, canvas.height, { fill: Color.BLACK });
  graphics.ctx.restore();
}

// Transform the view (scrolling zooms in on the mouse position)
const transformView = (canvas: HTMLCanvasElement, graphics: Graphics) => {
  graphics.ctx.save();
  transformer.update();
  transformer.applyTransform(graphics.ctx);
}

// Creating bounding box that fills the zoomed in view
let boxEntity: number;
const createBoundingBox = (canvas: HTMLCanvasElement) => {
  const size = new Vec2(canvas.width, canvas.height).scale(1 / transformer.zoom);
  const origin = transformer.transformPoint(new Vec2());
  boxEntity = sim.createEntity(new AABB({ position: origin, size, stroke: Color.BLUE, strokeWidth: 2 }));
}

// Update the simulation
const updateECS = () => {
  sim.update();
}

// Remove the bounding box (needs to be created new every time)
const removeBoundingBox = () => {
  sim.removeEntity(boxEntity)
}

// Restore the canvas drawing (needed for transform drawing)
const restore = (canvas: HTMLCanvasElement, graphics: Graphics) => {
  graphics.ctx.restore();
}

// Add update systems
renderer.addSystems("update", [
  clearScreen,
  transformView,
  createBoundingBox,
  updateECS,
  removeBoundingBox,
  restore
]);

renderer.run();



