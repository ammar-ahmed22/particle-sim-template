

class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number = 1;

  constructor(r: number, g: number, b: number);
  constructor(r: number, g: number, b: number, a: number);
  constructor(hex: string);
  constructor(...args: any[]) {
    if (args.length >= 3) {
      let [r, g, b, a] = args as number[];
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a ?? 1;
    } else {
      let [r, g, b, a] = Color.hex2rgba(args[0] as string);
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    this.validate();
  }

  private validate() {
    if (this.r < 0 || this.r > 255 || this.g < 0 || this.g > 255 || this.b < 0 || this.b > 255 || this.a < 0 || this.a > 1) {
      throw new Error("rgba values out of range!");
    }
  }

  hex() {
    return Color.rgba2hex([this.r, this.g, this.b, this.a]);
  }

  static hex2rgba(hex: string): [number, number, number, number] {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }

    if (hex.length !== 6 && hex.length !== 8) {
      throw new Error("Invalid hex string length. Must be 6 or 8 characters.")
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

    return [r, g, b, a]
  }

  static rgba2hex(rgba: [number, number, number, number]): string {
    let [r, g, b, a] = rgba;
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
      throw new Error("rgba values out of range!");
    }

    let hexR = r.toString(16).padStart(2, '0');
    let hexG = g.toString(16).padStart(2, '0');
    let hexB = b.toString(16).padStart(2, '0');
    if (a === 1) {
      return `#${hexR}${hexG}${hexB}`
    } else {
      let hexA = Math.round(a * 255).toString(16).padStart(2, '0');
      return `#${hexR}${hexG}${hexB}${hexA}`
    }
  }

  static readonly BLACK: Color = new Color(0, 0, 0);
  static readonly WHITE: Color = new Color(255, 255, 255);
  static readonly RED: Color = new Color(255, 0, 0);
  static readonly GREEN: Color = new Color(0, 255, 0);
  static readonly BLUE: Color = new Color(0, 0, 255);
  static readonly CLEAR: Color = new Color(0, 0, 0, 0);
}

export default Color;