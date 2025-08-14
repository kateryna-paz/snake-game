const speedMs = 300;
const scorePerApple = 10;
const flashEffectDuration = 300;
let areaSize = 20;
let score = 0;
let gameStarted = false;
let boxSize;
let snake;
let apple;
let cells;
let direction = "RIGHT";
let gameInterval;

const playButton = document.getElementById("playButton");
const sizeMessage = document.getElementById("sizeMessage");
const darkBg = document.getElementById("darkBg");
const smallSizeBtn = document.getElementById("smallSize");
const mediumSizeBtn = document.getElementById("mediumSize");
const area = document.getElementById("gameArea");
const scoreElem = document.getElementById("score");
const finalScoreElem = document.getElementById("finalScore");
const gameOverElem = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");
const mobileControls = document.getElementById("mobileControls");

const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

/* Ініціалізація гри */
function init() {
  if (window.innerWidth <= 860) {
    mobileControls.classList.remove("hidden");
  }

  setupEventListeners();
}

/* Налаштування обробників подій */
function setupEventListeners() {
  playButton.addEventListener("click", pressStart);
  restartButton.addEventListener("click", pressStart);
  darkBg.addEventListener("click", closeMessage);
  smallSizeBtn.addEventListener("click", () => setGameAreaSize(20));
  mediumSizeBtn.addEventListener("click", () => setGameAreaSize(30));

  document.addEventListener("keydown", handleKeyPress);

  upBtn.addEventListener("click", () => changeDirection("UP"));
  downBtn.addEventListener("click", () => changeDirection("DOWN"));
  leftBtn.addEventListener("click", () => changeDirection("LEFT"));
  rightBtn.addEventListener("click", () => changeDirection("RIGHT"));
}

/* Функція для управління грою */
function pressStart() {
  closeMessage();
  reset();
  chooseSize();
}

/* Функція для вибору розміру поля */
function chooseSize() {
  darkBg.classList.remove("hidden");
  sizeMessage.classList.remove("hidden");
}

/* Функція закриття модальних вікон */
function closeMessage() {
  darkBg.classList.add("hidden");
  sizeMessage.classList.add("hidden");
  gameOverElem.classList.add("hidden");
}

/* Функція створення ігрового поля */
function setGameAreaSize(size) {
  areaSize = size;

  area.innerHTML = "";
  area.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  area.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    area.appendChild(cell);
  }

  cells = document.querySelectorAll(".cell");

  let x = 0,
    y = 0;
  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("x", x);
    cells[i].setAttribute("y", y);
    x++;
    if (x >= size) {
      x = 0;
      y++;
    }
  }

  startGame();
}

/* Функція для запуску гри */
function startGame() {
  closeMessage();
  clearInterval(gameInterval);

  gameStarted = true;

  generateSnake();
  generateApple();
  gameInterval = setInterval(gameLoop, speedMs);
  draw();
  updateScore();
}

/* Функція створення змійки у центрі поля */
function generateSnake() {
  const mid = Math.floor(areaSize / 2);
  snake = [
    { x: mid + 1, y: mid },
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
  ];
}

/* Функція створення яблука */
function generateApple() {
  if (!cells || cells.length === 0) return;

  const emptyCells = Array.from(cells).filter(
    (cell) =>
      !cell.classList.contains("snake") && !cell.classList.contains("snakeHead")
  );

  if (emptyCells.length === 0) return;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  apple = {
    x: parseInt(randomCell.getAttribute("x")),
    y: parseInt(randomCell.getAttribute("y")),
  };
}

/* Функція для перевірки зайнятості позиції */
function isPositionOccupied(position) {
  return snake.some(
    (segment) => segment.x === position.x && segment.y === position.y
  );
}

/* Функція перемалювання об'єктів на полі */
function draw() {
  if (!cells) return;

  cells.forEach((cell) => {
    cell.classList.remove("snake", "snakeHead", "apple");
  });

  snake.forEach((segment, idx) => {
    const index = segment.y * areaSize + segment.x;
    if (index >= 0 && index < cells.length) {
      if (idx === 0) {
        cells[index].classList.add("snakeHead");
      } else {
        cells[index].classList.add("snake");
      }
    }
  });

  const appleCellIndex = apple.y * areaSize + apple.x;
  const appleCell = cells[appleCellIndex];
  if (appleCell) {
    appleCell.classList.add("apple");
  }
}

/* Головний ігровий цикл */
function gameLoop() {
  if (!gameStarted) return;

  const head = { ...snake[0] };

  switch (direction) {
    case "UP":
      head.y -= 1;
      break;
    case "DOWN":
      head.y += 1;
      break;
    case "LEFT":
      head.x -= 1;
      break;
    case "RIGHT":
      head.x += 1;
      break;
  }

  if (
    head.x < 0 ||
    head.x >= areaSize ||
    head.y < 0 ||
    head.y >= areaSize ||
    isPositionOccupied(head)
  ) {
    changeAreaBg("errorFlash");
    setTimeout(() => endGame(), 150);
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    changeAreaBg("successFlash");
    score += scorePerApple;
    updateScore();
    generateApple();
  } else {
    snake.pop();
  }

  draw();
}

/* Функція оновлення рахунку на сторінці */
function updateScore() {
  scoreElem.textContent = score;
  scoreElem.classList.add("update");
  setTimeout(() => {
    scoreElem.classList.remove("update");
  }, 200);
}

/* Функція завершення гри */
function endGame() {
  gameStarted = false;
  clearInterval(gameInterval);

  finalScoreElem.textContent = score;

  darkBg.classList.remove("hidden");
  gameOverElem.classList.remove("hidden");
}

/* Функція скидання гри */
function reset() {
  areaSize = 20;
  score = 0;
  gameStarted = false;
  boxSize = 0;
  snake = [];
  apple = {};
  cells = null;
  direction = "RIGHT";
  clearInterval(gameInterval);
}

/* Функція обробки натискання клавіш */
function handleKeyPress(event) {
  if (!gameStarted) return;

  switch (event.key) {
    case "ArrowUp":
    case "Left":
    case "KeyW":
      event.preventDefault();
      changeDirection("UP");
      break;
    case "ArrowDown":
    case "Down":
    case "KeyS":
      event.preventDefault();
      changeDirection("DOWN");
      break;
    case "ArrowLeft":
    case "Left":
    case "KeyA":
      event.preventDefault();
      changeDirection("LEFT");
      break;
    case "ArrowRight":
    case "Right":
    case "KeyD":
      event.preventDefault();
      changeDirection("RIGHT");
      break;
  }
}

/* Функція зміни напрямку руху змійки */
function changeDirection(newDirection) {
  if (!gameStarted) return;

  const opposites = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT",
  };

  if (opposites[direction] !== newDirection) {
    direction = newDirection;
  } else {
    changeAreaBg("errorFlash");
  }
}

/* Функція зміни фону ігрової області */
function changeAreaBg(type) {
  area.classList.add(type);

  setTimeout(() => {
    area.classList.remove(type);
  }, flashEffectDuration);
}

/* Ініціалізація при завантаженні сторінки */
window.addEventListener("load", init);

/* Керування елементом mobileControls при зміні розміру вікна */
window.addEventListener("resize", () => {
  if (window.innerWidth <= 860) {
    mobileControls.classList.remove("hidden");
  } else {
    mobileControls.classList.add("hidden");
  }
});
