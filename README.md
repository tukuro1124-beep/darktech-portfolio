# Darktech Portfolio

Vanilla EN/VI one-page portfolio built with Vite.

## Background Integration

This project integrates **PavelDoGreat/WebGL-Fluid-Simulation** as the animated background.

- Upstream source is vendored at: `vendor/WebGL-Fluid-Simulation`
- Import method: `git submodule`
- Upstream license: MIT (see `vendor/WebGL-Fluid-Simulation/LICENSE`)

Runtime mounting is handled in:

- `src/background/fluidAdapter.js`

Current fluid options are configured there, including:

- `TRANSPARENT: true`
- `BACK_COLOR: { r: 0, g: 0, b: 0 }`
- `BLOOM: false`
- `SUNRAYS: false`
- `IMMEDIATE: true`
- `TRIGGER: 'hover'`

To tweak the background behavior, edit the options object in `src/background/fluidAdapter.js`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
