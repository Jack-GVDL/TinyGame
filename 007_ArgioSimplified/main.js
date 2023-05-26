const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

class Context {
  canvas = null;
  ctx = null;

  w = 500;
  h = 500;

  ball = [0, 0];
  ballRadius = 5;
  ballEnlargement = 0.5;
  maxBallSize = 50;
  gridSize = 40;

  foods = [];
  foodRadius = 5;
  maxFoodSize = 50;
  foodPerTurn = 2;

  direction = [1, 0];
  speed = 3;
  speedReduction = 0.05;
  minSpeed = 1;

  frameInterval = 10;

  isGameOver = false;

  backgroundColor = "#DCEED1";
  ballColor = "#A18276";
  foodColor = "#736372";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function repaint(context) {
  // background
  const canvas = context.canvas;
  const ctx = context.ctx;

  ctx.fillStyle = context.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // grid
  ctx.lineWidth = 0.5;

  const offsetX = -context.ball[0] % context.gridSize;
  for (let x = 0; x < canvas.width; x += context.gridSize) {
    ctx.beginPath();
    ctx.moveTo(x + offsetX, 0);
    ctx.lineTo(x + offsetX, canvas.height);
    ctx.stroke();
  }

  const offsetY = -context.ball[1] % context.gridSize;
  for (let y = 0; y < canvas.height; y += context.gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + offsetY);
    ctx.lineTo(canvas.width, y + offsetY);
    ctx.stroke();
  }

  // ball
  const center = [canvas.width / 2, canvas.height / 2];

  ctx.beginPath();
  ctx.arc(center[0], center[1], context.ballRadius, 0, 2 * Math.PI);
  ctx.fillStyle = context.ballColor;
  ctx.fill();
  ctx.stroke();

  // food
  ctx.fillStyle = context.foodColor;
  for (const food of context.foods) {
    const offsetX = food[0] - context.ball[0];
    const offsetY = food[1] - context.ball[1];

    ctx.beginPath();
    ctx.arc(center[0] + offsetX, center[1] + offsetY, context.foodRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

function update(context) {
  // remove foods
  const w = context.w;
  const h = context.h;

  const foods = context.foods;
  for (let i = foods.length - 1; i >= 0; --i) {
    const food = foods[i];
    const offsetX = food[0] - context.ball[0];
    const offsetY = food[1] - context.ball[1];

    // outside scope
    // w instead of w / 2, h instead of h / 2
    // to prevent food immediately disappear once it outside the scope
    if (Math.abs(offsetX) > w || Math.abs(offsetY) > h) {
      foods.splice(i, 1);
      continue;
    }

    // eat by ball
    if (
      Math.abs(offsetX) <= context.ballRadius + context.foodRadius &&
      Math.abs(offsetY) <= context.ballRadius + context.foodRadius) {

      context.ballRadius = Math.min(context.ballRadius + context.ballEnlargement, context.maxBallSize);
      context.speed = Math.max(context.speed - context.speedReduction, context.minSpeed);
      foods.splice(i, 1);
    }
  }

  // randomly generate food if below limit
  if (foods.length < context.maxFoodSize) {
    const n = Math.min(context.foodPerTurn, context.maxFoodSize);
    for (let i = 0; i < n; ++i) {
      const x = getRandomInt(w) - w / 2;
      const y = getRandomInt(h) - h / 2;

      foods.push([context.ball[0] + x, context.ball[1] + y]);
    }
  }

  // ball position
  context.ball[0] += context.direction[0] * context.speed;
  context.ball[1] += context.direction[1] * context.speed;
}

function init(context) {
  repaint(context);
}

function _loop(context) {
  update(context);
  repaint(context);
}

function loop(context) {
  _loop(context);

  if (context.isGameOver) {
    console.log("Game Over!!!");
    return;
  }

  setTimeout(() => loop(context), context.frameInterval);
}

function onKeyDown(context, key) {
}

function onMouseDown(context, event) {
}

function onMouseMove(context, event) {
  const rect = context.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const w = context.canvas.width;
  context.direction[0] = Math.max(-1, Math.min((x - w / 2) / (w / 4), 1));

  const h = context.canvas.height;
  context.direction[1] = Math.max(-1, Math.min((y - h / 2) / (w / 4), 1));
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

window.onkeydown = event => onKeyDown(_context, event.key);
_canvas.onmousedown = event => onMouseDown(_context, event);
_canvas.onmousemove = event => onMouseMove(_context, event);

init(_context);
loop(_context);
