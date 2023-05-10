const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

class Context {
  canvas = null;
  ctx = null;

  isGameOver = false;

  w = 20;
  h = 20;
  gridSize = 20;
  grids = [];

  mineSize = 10;

  gridColor = "#7D7461";
  backgroundColor = "#635C51";
  fontColor = "#202030";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getGrid(grids, x, y, w, h) {
  if (x < 0 || x >= w) return 0;
  if (y < 0 || y >= h) return 0;
  return grids[y][x] === -1 ? 1 : 0;
}

function repaintGrid(grid, x, y, context) {
  const ctx = context.ctx;

  // draw base
  ctx.fillStyle = context.gridColor;
  ctx.fillRect(
    x * context.gridSize + 1,
    y * context.gridSize + 1,
    context.gridSize - 2,
    context.gridSize - 2);

  // draw number or mine
  if (grid === 0) {
    return;
  }

  let text = "";
  if (grid === -1) {
    text = "x";
  } else {
    text = grid.toString();
  }

  ctx.font = "16px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = context.fontColor;
  ctx.fillText(
    text,
    x * context.gridSize + context.gridSize / 2,
    y * context.gridSize + context.gridSize * 0.55);
}

function repaint(context) {
  // background
  const canvas = context.canvas;
  const ctx = context.ctx;

  ctx.fillStyle = context.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // grids
  const grids = context.grids;

  for (let y = 0; y < context.h; ++y) {
    for (let x = 0; x < context.w; ++x) {
      repaintGrid(grids[y][x], x, y, context);
    }
  }
}

function init(context) {
  const grids = context.grids;

  // create grid
  for (let y = 0; y < context.h; ++y) {
    const array = Array(context.w).fill(0);
    grids.push(array);
  }

  // place mine
  for (let i = 0; i < context.mineSize; ++i) {
    while (true) {
      const x = getRandomInt(context.w);
      const y = getRandomInt(context.h);

      if (grids[y][x] === -1) continue;

      grids[y][x] = -1;
      break;
    }
  }

  // calculate surrounding mine
  for (let y = 0; y < context.h; ++y) {
    for (let x = 0; x < context.w; ++x) {
      if (grids[y][x] === -1) continue;

      let count = 0;
      count += getGrid(grids, x - 1, y - 1, context.w, context.h);
      count += getGrid(grids, x, y - 1, context.w, context.h);
      count += getGrid(grids, x + 1, y - 1, context.w, context.h);

      count += getGrid(grids, x - 1, y, context.w, context.h);
      count += getGrid(grids, x + 1, y, context.w, context.h);

      count += getGrid(grids, x - 1, y + 1, context.w, context.h);
      count += getGrid(grids, x, y + 1, context.w, context.h);
      count += getGrid(grids, x + 1, y + 1, context.w, context.h);

      grids[y][x] = count;
    }
  }

  // TODO: test
  repaint(context);
}

function _loop(context) {
}

function loop(context) {
  _loop(context);
  setTimeout(() => loop(context), 1000);
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

init(_context);
loop(_context);
