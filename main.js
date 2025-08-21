const CONFIG = {
  DEFAULT_AREA_SIZE: 20,
  SPEED: 300,
  SCORE_PER_APPLE: 10,
  FLASH_DURATION: 300,
  MOBILE_BREAKPOINT: 860,
  DIRECTIONS: {
    UP: { x: 0, y: -1, key: ["ArrowUp", "KeyW"] },
    DOWN: { x: 0, y: 1, key: ["ArrowDown", "KeyS"] },
    LEFT: { x: -1, y: 0, key: ["ArrowLeft", "KeyA"] },
    RIGHT: { x: 1, y: 0, key: ["ArrowRight", "KeyD"] },
  },
  OPPOSITES: { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" },
};

let gameState = {
  areaSize: CONFIG.DEFAULT_AREA_SIZE,
  score: 0,
  started: false,
  direction: "RIGHT",
  snake: [],
  apple: {},
  cells: null,
  interval: null,
};

const DOM = {
  playButton: document.getElementById("playButton"),
  sizeForm: document.getElementById("sizeForm"),
  sizeMessage: document.getElementById("sizeMessage"),
  darkBg: document.getElementById("darkBg"),
  area: document.getElementById("gameArea"),
  scoreElem: document.getElementById("score"),
  finalScoreElem: document.getElementById("finalScore"),
  gameOverElem: document.getElementById("gameOver"),
  restartButton: document.getElementById("restartButton"),
  mobileControls: document.getElementById("mobileControls"),
};

const utilsFunctions = {
  getRandomItem: (array) => array[Math.floor(Math.random() * array.length)],
  coordsToIndex: (x, y, size) => y * size + x,
  indexToCoords: (index, size) => ({
    x: index % size,
    y: Math.floor(index / size),
  }),
  isInBounds: (pos, size) =>
    pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size,
  addClasses: (element, ...classes) => element.classList.add(...classes),
  removeClasses: (element, ...classes) => element.classList.remove(...classes),
  toggleClass: (element, className, condition) =>
    element.classList.toggle(className, condition),
  toggleModal: (show, ...elements) =>
    elements.forEach((el) => el.classList[show ? "remove" : "add"]("hidden")),
};

/* Функція створення змійки у центрі поля */
function generateSnake() {
  const mid = Math.floor(gameState.areaSize / 2);
  return [
    { x: mid + 1, y: mid },
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
  ];
}

/* Функція створення яблука */
function generateApple() {
  const emptyCells = Array.from(gameState.cells).filter(
    (cell) =>
      !cell.classList.contains("snake") && !cell.classList.contains("snakeHead")
  );

  if (emptyCells.length === 0) return;

  const randomCell = utilsFunctions.getRandomItem(emptyCells);
  return {
    x: parseInt(randomCell.getAttribute("x")),
    y: parseInt(randomCell.getAttribute("y")),
  };
}

/* Функція перевірки з'їденості яблука */
function isAppleEaten(head) {
  return head.x === gameState.apple.x && head.y === gameState.apple.y;
}

/* Функція для створення нової голови змійки */
function createNewHead(head) {
  const dir = CONFIG.DIRECTIONS[gameState.direction];
  return { x: head.x + dir.x, y: head.y + dir.y };
}

/* Функція для перевірки зіткнень */
function checkCollision(head) {
  return (
    !utilsFunctions.isInBounds(head, gameState.areaSize) ||
    gameState.snake.some(
      (segment) => segment.x === head.x && segment.y === head.y
    )
  );
}

/* Головний ігровий цикл */
function gameLoop() {
  if (!gameState.started) return;

  const newHead = createNewHead(gameState.snake[0]);

  if (checkCollision(newHead)) {
    changeAreaBg("errorFlash");
    setTimeout(() => endGame(), 150);
    return;
  }

  gameState.snake.unshift(newHead);

  if (isAppleEaten(newHead)) {
    changeAreaBg("successFlash");
    gameState.score += CONFIG.SCORE_PER_APPLE;
    updateScore();
    gameState.apple = generateApple();
  } else {
    gameState.snake.pop();
  }

  draw();
}

/* Функція зміни напрямку руху змійки */
function changeDirection(newDirection) {
  if (CONFIG.OPPOSITES[gameState.direction] !== newDirection) {
    gameState.direction = newDirection;
  } else {
    changeAreaBg("errorFlash");
  }
}

/* Функція створення ігрового поля */
function buildGameArea(size) {
  DOM.area.innerHTML = "";
  DOM.area.style.cssText = `
      grid-template-rows: repeat(${size}, 1fr);
      grid-template-columns: repeat(${size}, 1fr);
    `;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    const coords = utilsFunctions.indexToCoords(i, size);

    cell.setAttribute("x", coords.x);
    cell.setAttribute("y", coords.y);

    cell.classList.add("cell");

    fragment.appendChild(cell);
  }

  DOM.area.appendChild(fragment);
  gameState.cells = document.querySelectorAll(".cell");
}

