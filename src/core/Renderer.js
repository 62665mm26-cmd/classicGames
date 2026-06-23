export class Renderer {
  constructor(ctx, width, height, scale = 10) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.scale = scale;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawRect(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
    // Draw a slight border for grid feeling
    this.ctx.strokeStyle = '#222';
    this.ctx.strokeRect(x * this.scale, y * this.scale, this.scale, this.scale);
  }

  drawText(text, x, y, color = 'white', font = '16px Arial') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
  }
}
