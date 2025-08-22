import CONFIG from "./config.js";
import gameState from "./state.js";
import DOM from "./dom-elements.js";
import { gameLoop, generateApple, generateSnake } from "./game-logic.js";
import {
  buildGameArea,
  draw,
  hideModals,
  showGameOverDialog,
  showSizeDialog,
  updateScore,
} from "./interface.js";

/* Функція для управління грою */
export function pressStart() {
  hideModals();
  reset();
  showSizeDialog();
}

/* Функція для запуску гри */
export function startGame() {
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
export function endGame() {
  gameState.started = false;
  clearInterval(gameState.interval);
  DOM.finalScoreElem.textContent = gameState.score;
  showGameOverDialog();
}

/* Функція скидання гри */
export function reset() {
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
export function selectSize(e) {
  e.preventDefault();
  const selectedSize = document.querySelector('input[name="gridSize"]:checked');
  if (selectedSize) {
    gameState.areaSize = parseInt(selectedSize.value);
    buildGameArea(gameState.areaSize);
    startGame();
  }
}
