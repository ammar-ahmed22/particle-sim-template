<div align="center">
  <h2>Particle Simulation Template</h2>
  <p>A simple TypeScript template for running particle simulations.</p>
</div>

### Features
- **ECS (Entity-Component-System) for Simulation**: Simple (slightly opinionated) ECS for handling the simulations
- **DOM Element Renderer**: Simple class for rendering and manipulating DOM elements
- **Numerous Utilities**: 2D vectors, Canvas view transformer, Canvas drawing utility, Color utility, Rendering utility (handles the game loop)

### Running Locally
**Clone the repo**:
```bash
git clone <URL>
```

**Change directory**:
```bash
cd particle-sim-template
```

**Run locally**:
```bash
npm run start
```
Opens the website on `localhost:8080`

### Provided Example
The provided example that is running when you run the program locally is a simple particle simulation example showcasing the following features:
- Spawning a 4x4 bundle of particles by clicking and releasing the mouse (dragging will give the bundle a velocity)
- Semi-implicit Euler integration for the physics of the particles (handles position, velocity and acceleration)
- Constant gravity on all the particles
- Collision handling between particles with an elastic collision response
  + By default, all particles have a density of 1. Mass is used for the collision response which is calculated using the density and radius (assuming a spherical model)
- Constraining particles to the inside of an AABB (axis-aligned bounding box)
- Zooming in and out (the AABB changes size based on the zoom to always fit the entire canvas)

