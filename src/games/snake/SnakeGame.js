import { Game } from '../../core/Game.js';
import { Renderer } from '../../core/Renderer.js';
import { Input } from '../../core/Input.js';
import { Snake } from './Snake.js';

export class SnakeGame extends Game {
  constructor(canvas) {
    super(canvas, 10); // 10 FPS for classic snake feel
    this.scale = 20;
    this.gridWidth = canvas.width / this.scale;
    this.gridHeight = canvas.height / this.scale;

    this.renderer = new Renderer(this.ctx, canvas.width, canvas.height, this.scale);
    this.input = new Input();

    this.reset();
  }

  reset() {
    this.snake = new Snake(Math.floor(this.gridWidth / 2), Math.floor(this.gridHeight / 2));
    this.food = this.spawnFood();
    this.score = 0;
    this.gameOver = false;
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
      return;
    }

    // Check food collision
    const head = this.snake.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.snake.grow();
      this.food = this.spawnFood();
    }
  }

  draw() {
    this.renderer.clear();

    // Draw background
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw food
    this.renderer.drawRect(this.food.x, this.food.y, 'red');

    // Draw snake
    this.snake.body.forEach((segment, index) => {
      const color = index === 0 ? '#4CAF50' : '#2E7D32'; // Head is lighter green
      this.renderer.drawRect(segment.x, segment.y, color);
    });

    // Draw UI
    this.renderer.drawText(`Score: ${this.score}`, 10, 20, 'white', '16px monospace');

    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderer.drawText('GAME OVER', this.canvas.width / 2 - 60, this.canvas.height / 2, 'red', '24px monospace');
      this.renderer.drawText('Press SPACE to restart', this.canvas.width / 2 - 110, this.canvas.height / 2 + 30, 'white', '16px monospace');
    }
  }
}
