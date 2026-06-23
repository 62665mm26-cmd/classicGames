export class Paddle {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.score = 0;
  }

  move(direction, boundsY) {
    if (direction === 'UP') {
      this.y -= this.speed;
    } else if (direction === 'DOWN') {
      this.y += this.speed;
    }

    // Constrain to bounds
    if (this.y < this.height / 2) this.y = this.height / 2;
    if (this.y > boundsY - this.height / 2) this.y = boundsY - this.height / 2;
  }
}
