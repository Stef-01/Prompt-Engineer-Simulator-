# Prompt Cafe

Prompt Cafe is an isometric 2D prompt-building experience built with React, React Three Fiber, Three.js, and Zustand. You play as the barista-engineer running a futuristic AI prompt bar inside a Silicon Valley office. NPC founders line up with prompt orders and you assemble the perfect response before delivering it to the serving pad.

## Getting Started

### Prerequisites
- Node.js 18+

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The development server runs at http://localhost:3000. The UI overlay and scene rendering are sized to fill the viewport.

## Project Structure
```
src/
  App.tsx                # Canvas + overlay wiring
  index.tsx              # React entry point
  game/
    entities/            # Player, NPC, and station renderers
    hooks/               # Input and collision utilities
    scene/               # PromptCafeScene configuring camera and environment
    state/               # Zustand game store
    systems/             # Modular gameplay logic
    types.ts             # Shared game domain types
  ui/                    # HTML overlay HUD and debug utilities
  assets/                # Pixel-art placeholders for floor, walls, sprites, overworld
```

## Gameplay Loop
1. NPCs walk the queue path toward the prompt bar.
2. Step into the prompt bar zone and press **Space** to assemble the current order.
3. Carry the assembled prompt to the serving pad and press **Space** to deliver.
4. Points are awarded based on tone, format, audience, and constraints that match the order. Served NPCs exit and new ones join the queue.

All rendering occurs within a single React Three Fiber `<Canvas>`, and UI data is presented via HTML overlays for clarity and extensibility.
