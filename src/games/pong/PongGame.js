import * as THREE from 'https://esm.sh/three';
import { Game } from '../../core/Game.js';
import { ThreeRenderer } from '../../core/ThreeRenderer.js';
import { Input } from '../../core/Input.js';
import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';

export class PongGame extends Game {
  constructor(canvas) {
    super(canvas, 60); // 60 FPS for smooth physics
    this.width = 60; // Logical width
    this.height = 40; // Logical height

    this.renderer = new ThreeRenderer(canvas);

    // Position camera for a top-down view of the Pong table
    const centerX = this.width / 2;
    const centerY = -this.height / 2;
    // Lower perspective for more 3D feel
    this.renderer.camera.position.set(centerX, centerY - 25, 45);
    this.renderer.camera.lookAt(centerX, centerY, 0);

    this.input = new Input();

    // UI elements
    this.scoreElementP1 = this.createOverlayElement('pong-score-p1', '25%', '20px', 'var(--accent-primary)', '32px var(--font-display)', true);
    this.scoreElementP2 = this.createOverlayElement('pong-score-p2', '75%', '20px', 'var(--accent-secondary)', '32px var(--font-display)', true);

    this.winnerElement = this.createOverlayElement('pong-winner', '50%', '50%', 'var(--text-primary)', '28px var(--font-display)', true);
    this.winnerElement.style.transform = 'translate(-50%, -50%)';
    this.winnerElement.style.textAlign = 'center';
    this.winnerElement.style.display = 'none';

    this.paddleWidth = 1.5;
    this.paddleHeight = 8;
    this.ballSize = 1.5;

    this.maxScore = 5;

    this.resetGame();
  }

  createOverlayElement(id, left, top, color, font, centered = false) {
    let el = document.getElementById(`overlay-${id}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `overlay-${id}`;
      el.style.position = 'absolute';
      if (centered) {
        el.style.left = left;
        el.style.transform = 'translateX(-50%)';
      } else {
        el.style.left = left;
      }
      el.style.top = top;
      el.style.color = color;
      el.style.font = font;
      el.style.pointerEvents = 'none';
      el.style.textShadow = `0 0 10px ${color}`;
      el.style.zIndex = '10';

      const container = this.canvas.parentElement;
      if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }
      container.appendChild(el);
    }
    return el;
  }

  resetGame() {
    this.player1 = new Paddle(3, this.height / 2, this.paddleWidth, this.paddleHeight, 0.8);
    this.player2 = new Paddle(this.width - 3, this.height / 2, this.paddleWidth, this.paddleHeight, 0.6); // Slightly slower AI
    this.ball = new Ball(this.width / 2, this.height / 2, this.ballSize, 0.6, 0.4);

    this.gameOver = false;
    this.winnerElement.style.display = 'none';
    this.updateScoreUI();
  }

  resetRound(scorer) {
    const direction = scorer === 1 ? -1 : 1; // Serve towards loser
    this.ball.reset(this.width / 2, this.height / 2, direction);
  }

  updateScoreUI() {
    this.scoreElementP1.innerText = this.player1.score;
    this.scoreElementP2.innerText = this.player2.score;
  }

  handleInput() {
    if (this.input.isKeyPressed('KeyW')) this.player1.move('UP', this.height);
    if (this.input.isKeyPressed('KeyS')) this.player1.move('DOWN', this.height);

    if (this.gameOver && this.input.isKeyPressed('Space')) {
      this.resetGame();
    }
  }

  updateAI() {
    // Simple AI: Move towards ball Y
    if (this.ball.y < this.player2.y - 1) {
      this.player2.move('UP', this.height);
    } else if (this.ball.y > this.player2.y + 1) {
      this.player2.move('DOWN', this.height);
    }
  }

  update() {
    this.handleInput();

    if (this.gameOver) return;

    this.updateAI();
    this.ball.update();
    this.ball.checkWallCollision(this.height);
    this.ball.checkPaddleCollision(this.player1, this.player2);

    // Scoring
    if (this.ball.x < 0) {
      this.player2.score++;
      this.updateScoreUI();
      if (this.player2.score >= this.maxScore) {
        this.endGame('PLAYER 2 WINS');
      } else {
        this.resetRound(2);
      }
    } else if (this.ball.x > this.width) {
      this.player1.score++;
      this.updateScoreUI();
      if (this.player1.score >= this.maxScore) {
        this.endGame('PLAYER 1 WINS');
      } else {
        this.resetRound(1);
      }
    }
  }

  endGame(message) {
    this.gameOver = true;
    this.winnerElement.innerHTML = `${message}<br><span style="font-size:16px; color:var(--text-primary); text-shadow:none; font-family:var(--font-body)">Press SPACE to restart</span>`;
    this.winnerElement.style.display = 'block';
  }

  draw() {
    this.renderer.clearMeshes();

    // Draw field elements (center line)
    const lineGeo = new THREE.BoxGeometry(0.5, this.height, 0.1);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const lineMesh = new THREE.Mesh(lineGeo, lineMat);
    lineMesh.position.set(this.width / 2, -this.height / 2, -1);
    this.renderer.addMesh(lineMesh);

    // Draw Paddles
    const p1Geo = new THREE.BoxGeometry(this.player1.width, this.player1.height, 2);
    const p1Mat = new THREE.MeshLambertMaterial({ color: 0x00F0FF }); // Accent Primary
    const p1Mesh = new THREE.Mesh(p1Geo, p1Mat);
    p1Mesh.position.set(this.player1.x, -this.player1.y, 0);
    this.renderer.addMesh(p1Mesh);

    const p2Geo = new THREE.BoxGeometry(this.player2.width, this.player2.height, 2);
    const p2Mat = new THREE.MeshLambertMaterial({ color: 0xFF003C }); // Accent Secondary
    const p2Mesh = new THREE.Mesh(p2Geo, p2Mat);
    p2Mesh.position.set(this.player2.x, -this.player2.y, 0);
    this.renderer.addMesh(p2Mesh);

    // Draw Ball
    const ballGeo = new THREE.BoxGeometry(this.ball.size, this.ball.size, this.ball.size);
    const ballMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.set(this.ball.x, -this.ball.y, 0);
    this.renderer.addMesh(ballMesh);

    this.renderer.render();
  }

  stop() {
    super.stop();
    this.renderer.dispose();
    if (this.scoreElementP1) this.scoreElementP1.remove();
    if (this.scoreElementP2) this.scoreElementP2.remove();
    if (this.winnerElement) this.winnerElement.remove();
  }
}
