const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

const Direction = {
  STOP: 0,
  UP: 1,
  DOWN: 2
}

class Context {
  canvas = null;
  ctx = null;

  isGameOver = false;

  w = 600;
  h = 400;

  ball = [0, 0];
  ballSize = 6;
  ballVelocity = [0, 0];

  padY = 10;
  padSize = 100;
  movingSpeed = 10;

  direction = Direction.STOP;

  backgroundColor = "#33202A";
  borderColor = "#5F5566";
  ballColor = "#80ADA0";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function boundRandomly(velocity) {
  const value= velocity + (getRandomInt(3) - 1);
  return Math.max(2, Math.min(value, 8));
}

function recalculate(context) {
  // pad
  switch (context.direction) {
    case Direction.UP:
      context.padY -= context.movingSpeed;
      break;

    case Direction.DOWN:
      context.padY += context.movingSpeed;
      break;
  }

  context.padY = Math.max(0, Math.min(context.padY, context.h - context.padSize));

  // x
  if (context.ball[0] + context.ballVelocity[0] < 0) {
    context.ball[0] = context.ballVelocity[0] - context.ball[0];
    context.ballVelocity[0] = boundRandomly(Math.abs(context.ballVelocity[0]));

  } else if (context.ball[0] + context.ballVelocity[0] >= context.w) {
    if (context.ball[1] < context.padY || context.ball[1] > context.padY + context.padSize) {
      context.isGameOver = true;
      return;
    }

    context.ball[0] = context.w - ((context.ball[0] + context.ballVelocity[0]) - context.w);
    context.ballVelocity[0] = -boundRandomly(Math.abs(context.ballVelocity[0]));

  } else {
    context.ball[0] += context.ballVelocity[0];
  }

  // y
  if (context.ball[1] + context.ballVelocity[1] < 0) {
    context.ball[1] = context.ballVelocity[1] - context.ball[1];
    context.ballVelocity[1] = boundRandomly(Math.abs(context.ballVelocity[1]));

  } else if (context.ball[1] + context.ballVelocity[1] >= context.h) {
    context.ball[1] = context.h - ((context.ball[1] + context.ballVelocity[1]) - context.h);
    context.ballVelocity[1] = -boundRandomly(Math.abs(context.ballVelocity[1]));

  } else {
    context.ball[1] += context.ballVelocity[1];
  }
}

function repaint(context) {
  const canvas = context.canvas;
  const ctx = context.ctx;

  ctx.fillStyle = context.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = context.borderColor;
  ctx.fillRect(0, 0, canvas.width, 5);
  ctx.fillRect(0, canvas.height - 5, canvas.width, 5);
  ctx.fillRect(0, 0, 5, canvas.height);
  // ctx.fillRect(canvas.width - 5, 0, 5, canvas.height);
  ctx.fillRect(canvas.width - 5, context.padY, 5, context.padSize);

  ctx.fillStyle = context.ballColor;
  ctx.fillRect(context.ball[0], context.ball[1], context.ballSize, context.ballSize);
}

function reset(context) {
  if (!context.isGameOver) return;

  context.isGameOver = false;

  context.ball[0] = 100;
  context.ball[1] = 100;
  context.ballVelocity = [-5, 5]
}

function init(context) {
  context.w = context.canvas.width;
  context.h = context.canvas.height;

  context.ball[0] = 100;
  context.ball[1] = 100;
  context.ballVelocity = [-5, 5]
}

function _loop(context) {
  recalculate(context);
  repaint(context);
  reset(context);
}

function loop(context) {
  _loop(context);
  setTimeout(() => loop(context), 10);
}

function onKeyDown(context, key) {
  switch (key) {
    case 'w':
      context.direction = Direction.UP;
      break;

    case 's':
      context.direction = Direction.DOWN;
      break;
  }
}

function onKeyUp(context, key) {
  switch (key) {
    case 'w':
      if (context.direction === Direction.UP) {
        context.direction = Direction.STOP;
      }
      break;

    case 's':
      if (context.direction === Direction.DOWN) {
        context.direction = Direction.STOP;
      }
      break;
  }
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

window.onkeydown = event => onKeyDown(_context, event.key);
window.onkeyup = event => onKeyUp(_context, event.key);

init(_context);
loop(_context);
