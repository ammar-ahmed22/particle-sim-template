import Graphics from "./graphics";

export type RendererSystemName = "setup" | "update";
export type RendererSystem = (canvas: HTMLCanvasElement, graphics: Graphics) => void;
export type RendererSystemMap = {
  [K in RendererSystemName]?: RendererSystem[]
}


class Renderer {
  private ctx: CanvasRenderingContext2D;
  private systems: RendererSystemMap = {};
  constructor(
    private canvas: HTMLCanvasElement
  ) {
    let ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Cannot get rendering context!");
    }
    this.ctx = ctx;
  }

  addSystem(name: RendererSystemName, system: RendererSystem) {
    if (this.systems[name]) {
      this.systems[name]?.push(system)
    } else {
      this.systems[name] = [system];
    }
  }

  addSystems(name: RendererSystemName, systems: RendererSystem[]) {
    systems.forEach(system => {
      this.addSystem(name, system);
    })
  }

  private runSystems(name: RendererSystemName) {
    if (this.systems[name]) {
      for (const system of this.systems[name]!) {
        system(this.canvas, new Graphics(this.ctx));
      }
    }
  }

  run() {
    if (this.systems.setup) this.runSystems("setup");
    if (this.systems.update) {
      let update = () => {
        this.runSystems("update");
        requestAnimationFrame(update);
      }
      update();
    }
  }
}

export default Renderer;