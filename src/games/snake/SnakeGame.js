import * as THREE from 'https://esm.sh/three';
import { Game } from '../../core/Game.js';
import { ThreeRenderer } from '../../core/ThreeRenderer.js';
import { Input } from '../../core/Input.js';
import { Snake } from './Snake.js';

export class SnakeGame extends Game {
  constructor(canvas) {
    super(canvas, 10); // 10 FPS for classic snake feel
    this.scale = 20; // Used for logical grid size
    this.gridWidth = canvas.width / this.scale;
    this.gridHeight = canvas.height / this.scale;

    // We replace the 2D Renderer with our new ThreeRenderer
    this.renderer = new ThreeRenderer(canvas);

    // Adjust camera to look at the center of our logical grid
    // The grid goes from x=0 to gridWidth, and y=0 to gridHeight.
    // Let's position camera so top-left is (0,0) and bottom-right is (gridWidth, -gridHeight) to match 2D logic.
    const centerX = this.gridWidth / 2;
    const centerY = -this.gridHeight / 2;
    this.renderer.camera.position.set(centerX, centerY - 15, 25);
    this.renderer.camera.lookAt(centerX, centerY, 0);

    this.input = new Input();

    // UI elements to show score outside of WebGL
    this.scoreElement = this.createOverlayElement('score', '10px', '20px', 'white', '16px monospace');
    this.gameOverElement = this.createOverlayElement('gameOver', '50%', '50%', 'red', '24px monospace', true);
    this.gameOverElement.style.transform = 'translate(-50%, -50%)';
    this.gameOverElement.style.textAlign = 'center';
    this.gameOverElement.style.display = 'none';

    this.reset();
  }

  createOverlayElement(id, left, top, color, font, centered = false) {
    let el = document.getElementById(`overlay-${id}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `overlay-${id}`;
      el.style.position = 'absolute';
      el.style.left = left;
      el.style.top = top;
      el.style.color = color;
      el.style.font = font;
      el.style.pointerEvents = 'none';
      el.style.textShadow = '1px 1px 2px black';

      // Make sure the canvas container is position: relative
      const container = this.canvas.parentElement;
      if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }
      container.appendChild(el);
    }
    return el;
  }

  reset() {
    this.snake = new Snake(Math.floor(this.gridWidth / 2), Math.floor(this.gridHeight / 2));
    this.food = this.spawnFood();
    this.score = 0;
    this.gameOver = false;

    this.scoreElement.innerText = `Score: ${this.score}`;
    this.gameOverElement.style.display = 'none';
  }

  spawnFood() {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * this.gridWidth),
        y: Math.floor(Math.random() * this.gridHeight)
      };

      // Check if food spawned on snake
      const onSnake = this.snake.body.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) {
        break;
      }
    }
    return newFood;
  }

  handleInput() {
    if (this.input.isKeyPressed('ArrowUp') || this.input.isKeyPressed('KeyW')) this.snake.setDirection('UP');
    if (this.input.isKeyPressed('ArrowDown') || this.input.isKeyPressed('KeyS')) this.snake.setDirection('DOWN');
    if (this.input.isKeyPressed('ArrowLeft') || this.input.isKeyPressed('KeyA')) this.snake.setDirection('LEFT');
    if (this.input.isKeyPressed('ArrowRight') || this.input.isKeyPressed('KeyD')) this.snake.setDirection('RIGHT');

    if (this.gameOver && this.input.isKeyPressed('Space')) {
      this.reset();
    }
  }

  update() {
    this.handleInput();

    if (this.gameOver) return;

    this.snake.update();

    if (this.snake.checkCollision(this.gridWidth, this.gridHeight)) {
      this.gameOver = true;
      this.gameOverElement.innerHTML = 'GAME OVER<br><span style="font-size:16px; color:white">Press SPACE to restart</span>';
      this.gameOverElement.style.display = 'block';
      return;
    }

    // Check food collision
    const head = this.snake.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.scoreElement.innerText = `Score: ${this.score}`;
      this.snake.grow();
      this.food = this.spawnFood();
    }
  }

  draw() {
    this.renderer.clearMeshes(); // Remove old meshes from scene

    if (this.gameOver) {
      // Just render what was left, maybe dim the light?
      this.renderer.scene.background = new THREE.Color('#300');
    } else {
      this.renderer.scene.background = new THREE.Color('#111');
    }

    // Create materials and geometries
    // We create them fresh here, but dispose them in clearMeshes to prevent memory leaks
    const foodGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const foodMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const foodMesh = new THREE.Mesh(foodGeo, foodMat);
    // Y is inverted in 2D grid relative to 3D standard
    foodMesh.position.set(this.food.x, -this.food.y, 0);
    this.renderer.addMesh(foodMesh);

    const snakeGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);

    this.snake.body.forEach((segment, index) => {
      const color = index === 0 ? 0x4CAF50 : 0x2E7D32; // Head is lighter green
      const mat = new THREE.MeshLambertMaterial({ color: color });
      const mesh = new THREE.Mesh(snakeGeo, mat);
      mesh.position.set(segment.x, -segment.y, 0);

      // Elevate head slightly
      if (index === 0) mesh.position.z = 0.1;

      this.renderer.addMesh(mesh);
    });

    this.renderer.render();
  }

  stop() {
    super.stop();
    // Cleanup Three.js resources and UI
    this.renderer.dispose();
    if (this.scoreElement) this.scoreElement.remove();
    if (this.gameOverElement) this.gameOverElement.remove();
  }
}
