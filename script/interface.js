import CONFIG from "./config.js";
import gameState from "./state.js";
import DOM from "./dom-elements.js";
import { utilsFunctions } from "./utils.js";

/* Функція створення ігрового поля */
export function buildGameArea(size) {
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
export function draw() {
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
export function updateScore() {
  DOM.scoreElem.textContent = gameState.score;
  utilsFunctions.addClasses(DOM.scoreElem, "update");
  setTimeout(() => utilsFunctions.removeClasses(DOM.scoreElem, "update"), 200);
}

/* Функція зміни фону ігрової області */
export function changeAreaBg(type) {
  utilsFunctions.addClasses(DOM.area, type);

  setTimeout(() => {
    utilsFunctions.removeClasses(DOM.area, type);
  }, CONFIG.FLASH_DURATION);
}

/* Функції для відображення модальних вікон */
export const showSizeDialog = () =>
  utilsFunctions.toggleModal(true, DOM.darkBg, DOM.sizeMessage);
export const showGameOverDialog = () =>
  utilsFunctions.toggleModal(true, DOM.darkBg, DOM.gameOverElem);
export const hideModals = () =>
  utilsFunctions.toggleModal(
    false,
    DOM.darkBg,
    DOM.sizeMessage,
    DOM.gameOverElem
  );

/* Функція оновлення кнопок мобільного керування  */
export const updateMobileControls = () =>
  utilsFunctions.toggleClass(
    DOM.mobileControls,
    "hidden",
    window.innerWidth > CONFIG.MOBILE_BREAKPOINT
  );
