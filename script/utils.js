export const utilsFunctions = {
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
