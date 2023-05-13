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
  cover = [];

  selectedGrid = [-1, -1];

  mineSize = 10;

  gridColor = "#7D7461";
  coverColor = "#564d3e";
  backgroundColor = "#635C51";
  fontColor = "#202030";
  selectedColor = "#E9D985";
  highlightColor = "#cec59a";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getGrid(grids, x, y, w, h) {
  if (x < 0 || x >= w) return 0;
  if (y < 0 || y >= h) return 0;
  return grids[y][x] === -1 ? 1 : 0;
}

function revealGrid(grids, cover, x, y, w, h) {
  if (x < 0 || x >= w || y < 0 || y >= h) return;
  if (grids[y][x] === -1) return;

  if (cover[y][x] === 0) return;
  cover[y][x] = 0;

  if (getGrid(grids, x - 1, y - 1, w, h) === 1) return;
  if (getGrid(grids, x, y - 1, w, h) === 1) return;
  if (getGrid(grids, x + 1, y - 1, w, h) === 1) return;
  if (getGrid(grids, x - 1, y, w, h) === 1) return;
  if (getGrid(grids, x + 1, y, w, h) === 1) return;
  if (getGrid(grids, x - 1, y + 1, w, h) === 1) return;
  if (getGrid(grids, x, y + 1, w, h) === 1) return;
  if (getGrid(grids, x + 1, y + 1, w, h) === 1) return;

  revealGrid(grids, cover, x - 1, y - 1, w, h);
  revealGrid(grids, cover, x, y - 1, w, h);
  revealGrid(grids, cover, x + 1, y - 1, w, h);
  revealGrid(grids, cover, x - 1, y, w, h);
  revealGrid(grids, cover, x + 1, y, w, h);
  revealGrid(grids, cover, x - 1, y + 1, w, h);
  revealGrid(grids, cover, x, y + 1, w, h);
  revealGrid(grids, cover, x + 1, y + 1, w, h);
}

function checkIfAllFound(context) {
  let count = 0;

  const cover = context.cover;
  for (let y = 0; y < context.h; ++y) {
    for (let x = 0; x < context.w; ++x) {
      count += cover[y][x] === 0 ? 1 : 0;
    }
  }

  return (count + context.mineSize) === (context.w * context.h);
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

  // cover
  const cover = context.cover;
  ctx.fillStyle = context.coverColor;

  for (let y = 0; y < context.h; ++y) {
    for (let x = 0; x < context.w; ++x) {
      switch (cover[y][x]) {
        case 0:
          break;

        case 1:
          ctx.fillStyle = context.coverColor;
          ctx.fillRect(
            x * context.gridSize + 1,
            y * context.gridSize + 1,
            context.gridSize - 2,
            context.gridSize - 2);
          break;

        case 2:
          ctx.fillStyle = context.highlightColor;
          ctx.fillRect(
            x * context.gridSize + 1,
            y * context.gridSize + 1,
            context.gridSize - 2,
            context.gridSize - 2);
          break;

      }
    }
  }

  // selected
  if (
    0 <= context.selectedGrid[0] && context.selectedGrid[0] < context.w &&
    0 <= context.selectedGrid[1] && context.selectedGrid[1] < context.h) {

    ctx.fillStyle = context.selectedColor;
    ctx.fillRect(
      context.selectedGrid[0] * context.gridSize + 1,
      context.selectedGrid[1] * context.gridSize + 1,
      context.gridSize - 2,
      context.gridSize - 2);
  }
}

function init(context) {
  // create grid and cover
  const grids = context.grids;
  grids.splice(0, grids.length);

  for (let y = 0; y < context.h; ++y) {
    const array = Array(context.w).fill(0);
    grids.push(array);
  }

  const cover = context.cover;
  cover.splice(0, cover.length);

  for (let y = 0; y < context.h; ++y) {
    const array = Array(context.w).fill(1);
    cover.push(array);
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

  // reset state
  context.isGameOver = false;

  repaint(context);
}

function _loop(context) {
  if (context.isGameOver) {
    init(context);
  }
}

function loop(context) {
  _loop(context);
  setTimeout(() => loop(context), 1000);
}

function flagGrid(context) {
  const x = context.selectedGrid[0];
  const y = context.selectedGrid[1];
  if (x < 0 || x >= context.w || y < 0 || y >= context.h) return;

  const cover = context.cover;
  switch (cover[y][x]) {
    case 0:
      break;

    case 1:
      cover[y][x] = 2;
      break;

    case 2:
      cover[y][x] = 1;
      break;
  }

  repaint(context);
}

function onKeyDown(context, key) {
  switch (key) {
    case 't':
      flagGrid(context);
      break;
  }
}

function onMouseDown(context, event) {
  const x = context.selectedGrid[0];
  const y = context.selectedGrid[1];
  if (x < 0 || x >= context.w || y < 0 || y >= context.h) return;

  const cover = context.cover;
  if (cover[y][x] !== 1) return;

  const grids = context.grids;
  revealGrid(grids, cover, x, y, context.w, context.h);

  if (grids[y][x] === -1) {
    context.isGameOver = true;
    console.log("Game over!!!");
    return;
  }
  if (checkIfAllFound(context)) {
    context.isGameOver = true;
    console.log("You win!!!");
    return;
  }

  repaint(context);
}

function onMouseMove(context, event) {
  const rect = context.canvas.getBoundingClientRect();
  context.selectedGrid[0] = Math.floor((event.clientX - rect.left) / context.gridSize);
  context.selectedGrid[1] = Math.floor((event.clientY - rect.top) / context.gridSize);

  repaint(context);
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

window.onkeydown = event => onKeyDown(_context, event.key);
_canvas.onmousedown = event => onMouseDown(_context, event);
_canvas.onmousemove = event => onMouseMove(_context, event);

init(_context);
loop(_context);
