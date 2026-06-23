# HTML5 Web Games UI/UX Best Practices and Guidelines

This file documents the core guidelines, "skills", and rules that AI agents must follow when modifying or enhancing the UI/UX of this classic web games repository. By adhering to these instructions, we ensure a scalable, maintainable, and highly performant architecture.

## 1. Separation of Concerns (Canvas vs. DOM)
- **Use the Canvas for rendering core game state only:** The HTML5 Canvas API (`src/core/Renderer.js`) is highly performant for drawing shapes, images, and sprites frame-by-frame. It should strictly handle game logic rendering (e.g., the snake, apples, grid).
- **Use the DOM for user interface:** Any element that is static, text-heavy, requires input (buttons, forms), or is not tied to the game tick should be built using HTML and CSS (DOM elements).
- **Why?** The DOM is much better at handling typography, wrapping, click events, screen reader accessibility, and responsive layouts compared to Canvas. Mixing UI text into the Canvas makes it non-accessible, difficult to style, and can degrade performance.

## 2. Responsive and Adaptive Design
- **Flexible Containers:** Wrap game areas in flexible layout containers (e.g., using CSS Flexbox or Grid) that adapt to various screen sizes.
- **Canvas Scaling:** When handling responsive canvases, manage scaling carefully. The CSS `width` and `height` properties scale the canvas like an image, whereas the HTML attributes `<canvas width="800" height="600">` define the internal pixel resolution.
- **Maintain Aspect Ratio:** If scaling is required, ensure the aspect ratio of the game is preserved to prevent distortion (e.g., using `aspect-ratio` CSS property).
- **Mobile First Input Support:** Consider touch events (`touchstart`, `touchend`) as first-class citizens alongside keyboard inputs in `src/core/Input.js` to ensure the game is playable on mobile devices.

## 3. Styling and Theming (CSS)
- **Use CSS Variables:** Always define colors, fonts, and sizing using CSS Custom Properties (e.g., `--bg-color: #2c3e50`) in `:root`. This guarantees a consistent design system and makes it trivial to implement features like dark mode or game-specific themes in the future.
- **Modern CSS Features:** Utilize modern CSS like Flexbox, Grid, and transitions to manage UI layout and animations smoothly without relying on JavaScript to calculate positions.
- **Clear Active/Focus States:** Ensure interactive elements (like the navigation buttons) have distinct visual cues for `hover`, `focus`, and `active` states to improve UX and accessibility.

## 4. Performance Optimization
- **Optimize Render Loops:** Ensure `requestAnimationFrame` is strictly used for the game loop (`src/core/Game.js`). Avoid intensive calculations inside the `draw()` methods.
- **Clear Strategically:** Only clear and redraw the portions of the canvas that have changed (dirty rectangles), or clear the whole canvas if most pixels change, but do so efficiently.
- **Avoid DOM Thrashing:** If updating DOM elements (like a score display), update them only when the value actually changes rather than every frame.

## 5. Accessibility (a11y)
- **Semantic HTML:** Use proper tags (`<header>`, `<main>`, `<nav>`, `<button>`) instead of generic `<div>`s for UI components.
- **Keyboard Navigation:** Ensure menus and buttons are fully navigable via the keyboard (e.g., via the Tab key).
- **Canvas Fallback:** Provide descriptive text or fallback content inside the `<canvas>` tag for screen readers, or use ARIA live regions to announce critical game state changes (e.g., "Game Over. Score: 100").

## Agent Instructions
Whenever requested to add a feature, fix a bug, or enhance the design of this repository, you **MUST**:
1. Abide by the rules outlined above.
2. Specifically, if asked to add UI elements (like scoreboards, menus, health bars), **DO NOT** draw them on the canvas. Add them to the DOM in `index.html` and style them in `src/style.css`.
3. If modifying colors, use existing CSS variables or define new ones at the root level.
