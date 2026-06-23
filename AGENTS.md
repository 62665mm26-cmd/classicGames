# AI Agent Guidelines for Classic Web Games Repository

Welcome, Agent. This repository contains a classic web games engine built with vanilla HTML, CSS, and JavaScript using ES6 Modules.

We are planning to expand our game offerings to include 3D games using **Three.js**. When you are tasked with creating a 3D game or working with Three.js in this repository, please adhere to the following rules:

## Architecture and Integration

1.  **No Build Tools:** We rely exclusively on native browser ES Modules (`import`/`export`). Do not introduce Webpack, Vite, Babel, or npm dependencies unless explicitly requested.
2.  **Importing Three.js:** Since we do not have a build step, Three.js and its add-ons (like `OrbitControls` or `GLTFLoader`) MUST be imported via a CDN (e.g., esm.sh or unpkg).
    *   Example: `import * as THREE from 'https://esm.sh/three';`
    *   Example for add-ons: `import { OrbitControls } from 'https://esm.sh/three/addons/controls/OrbitControls.js';`
3.  **Engine Extensibility:**
    *   3D games should still inherit from the base `src/core/Game.js` loop.
    *   Create a specialized renderer (e.g., `src/core/ThreeRenderer.js`) instead of using the Canvas 2D `Renderer.js`.
4.  **Separation of Concerns:** Keep your Three.js scene setup, lighting, and camera logic clearly separated from the game's state and business logic.

## Best Practices for Three.js in this Repo

*   **Memory Management:** Three.js objects (Geometries, Materials, Textures) are not automatically garbage collected in WebGL. If you switch games or destroy a scene, you MUST manually call `.dispose()` on all geometries, materials, and textures to prevent memory leaks.
*   **Window Resizing:** Ensure you add an event listener for `resize` to update the camera's aspect ratio and the renderer's size.
*   **Performance:** Use `requestAnimationFrame` for the render loop (which is already handled by `src/core/Game.js`). Avoid instantiating new objects inside the update/render loop.

## General Coding Standards
*   Use modern JavaScript (ES6+).
*   Add comments explaining complex 3D math or rendering techniques.
*   Always test changes by running a local server (e.g., `python3 -m http.server 8000`) and verifying visually via the browser.
