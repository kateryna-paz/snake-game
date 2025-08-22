import CONFIG from "./config.js";
import gameState from "./state.js";
import DOM from "./dom-elements.js";
import { pressStart, selectSize } from "./game-controls.js";
import { hideModals, updateMobileControls } from "./interface.js";
import { changeDirection } from "./game-logic.js";

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
export function setupEventListeners() {
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
