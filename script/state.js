import CONFIG from "./config.js";

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

export default gameState;
