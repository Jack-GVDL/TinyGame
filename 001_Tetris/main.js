const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

const Operation = {
  NONE: "NONE",
  ROTATE: "ROTATE",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  DOWN: "DOWN"
}

class Template {
  color = "";
  blocks = [];
}

const _template1 = new Template();
_template1.color = "#ACC18A";
_template1.blocks = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0]
]

const _template2 = new Template();
_template2.color = "#2D5D7B";
_template2.blocks = [
  [0, 1, 0],
  [0, 1, 0],
  [1, 1, 0]
];

const _template3 = new Template();
_template3.color = "#E9D758";
_template3.blocks = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 1]
];

const _template4 = new Template();
_template4.color = "#C2AFF0";
_template4.blocks = [
  [1, 1],
  [1, 1]
];

const _template5 = new Template();
_template5.color = "#FF8552";
_template5.blocks = [
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0]
];

const _template6 = new Template();
_template6.color = "#AFD2E9";
_template6.blocks = [
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 0]
];

const _template7 = new Template();
_template7.color = "#AFD2E9";
_template7.blocks = [
  [1, 1, 0],
  [0, 1, 1],
  [0, 0, 0]
];

class Tetromino {
  position = [0, 0];
  color = null;
  blocks = {};
}

class Context {
  canvas = null;
  ctx = null;

  isGameOver = false;

  w = 10;
  h = 20;
  gridSize = 10;

  templates = [];
  operations = [];
  tetromino = null;
  grids = [];

