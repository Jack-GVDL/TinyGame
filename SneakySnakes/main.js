const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

const Direction = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
}

class Context {
  canvas = null;
  ctx = null;

  isGameOver = false;

  w = 50;
  h = 25;
  gridSize = 10;

  direction = Direction.UP;
  nextDirection = Direction.UP;

  body = [];
  obstacles = [];
  obstacleTable = [];
  goal = [10, 10];

  backgroundColor = "#BDCFB5";
  bodyColor = "#B287A3";
  obstacleColor = "#482728";
  goalColor = "#808150";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function init(context) {
  context.body = [[7, 5], [6, 5], [5, 5]];

  context.obstacles = [[2, 0], [2, 1], [2, 2]];

  context.obstacleTable = [];
  for (let y = 0; y < context.h; ++y) {
    const array = Array(context.w).fill(0);
    context.obstacleTable.push(array);
  }

  for (const part of context.obstacles) {
    context.obstacleTable[part[1]][part[0]] = 1;
  }
}

function repaint(context) {
  const canvas = context.canvas;
  const ctx = context.ctx;

  // background
  ctx.fillStyle = context.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // body
  ctx.fillStyle = context.bodyColor;
  for (const part of context.body) {
    ctx.fillRect(
      part[0] * context.gridSize, part[1] * context.gridSize,
      context.gridSize, context.gridSize);
  }

  // obstacle
  ctx.fillStyle = context.obstacleColor;
  for (const part of context.obstacles) {
    ctx.fillRect(
      part[0] * context.gridSize, part[1] * context.gridSize,
      context.gridSize, context.gridSize);
  }

  // goal
  ctx.fillStyle = context.goalColor;
  ctx.fillRect(
    context.goal[0] * context.gridSize, context.goal[1] * context.gridSize,
    context.gridSize, context.gridSize);
}

function recalculate(context) {
  // move
  const last = context.body[context.body.length - 1];

  let next = [0, 0];
  switch (context.direction) {
    case Direction.UP:
      next = [last[0], ((last[1] - 1) + context.h) % context.h];
      break;

    case Direction.DOWN:
      next = [last[0], ((last[1] + 1) + context.h) % context.h];
      break;

    case Direction.LEFT:
      next = [((last[0] - 1) + context.w) % context.w, last[1]];
      break;

    case Direction.RIGHT:
      next = [((last[0] + 1) + context.w) % context.w, last[1]];
      break;
  }

  // obstacle
  if (context.obstacleTable[next[1]][next[0]] === 1) {
    console.log("Hitting obstacle.");
    context.isGameOver = true;
    return;
  }

  // goal
  if (next[0] === context.goal[0] && next[1] === context.goal[1]) {
    while (true) {
      const x = getRandomInt(context.w);
      const y = getRandomInt(context.h);

      if (x === context.goal[0] && y === context.goal[0]) continue;
      if (context.obstacleTable[y][x] === 1) continue;
      if (context.body.some(part => part[0] === x && part[1] === y)) continue;

      context.goal[0] = x;
      context.goal[1] = y;
      break;
    }

  } else {
    context.body.splice(0, 1);
  }

  // body
  if (context.body.some(part => part[0] === next[0] && part[1] === next[1])) {
    console.log("Eating body.");
    context.isGameOver = true;
    return;
  }

  context.body.push(next);
}

function changeDirection(context) {
  if (context.direction === context.nextDirection) return;

  const opposite = {};
  opposite[Direction.UP] = Direction.DOWN;
  opposite[Direction.DOWN] = Direction.UP;
  opposite[Direction.LEFT] = Direction.RIGHT;
  opposite[Direction.RIGHT] = Direction.LEFT;
  if (context.nextDirection === opposite[context.direction]) return;

  context.direction = context.nextDirection;
}

function onKeyDown(context, key) {
  const mapping = {
    "w": Direction.UP,
    "a": Direction.LEFT,
    "s": Direction.DOWN,
    "d": Direction.RIGHT
  };

  if (!mapping[key]) return;

  context.nextDirection = mapping[key];
}

function _loop(context) {
  changeDirection(context);
  recalculate(context);
  repaint(context);
}

function loop(context) {
  _loop(context);

  if (context.isGameOver) {
    gameOver(_context);
    return;
  }

  setTimeout(() => loop(context), 100);
}

function gameOver(context) {
  console.log("Game Over!!!");
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

window.onkeydown = event => onKeyDown(_context, event.key);

init(_context);
loop(_context);
