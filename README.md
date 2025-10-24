# Snake Game 🐍

A colorful, bold snake game built with vanilla HTML, CSS, and TypeScript, optimized for 1920x1080 conference presentations.

## Features

- **Big & Bold Design**: Optimized for large screen display (1920x1080)
- **Colorful Graphics**: Vibrant gradient background with glowing snake and food
- **5-Segment Starting Snake**: More visible for conference demos
- **Score Tracking**: Current score and high score (saved in localStorage)
- **Smooth Controls**: Arrow keys for movement, Space to start/pause
- **Responsive Grid**: 30x30 grid with clear visual feedback

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## How to Play

1. Press **SPACE** to start the game
3. Use **Arrow Keys** to control the snake
4. Eat the pink food circles to grow and score points
5. Avoid running into yourself!
6. Press **SPACE** to pause/resume

## Development

The game is built with:
- **TypeScript** for type-safe game logic
- **Vanilla HTML/CSS** for UI
- **Canvas API** for rendering

To recompile TypeScript:
```bash
tsc game.ts
```

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and layout
- `game.ts` - TypeScript source code
- `game.js` - Compiled JavaScript (generated)
- `tsconfig.json` - TypeScript configuration

## Design Specs

- Canvas: 1200x720 pixels
- Grid: 30x30 tiles
- Snake colors: Bright green gradient
- Food: Hot pink with glow effect
- Background: Purple gradient
- Font sizes: Extra large for visibility

Perfect for conference demos and presentations! 🎮
