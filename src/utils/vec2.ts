

class Vec2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {
  
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  add(v: number): Vec2;
  add(v: Vec2): Vec2;
  add(v: number | Vec2): Vec2 {
    if (typeof v === "number") {
      this.x += v;
      this.y += v;
    } else {
      this.x += v.x;
      this.y += v.y;
    }
    return this;
  }

  sub(v: number): Vec2;
  sub(v: Vec2): Vec2;
  sub(v: number | Vec2): Vec2 {
    if (typeof v === "number") {
      this.x -= v;
      this.y -= v;
    } else {
      this.x -= v.x;
      this.y -= v.y;
    }
    return this;
  }

  scale(m: number): Vec2;
  scale(m: Vec2): Vec2;
  scale(m: number | Vec2): Vec2 {
    if (typeof m === "number") {
      this.x *= m;
      this.y *= m;
    } else {
      this.x *= m.x;
      this.y *= m.y;
    }
    return this;
  }

  div(m: number): Vec2;
  div(m: Vec2): Vec2;
  div(m: number | Vec2): Vec2 {
    if (typeof m === "number") {
      this.x /= m;
      this.y /= m;
    } else {
      this.x /= m.x;
      this.y /= m.y;
    }
    return this;
  }

  toString(): string {
    return `{ x: ${this.x}, y: ${this.y} }`
  }

  static Add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  static Subtract(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  static Dot(a: Vec2, b: Vec2): number {
    return (a.x * b.x) + (a.y * b.y);
  }

}

export default Vec2;