export class Snake {
  constructor(startX, startY) {
    this.body = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
  }

  update() {
    this.direction = this.nextDirection;
    const head = { ...this.body[0] };

    switch (this.direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    this.body.unshift(head);
    this.body.pop(); // Remove tail unless growing
  }

  grow() {
    // Duplicate the last segment, which will be kept on the next update
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
  }

  setDirection(newDirection) {
    const opposites = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
    };
    if (opposites[this.direction] !== newDirection) {
      this.nextDirection = newDirection;
    }
  }

  checkCollision(width, height) {
    const head = this.body[0];

    // Wall collision
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
      return true;
    }

    // Self collision
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }

    return false;
  }
}
