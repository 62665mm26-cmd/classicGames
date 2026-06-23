export class Ball {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.baseSpeed = Math.abs(speedX);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  reset(x, y, directionX) {
    this.x = x;
    this.y = y;
    this.speedX = directionX * this.baseSpeed;
    // Randomize initial vertical angle slightly
    this.speedY = (Math.random() > 0.5 ? 1 : -1) * (this.baseSpeed * 0.8);
  }

  checkWallCollision(boundsY) {
    if (this.y - this.size / 2 <= 0) {
      this.y = this.size / 2;
      this.speedY *= -1;
    } else if (this.y + this.size / 2 >= boundsY) {
      this.y = boundsY - this.size / 2;
      this.speedY *= -1;
    }
  }

  checkPaddleCollision(paddle1, paddle2) {
    // Check left paddle (Player 1)
    if (this.speedX < 0) {
      if (
        this.x - this.size / 2 <= paddle1.x + paddle1.width / 2 &&
        this.x + this.size / 2 >= paddle1.x - paddle1.width / 2 &&
        this.y + this.size / 2 >= paddle1.y - paddle1.height / 2 &&
        this.y - this.size / 2 <= paddle1.y + paddle1.height / 2
      ) {
        this.speedX *= -1.05; // Slightly increase speed on bounce
        this.x = paddle1.x + paddle1.width / 2 + this.size / 2; // Prevent sticking

        // Add spin based on where it hit the paddle
        const hitPoint = (this.y - paddle1.y) / (paddle1.height / 2);
        this.speedY += hitPoint * this.baseSpeed;
      }
    }
    // Check right paddle (Player 2 or AI)
    else if (this.speedX > 0) {
      if (
        this.x + this.size / 2 >= paddle2.x - paddle2.width / 2 &&
        this.x - this.size / 2 <= paddle2.x + paddle2.width / 2 &&
        this.y + this.size / 2 >= paddle2.y - paddle2.height / 2 &&
        this.y - this.size / 2 <= paddle2.y + paddle2.height / 2
      ) {
        this.speedX *= -1.05;
        this.x = paddle2.x - paddle2.width / 2 - this.size / 2;

        const hitPoint = (this.y - paddle2.y) / (paddle2.height / 2);
        this.speedY += hitPoint * this.baseSpeed;
      }
    }
  }
}
