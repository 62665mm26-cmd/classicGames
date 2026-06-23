import { SnakeGame } from './games/snake/SnakeGame.js';
import { PongGame } from './games/pong/PongGame.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');

    // Initialize current game
    let currentGame = new SnakeGame(canvas);
    currentGame.start();

    // Game switching logic
    const btnSnake = document.getElementById('btn-snake');
    const btnPong = document.getElementById('btn-pong');

    function switchGame(GameClass, btn) {
        if (currentGame instanceof GameClass === false) {
            currentGame.stop();
            currentGame = new GameClass(canvas);
            currentGame.start();

            // Update active class
            document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Re-focus window to prevent input bugs
            window.focus();
        }
    }

    btnSnake.addEventListener('click', () => switchGame(SnakeGame, btnSnake));
    btnPong.addEventListener('click', () => switchGame(PongGame, btnPong));
});