/* Функція перемалювання об'єктів на полі */
function draw() {
  if (!gameState.cells) return;

  gameState.cells.forEach((cell) => {
    utilsFunctions.removeClasses(cell, "snake", "snakeHead", "apple");
  });

  gameState.snake.forEach((segment, idx) => {
    const index = utilsFunctions.coordsToIndex(
      segment.x,
      segment.y,
      gameState.areaSize
    );
    if (gameState.cells[index]) {
      utilsFunctions.addClasses(
        gameState.cells[index],
        idx === 0 ? "snakeHead" : "snake"
      );
    }
  });

  if (gameState.apple) {
    const appleIndex = utilsFunctions.coordsToIndex(
      gameState.apple.x,
      gameState.apple.y,
      gameState.areaSize
    );
    if (gameState.cells[appleIndex]) {
      utilsFunctions.addClasses(gameState.cells[appleIndex], "apple");
    }
  }
}

/* Функція оновлення рахунку на сторінці */
function updateScore() {
  DOM.scoreElem.textContent = gameState.score;
  utilsFunctions.addClasses(DOM.scoreElem, "update");
  setTimeout(() => utilsFunctions.removeClasses(DOM.scoreElem, "update"), 200);
}

/* Функція зміни фону ігрової області */
function changeAreaBg(type) {
  utilsFunctions.addClasses(DOM.area, type);

  setTimeout(() => {
    utilsFunctions.removeClasses(DOM.area, type);
  }, CONFIG.FLASH_DURATION);
}

/* Функції для відображення модальних вікон */
const showSizeDialog = () =>
  utilsFunctions.toggleModal(true, DOM.darkBg, DOM.sizeMessage);
const showGameOverDialog = () =>
  utilsFunctions.toggleModal(true, DOM.darkBg, DOM.gameOverElem);
const hideModals = () =>
  utilsFunctions.toggleModal(
    false,
    DOM.darkBg,
    DOM.sizeMessage,
    DOM.gameOverElem
  );

/* Функція оновлення кнопок мобільного керування  */
const updateMobileControls = () =>
  utilsFunctions.toggleClass(
    DOM.mobileControls,
    "hidden",
    window.innerWidth > CONFIG.MOBILE_BREAKPOINT
  );

/* Функція для управління грою */
function pressStart() {
  hideModals();
  reset();
  showSizeDialog();
}

/* Функція для запуску гри */
function startGame() {
  hideModals();
  clearInterval(gameState.interval);

  gameState.started = true;
  gameState.snake = generateSnake();
  gameState.apple = generateApple();
  gameState.interval = setInterval(gameLoop, CONFIG.SPEED);

  draw();
  updateScore();
}

/* Функція завершення гри */
function endGame() {
  gameState.started = false;
  clearInterval(gameState.interval);
  DOM.finalScoreElem.textContent = gameState.score;
  showGameOverDialog();
}

/* Функція скидання гри */
function reset() {
  Object.assign(gameState, {
    size: 20,
    score: 0,
    started: false,
    direction: "RIGHT",
    snake: [],
    apple: {},
    cells: null,
  });
  clearInterval(gameState.interval);
}

/* Функція вибору розміру поля */
function selectSize(e) {
  e.preventDefault();
  const selectedSize = document.querySelector('input[name="gridSize"]:checked');
  if (selectedSize) {
    gameState.areaSize = parseInt(selectedSize.value);
    buildGameArea(gameState.areaSize);
    startGame();
  }
}

/* Функція обробки натискання клавіш */
function handleKeyPress(e) {
  if (!gameState.started) return;

  const direction = Object.entries(CONFIG.DIRECTIONS).find(([_, dir]) =>
    dir.key.includes(e.code)
  )?.[0];

  if (direction) {
    e.preventDefault();
    changeDirection(direction);
  }
}

/* Налаштування обробників подій */
function setupEventListeners() {
  DOM.playButton.addEventListener("click", pressStart);
  DOM.restartButton.addEventListener("click", pressStart);
  DOM.sizeForm.addEventListener("submit", selectSize);
  DOM.darkBg.addEventListener("click", hideModals);

  document.addEventListener("keydown", handleKeyPress);

  ["upBtn", "downBtn", "leftBtn", "rightBtn"].forEach((btnId) => {
    const direction = btnId.replace("Btn", "").toUpperCase();
    document
      .getElementById(btnId)
      ?.addEventListener("click", () => changeDirection(direction));
  });

  window.addEventListener("resize", updateMobileControls);
}

/* Ініціалізація гри */
const init = () => {
  updateMobileControls();
  setupEventListeners();
};

/* Ініціалізація при завантаженні сторінки */
window.addEventListener("load", init);
