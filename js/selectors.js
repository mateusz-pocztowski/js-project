const selectors = {
  menu: {
    container: document.querySelector('#menu'),
    buttons: document.querySelectorAll('.menu__buttons-btn'),
  },

  board: {
    container: document.querySelector('#board'),
    score: document.querySelector('#score'),
    record: document.querySelector('#record'),
  },

  gameOver: {
    container: document.querySelector('#game-over'),
    title: document.querySelector('#game-over .title'),
    restartBtn: document.querySelector('#restart-btn'),
    menuBtn: document.querySelector('#menu-btn'),
    score: document.querySelector('#game-over [data-score]'),
  },
};
