export class Game {
  constructor(canvas, fps = 60) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fps = fps;
    this.interval = 1000 / fps;
    this.lastTime = 0;
    this.running = false;
    this.animationFrameId = null;
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
  }

  stop() {
    this.running = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  loop(currentTime) {
    if (!this.running) return;

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));

    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= this.interval) {
      this.lastTime = currentTime - (deltaTime % this.interval);
      this.update();
      this.draw();
    }
  }

  update() {
    // Override in subclass
  }

  draw() {
    // Override in subclass
  }
}
