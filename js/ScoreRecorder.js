class ScoreRecorder {
  #snake = null;
  #storageKey = '';
  #record = 0;

  constructor(snake) {
    this.#snake = snake;
    this.#init();
  }

  save() {
    if (this.#snake.score > this.#record) {
      this.#record = this.#snake.score;
      localStorage.setItem(this.#storageKey, this.#record);

      selectors.board.record.textContent = this.#snake.score;
      selectors.gameOver.title.textContent = 'NEW RECORD';
    } else {
      selectors.gameOver.title.textContent = 'GAME OVER';
    }
  }

  reload() {
    this.#storageKey = `snake-${this.#snake.boardSize}-${this.#snake.speed}`;
    this.#record = Number(localStorage.getItem(this.#storageKey) ?? 0);

    selectors.board.record.textContent = this.#record;
  }

  // ------------------- GETTERS ------------------- //

  get score() {
    return this.#snake.score;
  }

  get record() {
    return this.#record ?? 0;
  }

  // ------------------- PRIVATE METHODS ------------------- //

  #init() {
    selectors.board.record.textContent = this.#record;

    this.#snake.on('score', score => {
      selectors.board.score.textContent = score;
    });

    this.reload();
  }
}