  backgroundColor = "#837A75";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function copy2dArray(array) {
  const h = array.length;
  const w = array[0].length;

  const result = [];
  for (let y = 0; y < h; ++y) {
    const temp = [];
    result.push(temp);

    for (let x = 0; x < w; ++x) {
      temp.push(array[y][x]);
    }
  }
  return result;
}

function fromTemplate(template) {
  const tetromino = new Tetromino();
  tetromino.position = [0, 0];
  tetromino.color = template.color;
  tetromino.blocks = Array.from(template.blocks);
  return tetromino;
}

function rotate(blocks) {
  const result = copy2dArray(blocks);
  const n = blocks.length;
  const buffer = Array(n).fill(0);

  for (let y = 0; y < Math.floor(n / 2); ++y) {
    let i = 0;
    for (let x = y; x < n - y; ++x) {
      buffer[i] = blocks[y][x];
      i++;
    }

    for (let x = y; x < n - y; ++x) result[y][x] = blocks[n - x - 1][y];
    for (let x = y; x < n - y; ++x) result[n - x - 1][y] = blocks[n - y - 1][n - x - 1];
    for (let x = y; x < n - y; ++x) result[n - y - 1][n - x - 1] = blocks[x][n - y - 1];

    i = 0;
    for (let x = y; x < n - y; ++x) {
      result[x][n - y - 1] = buffer[i];
      i++;
    }
  }

  return result;
}

function checkCollision(blocks, grids, offset) {
  const h = grids.length;
  const w = grids[0].length;

  const n = blocks.length;
  for (let y = 0; y < n; ++y) {
    for (let x = 0; x < n; ++x) {
      if (blocks[y][x] === 0) continue;

      const gridX = x + offset[0];
      const gridY = y + offset[1];

      if (gridX < 0 || gridX >= w) return true;
      if (gridY < 0 || gridY >= h) return true;

      if (grids[gridY][gridX] !== null) return true;
    }
  }

  return false;
}

function copyToGrids(grids, tetromino) {
  const blocks = tetromino.blocks;
  const offset = tetromino.position;

  const gridH = grids.length;
  const gridW = grids[0].length;

  const blockH = blocks.length;
  const blockW = blocks[0].length;

  for (let y = 0; y < blockH; ++y) {
    for (let x = 0; x < blockW; ++x) {
      if (blocks[y][x] === 0) continue;

      const gridX = x + offset[0];
      const gridY = y + offset[1];

      if (gridX < 0 || gridX >= gridW) continue;
      if (gridY < 0 || gridY >= gridH) continue;

      grids[gridY][gridX] = tetromino.color;
    }
  }
}

function attemptToDeleteRow(context) {
  const w = context.w;
  const h = context.h;

  let offset = 0;
  for (let y = h - 1; y >= 0; --y) {
    let count = 0;
    for (let x = 0; x < w; ++x) {
      count += context.grids[y][x] === null ? 0 : 1;
    }

    if (count === 0) {
      while (offset > 0) {
        for (let x = 0; x < w; ++x) {
          context.grids[y + offset][x] = null;
        }
        offset--;
      }
      return;
    }

    if (count === w) {
      offset++;
      continue;
    }

    if (offset > 0) {
      for (let x = 0; x < w; ++x) {
        context.grids[y + offset][x] = context.grids[y][x];
      }
    }
  }
}

function createTetromino(context) {
  const i = getRandomInt(context.templates.length);
  context.tetromino = fromTemplate(context.templates[i]);
  context.tetromino.position[0] =
    Math.floor(context.w / 2) - Math.floor(context.tetromino.blocks.length / 2);

  if (checkCollision(context.tetromino.blocks, context.grids, context.tetromino.position)) {
    context.isGameOver = true;
  }
}

function recalculateMovement(context) {
  const tetromino = context.tetromino;

  const nextPosition = [tetromino.position[0], tetromino.position[1] + 1];
  if (!checkCollision(tetromino.blocks, context.grids, nextPosition)) {
    tetromino.position = nextPosition;

  } else {
    copyToGrids(context.grids, tetromino);
    attemptToDeleteRow(context);
    createTetromino(context);
  }
}

function recalculateOperation(context) {
  const operations = context.operations;
  context.operations = [];

  const tetromino = context.tetromino;
  if (operations.includes(Operation.LEFT)) {
    const nextPosition = [tetromino.position[0] - 1, tetromino.position[1]];
    if (!checkCollision(tetromino.blocks, context.grids, nextPosition)) {
      tetromino.position = nextPosition;
    }

  } else if (operations.includes(Operation.RIGHT)) {
    const nextPosition = [tetromino.position[0] + 1, tetromino.position[1]];
    if (!checkCollision(tetromino.blocks, context.grids, nextPosition)) {
      tetromino.position = nextPosition;
    }

  }

  if (operations.includes(Operation.ROTATE)) {
    const nextBlocks = rotate(tetromino.blocks);
    if (!checkCollision(nextBlocks, context.grids, tetromino.position)) {
      tetromino.blocks = nextBlocks;
    }
  }
}

function recalculate(context) {
  recalculateMovement(context);
  recalculateOperation(context);
}

function repaint(context) {
  const canvas = context.canvas;
  const ctx = context.ctx;

  // background
  ctx.fillStyle = context.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // tetromino
  // - https://en.wikipedia.org/wiki/Tetromino
  const tetromino = context.tetromino
  ctx.fillStyle = tetromino.color;

  const n = tetromino.blocks.length;
  const w = context.w;
  const h = context.h;
  for (let y = 0; y < n; ++y) {
    for (let x = 0; x < n; ++x) {
      if (tetromino.blocks[y][x] === 0) continue;

      const gridX = x + tetromino.position[0];
      const gridY = y + tetromino.position[1];

      if (gridX < 0 || gridX >= w) continue;
      if (gridY < 0 || gridY >= h) continue;

      ctx.fillRect(
        gridX * context.gridSize, gridY * context.gridSize, context.gridSize, context.gridSize);
    }
  }

  // grids
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      if (context.grids[y][x] === null) continue;

      ctx.fillStyle = context.grids[y][x];
      ctx.fillRect(
        x * context.gridSize, y * context.gridSize, context.gridSize, context.gridSize);
    }
  }
}

function init(context) {
  context.grids = [];
  for (let y = 0; y < context.h; ++y) {
    const array = Array(context.w).fill(null);
    context.grids.push(array);
  }

  context.templates = [
    _template1,
    _template2,
    _template3,
    _template4,
    _template5,
    _template6
  ];

  createTetromino(context);
}

function _loop(context) {
  recalculate(context);
  repaint(context);
}

function loop(context) {
  _loop(context);

  if (context.isGameOver) {
    gameOver(_context);
    return;
  }

  setTimeout(() => loop(context), 200);
}

function gameOver(context) {
  console.log("Game Over!!!");
}

function onKeyDown(context, key) {
  const mapping = {
    "w": Operation.ROTATE,
    "a": Operation.LEFT,
    "s": Operation.DOWN,
    "d": Operation.RIGHT
  };

  if (!mapping[key]) return;

  const operation = mapping[key];
  if (!context.operations.includes(operation)) {
    context.operations.push(operation);
  }
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

window.onkeydown = event => onKeyDown(_context, event.key);

init(_context);
loop(_context);
