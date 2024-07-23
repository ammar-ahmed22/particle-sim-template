import ElementBuilder from "./utils/elements";
import Renderer from "./utils/renderer";
import ECS, { Entity, System, SystemType } from "./utils/ecs";
import Renderable from "./utils/renderable";
import Graphics from "./utils/graphics";
import Vec2 from "./utils/vec2";
import Color from "./utils/color";
import { SimulationResource } from "./systems";
import { ParticleRenderSystem, AABBRenderSystem } from "./systems/render";
import PhysicsSystem, { GravitySystem, ConstrainSystem } from "./systems/physics";
import { SpawnParticlesSystem } from "./systems/spawn";
import Particle from "./objects/particle";
import CanvasTransformer from "./utils/transform";
import AABB from "./objects/aabb";

export type MouseState = {
  clicked?: Vec2,
  drag?: Vec2,
  released?: Vec2
}

const mouseState: MouseState = {};
const transformer = new CanvasTransformer();
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
    mouseState.clicked = transformer.mousePos(e, canvas.element, { relativeTo: "transform" });
    mouseState.released = undefined;
  },
  mousemove: (e: MouseEvent) => {
    if (mouseState.clicked && !mouseState.released) {
      mouseState.drag = transformer.mousePos(e, canvas.element, { relativeTo: "transform" });
    }
  },
  mouseup: (e: MouseEvent) => {
    mouseState.released = transformer.mousePos(e, canvas.element, { relativeTo: "transform" });
    mouseState.drag = undefined;
  }
})
.render(document.body);

// Handling resize
window.addEventListener("resize", (_: UIEvent) => {
  console.log("resize called");
  canvas.addAttributes({ width: window.innerWidth.toString(), height: window.innerHeight.toString() })
})

// Rendering handler
const renderer = new Renderer(canvas.element);
// Simulation handler
const sim = new ECS<Renderable, SimulationResource>();


sim.addSystems([
  new SpawnParticlesSystem(), // Spawns particles
  new GravitySystem(), // Adds gravity
  new ConstrainSystem(), // Constrains to inside of AABB
  new PhysicsSystem(), // Handles physics integrations
  new ParticleRenderSystem(), // Renders all particles
  new AABBRenderSystem() // Renders all AABBs
])


// Add resources to simulation
const setupECS = (canvas: HTMLCanvasElement, graphics: Graphics) => {
  sim.addResource({ graphics, dt: 1 / 60, transformer, mouseState });
  sim.setup();
}

// Add a single particle to simulation
const addParticle = (canvas: HTMLCanvasElement) => {
  sim.createEntity(new Particle({
    position: new Vec2(canvas.width / 2, canvas.height / 2),
    radius: 10,
    stroke: Color.WHITE,
    strokeWidth: 1
  }))
}

// Add setup systems to rendering
renderer.addSystems("setup", [setupECS, addParticle]);

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



