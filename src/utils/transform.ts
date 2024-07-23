import Vec2 from "./vec2";

export type MousePosOpts = {
  relativeTo: "element" | "canvas" | "transform"
}

class CanvasTransformer {
  private originTransform: DOMMatrix = new DOMMatrix();
  private inverseTransform: DOMMatrix = new DOMMatrix();
  zoom: number = 1;
  translate: Vec2 = new Vec2();
  constructor() {}

  update() {
    this.originTransform = new DOMMatrix();
    this.originTransform.translateSelf(this.translate.x, this.translate.y);
    this.originTransform.scaleSelf(this.zoom, this.zoom);
    this.inverseTransform = this.originTransform.inverse();
  }

  private elementRelativeMousePos(e: MouseEvent) {
    return new Vec2(e.offsetX, e.offsetY);
  }

  private canvasRelativeMousePos(e: MouseEvent, canvas: HTMLCanvasElement) {
    const pos = this.elementRelativeMousePos(e);
    const canvasSize = new Vec2(canvas.width, canvas.height);
    const clientSize = new Vec2(canvas.clientWidth, canvas.clientHeight);
    return pos.clone().scale(canvasSize).div(clientSize);
  }

  private transformRelativeMousePos(e: MouseEvent, canvas: HTMLCanvasElement) {
    const pos = this.canvasRelativeMousePos(e, canvas);
    const p = new DOMPoint(pos.x, pos.y);
    const point = this.inverseTransform.transformPoint(p);
    return new Vec2(point.x, point.y);
  }

  transformPoint(p: Vec2) {
    const { a, b, c, d, e, f } = this.inverseTransform;
    return new Vec2(a * p.x + c * p.y + e, b * p.x + d * p.y + f);
  }

  mousePos(e: MouseEvent, canvas: HTMLCanvasElement, opts?: MousePosOpts): Vec2 {
    let relativeTo = opts?.relativeTo ?? "element";
    switch (relativeTo) {
      case "element":
        return this.elementRelativeMousePos(e);
      case "canvas":
        return this.canvasRelativeMousePos(e, canvas);
      case "transform":
        return this.transformRelativeMousePos(e, canvas);
      default:
        throw new Error("Incorrect option!")
    }
  }

  applyDefaultTransform(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  applyTransform(ctx: CanvasRenderingContext2D) {
    const { a, b, c, d, e, f } = this.originTransform;
    ctx.transform(a, b, c, d, e, f);
  }

}

export default CanvasTransformer;