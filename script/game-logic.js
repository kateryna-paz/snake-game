import CONFIG from "./config.js";
import { endGame } from "./game-controls.js";
import { changeAreaBg, draw, updateScore } from "./interface.js";
import gameState from "./state.js";
import { utilsFunctions } from "./utils.js";

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

export { changeDirection, gameLoop, generateSnake, generateApple };
