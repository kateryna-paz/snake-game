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

export default CONFIG;
