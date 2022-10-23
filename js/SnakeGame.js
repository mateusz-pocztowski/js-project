'use strict';

const arrows = {
  37: 'LEFT',
  39: 'RIGHT',
  38: 'UP',
  40: 'DOWN',
};

const colors = {
  board: '#aad751',
  board100: '#a0cc49',
  apple: '#e7471d',
  snake: '#4674e9',
};

class SnakeGame extends EventEmitter {
  #size = null;
  #speed = null;
  #snake = null;
  #apple = null;
  #interval = null;
  #direction = 'RIGHT';
  #nextDirection = this.#direction;
  #score = 0;
  #isGameOver = false;
  #canvas = document.querySelector('canvas');
  #ctx = this.#canvas.getContext('2d');

  constructor(size, speed = 100) {
    super();

    this.#size = size;
    this.#speed = speed;
    this.#init();
  }

  reset(size = this.#size, speed = this.#speed) {
    this.#size = size;
    this.#speed = speed;

    this.#clear();
    this.#init();
  }

  destroy() {
    this.#clear();
    this.removeAllListeners();
  }

  // ------------------- GETTERS ------------------- //

  get score() {
    return this.#score;
  }

  get boardSize() {
    return this.#size;
  }

  get speed() {
    return this.#speed;
  }

  // ------------------- PRIVATE METHODS ------------------- //

  #start() {
    this.#interval = setInterval(this.#tick.bind(this), this.#speed);
  }

  #init() {
    this.#snake = [
      { x: 3, y: Math.floor(this.#size / 2) },
      { x: 2, y: Math.floor(this.#size / 2) },
      { x: 1, y: Math.floor(this.#size / 2) },
    ];

    document.addEventListener('keydown', this.#changeDirection.bind(this));

    this.#putAppleOnBoard();
    this.#draw();
    this.emit('score', this.#score);
  }

  #tick() {
    this.#moveSnake();

    const isGameOver = this.#checkForGameOver();

    if (isGameOver) {
      clearInterval(this.#interval);
      this.#interval = null;
      this.#isGameOver = true;

      this.emit('gameover');
      return;
    }

    const hasEatenApple = this.#checkHasEatenApple();

    if (hasEatenApple) {
      this.#score++;
      this.emit('score', this.#score);

      this.#putAppleOnBoard();
    } else {
      this.#snake.pop();
    }

    this.#draw();
  }

  #clear() {
    clearInterval(this.#interval);
    this.#interval = null;
    this.#snake = null;
    this.#apple = null;
    this.#isGameOver = false;
    this.#direction = 'RIGHT';
    this.#nextDirection = this.#direction;
    this.#score = 0;

    document.removeEventListener('keydown', this.#changeDirection.bind(this));
  }

  #moveSnake() {
    const head = this.#snake[0];
    this.#direction = this.#nextDirection;

    switch (this.#direction) {
      case 'UP':
        this.#snake.unshift({ x: head.x, y: head.y - 1 });
        break;

      case 'DOWN':
        this.#snake.unshift({ x: head.x, y: head.y + 1 });
        break;

      case 'LEFT':
        this.#snake.unshift({ x: head.x - 1, y: head.y });
        break;

      case 'RIGHT':
        this.#snake.unshift({ x: head.x + 1, y: head.y });
        break;
    }
  }

  #changeDirection(e) {
    const direction = arrows[e.keyCode];

    const opposites = { LEFT: 'RIGHT', RIGHT: 'LEFT', DOWN: 'UP', UP: 'DOWN' };
    const isOpposite = opposites[this.#direction] === direction;

    if (direction && !isOpposite) {
      this.#nextDirection = direction;

      if (!this.#interval && !this.#isGameOver) {
        this.#start();
      }
    }
  }

  #putAppleOnBoard() {
    const snakeIndexes = this.#snake.map(part => part.y * this.#size + part.x);

    const freeSpaces = Array(this.#size * this.#size)
      .fill()
      .reduce((prev, _curr, i) => {
        if (!snakeIndexes.includes(i)) {
          prev.push({ x: i % this.#size, y: Math.floor(i / this.#size) });
        }
        return prev;
      }, []);

    this.#apple = freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
  }

  // ------------------- CHECK METHODS ------------------- //

  #checkHasEatenApple() {
    const head = this.#snake[0];

    return this.#apple?.x === head.x && this.#apple?.y === head.y;
  }

  #checkForGameOver() {
    const head = this.#snake[0];

    for (let i = 4; i < this.#snake.length; i++) {
      if (this.#snake[i].x === head.x && this.#snake[i].y === head.y) {
        return true;
      }
    }

    const left = head.x < 0;
    const right = head.x >= this.#size;
    const top = head.y < 0;
    const bottom = head.y >= this.#size;

    return left || right || top || bottom;
  }

  // ------------------- DRAW METHODS ------------------- //

  #draw() {
    this.#drawBoard();
    this.#drawSnake();
    this.#drawApple();
  }

  #drawBoard() {
    for (let i = 0; i < this.#size; i++) {
      for (let j = 0; j < this.#size; j++) {
        const squareSize = this.#canvas.clientWidth / this.#size;

        this.#ctx.fillStyle = (i + j) % 2 ? colors.board : colors.board100;
        this.#ctx.fillRect(j * squareSize, i * squareSize, squareSize, squareSize);
      }
    }
  }

  #drawSnake() {
    this.#snake.forEach(part => {
      const squareSize = this.#canvas.clientWidth / this.#size;

      this.#ctx.fillStyle = colors.snake;
      this.#ctx.fillRectRounded(
        part.x * squareSize,
        part.y * squareSize,
        squareSize,
        squareSize,
        squareSize / 3
      );
    });
  }

  #drawApple() {
    if (!this.#apple) {
      return;
    }

    const squareSize = this.#canvas.clientWidth / this.#size;

    this.#ctx.fillStyle = colors.apple;
    this.#ctx.fillRectRounded(
      this.#apple.x * squareSize,
      this.#apple.y * squareSize,
      squareSize,
      squareSize
    );
  }
}
