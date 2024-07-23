
export const sphereMass = (radius: number, density: number): number => {
  return density * (4 / 3) * Math.PI * (radius ** 3);
}

export const sphereRadius = (mass: number, density: number): number => {
  return (mass / ((4 / 3) * Math.PI * density)) ** (1 / 3);
}