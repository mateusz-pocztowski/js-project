const levels = {
  easy: { boardSize: 10, speed: 250 },
  normal: { boardSize: 15, speed: 100 },
  expert: { boardSize: 20, speed: 50 },
};

const getSettings = async () => {
  const { buttons, container } = selectors.menu;

  return new Promise(resolve => {
    const listener = e => {
      resolve(levels[e.target.dataset.level]);

      container.classList.remove('popup--visible');
    };

    container.classList.add('popup--visible');
    buttons.forEach(button => button.addEventListener('click', listener));
  });
};
