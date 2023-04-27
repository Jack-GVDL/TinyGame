const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

class Context {
  canvas = null;
  ctx = null;

  w = 600;
  h = 400;

  ball = [0, 0];
  ballSize = 6;
  ballVelocity = [5, 5];

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
  if (context.ball[0] + context.ballVelocity[0] < 0) {
    context.ball[0] = context.ballVelocity[0] - context.ball[0];
    context.ballVelocity[0] = boundRandomly(Math.abs(context.ballVelocity[0]));

  } else if (context.ball[0] + context.ballVelocity[0] >= context.w) {
    context.ball[0] = context.w - ((context.ball[0] + context.ballVelocity[0]) - context.w);
    context.ballVelocity[0] = -boundRandomly(Math.abs(context.ballVelocity[0]));

  } else {
    context.ball[0] += context.ballVelocity[0];
  }

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
  ctx.fillRect(canvas.width - 5, 0, 5, canvas.height);

  ctx.fillStyle = context.ballColor;
  ctx.fillRect(context.ball[0], context.ball[1], context.ballSize, context.ballSize);
}

function init(context) {
  context.w = context.canvas.width;
  context.h = context.canvas.height;

  context.ball[0] = 100;
  context.ball[1] = 100;
}

function _loop(context) {
  recalculate(context);
  repaint(context);
}

function loop(context) {
  _loop(context);
  setTimeout(() => loop(context), 10);
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

init(_context);
loop(_context);
