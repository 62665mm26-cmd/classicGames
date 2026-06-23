import { SnakeGame } from './games/snake/SnakeGame.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');

    // Initialize current game
    let currentGame = new SnakeGame(canvas);
    currentGame.start();

    // Game switching logic (for future expandability)
    const btnSnake = document.getElementById('btn-snake');

    btnSnake.addEventListener('click', () => {
        // Stop current game if switching
        if (currentGame instanceof SnakeGame === false) {
            currentGame.stop();
            currentGame = new SnakeGame(canvas);
            currentGame.start();

            // Update active class
            document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
            btnSnake.classList.add('active');
        }
    });
});
