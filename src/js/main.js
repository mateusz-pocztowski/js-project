'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  const { boardSize, speed } = await getSettings();

  const snake = new SnakeGame(boardSize, speed);
  const score = new ScoreRecorder(snake);

  selectors.gameOver.restartBtn.addEventListener('click', () => {
    snake.reset();

    selectors.board.score.textContent = snake.score;
    selectors.gameOver.container.classList.remove('popup--visible');
  });

  selectors.gameOver.menuBtn.addEventListener('click', async () => {
    const { boardSize, speed } = await getSettings();

    snake.reset(boardSize, speed);
    score.reload();
    selectors.gameOver.container.classList.remove('popup--visible');
  });

  snake.on('gameover', () => {
    score.save();

    selectors.gameOver.score.textContent = snake.score;
    selectors.gameOver.container.classList.add('popup--visible');
  });
});
