import Vec2 from "./vec2";
import Color from "./color";


export type FillStrokeOpts = {
  stroke?: string | Color,
  fill?: string | Color,
  strokeWidth?: number
}

class Graphics {
  constructor(
    public ctx: CanvasRenderingContext2D
  ) {}
  
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private handleFillStroke(opts: FillStrokeOpts) {
    if (opts.fill) {
      this.ctx.fillStyle = typeof opts.fill === "string" ? opts.fill : opts.fill.hex();
      this.ctx.fill();
    }

    if (opts.stroke) {
      this.ctx.strokeStyle = typeof opts.stroke === "string" ? opts.stroke : opts.stroke.hex();
      this.ctx.lineWidth = opts.strokeWidth ?? 1;
      this.ctx.stroke();
    }
  }

  rect(x: number, y: number, width: number, height: number, opts?: FillStrokeOpts) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    if (opts) this.handleFillStroke(opts);
  }  

  circle(x: number, y: number, r: number, opts?: FillStrokeOpts) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (opts) this.handleFillStroke(opts);
  }

  line(start: Vec2, end: Vec2, opts?: FillStrokeOpts) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    if (opts) this.handleFillStroke(opts);
    this.ctx.stroke();
  }

}

export default Graphics;