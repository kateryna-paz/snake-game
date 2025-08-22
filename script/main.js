import { updateMobileControls } from "./interface.js";
import { setupEventListeners } from "./event-handlers.js";

/* Ініціалізація гри */
const init = () => {
  updateMobileControls();
  setupEventListeners();
};

/* Завантаження гри */
window.addEventListener("load", init);
