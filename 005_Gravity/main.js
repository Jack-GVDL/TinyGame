const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

class Entity {
  position = [0, 0];
  velocity = [0, 0];

  entitySize = 2;
  tail = [];

  entityColor = "#508991";
  tailColor = [117, 221, 221];
}

class Context {
  canvas = null;
  ctx = null;

  origin = null;
  entities = [];

  backgroundColor = "#172A3A";
  originColor = "#508991";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getSquaredDistance(entity1, entity2) {
  const a = entity1.position[0] - entity2.position[0];
  const b = entity1.position[1] - entity2.position[1];
  return a ** 2 + b ** 2;
}

function recalculateVelocity(context, entity) {
  for (const e of context.entities) {
    if (e === entity) continue;

    const distance = getSquaredDistance(e, entity);
    const disX = e.position[0] - entity.position[0];
    const disY = e.position[1] - entity.position[1];
    const scale = Math.abs(disX) + Math.abs(disY);

    entity.velocity[0] += 100 * (disX / scale) / distance;
    entity.velocity[1] += 100 * (disY / scale) / distance;
  }
}

function recalculateEntity(context, entity) {
  // velocity
  recalculateVelocity(context, entity);

  const distance = getSquaredDistance(context.origin, entity);
  const disX = context.origin.position[0] - entity.position[0];
  const disY = context.origin.position[1] - entity.position[1];
  const scale = Math.abs(disX) + Math.abs(disY);

  entity.velocity[0] += 1000 * (disX / scale) / distance;
  entity.velocity[1] += 1000 * (disY / scale) / distance;

  // position
  if (entity.tail.length > 30) entity.tail.splice(0, 1);
  entity.tail.push([entity.position[0], entity.position[1]]);

  entity.position[0] += entity.velocity[0];
  entity.position[1] += entity.velocity[1];
}

function recalculate(context) {
  for (const entity of context.entities) {
    recalculateEntity(context, entity);
  }
}

function repaint(context) {
  const canvas = context.canvas;
  const ctx = context.ctx;

  ctx.fillStyle = context.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = context.originColor;
  ctx.fillRect(
    context.origin.position[0] - context.origin.entitySize,
    context.origin.position[1] - context.origin.entitySize,
    context.origin.entitySize * 2,
    context.origin.entitySize * 2);

  for (const entity of context.entities) {
    ctx.fillStyle = entity.entityColor;
    ctx.fillRect(
      entity.position[0] - entity.entitySize,
      entity.position[1] - entity.entitySize,
      entity.entitySize * 2,
      entity.entitySize * 2);

    ctx.lineWidth = 1;
    let alpha = 0;
    for (let i = 1; i < entity.tail.length; ++i) {
      ctx.strokeStyle =
        "rgba(" + entity.tailColor[0] + "," + entity.tailColor[1] + "," + entity.tailColor[2] + "," + alpha + ")";
      alpha += 0.03;

      ctx.beginPath();
      ctx.moveTo(entity.tail[i - 1][0], entity.tail[i - 1][1]);
      ctx.lineTo(entity.tail[i][0], entity.tail[i][1]);
      ctx.stroke();
    }
  }
}

function init(context) {
  // for (let i = 0; i < 20; ++i) {
  //   const entity = new Entity();
  //   entity.position[0] = getRandomInt(1200);
  //   entity.position[1] = getRandomInt(1200);
  //   entity.velocity[0] = (getRandomInt(100) - 50) / 50;
  //   entity.velocity[1] = (getRandomInt(100) - 50) / 50;
  //   context.entities.push(entity);
  // }

  const entity1 = new Entity();
  entity1.position[0] = 300;
  entity1.position[1] = 600;
  entity1.velocity[0] = 0;
  entity1.velocity[1] = 1.5;
  context.entities.push(entity1);

  const entity2 = new Entity();
  entity2.position[0] = 900;
  entity2.position[1] = 600;
  entity2.velocity[0] = 0;
  entity2.velocity[1] = -1.5;
  context.entities.push(entity2);

  const entity3 = new Entity();
  entity3.position[0] = 600;
  entity3.position[1] = 300;
  entity3.velocity[0] = -1.5;
  entity3.velocity[1] = 0;
  context.entities.push(entity3);

  const entity4 = new Entity();
  entity4.position[0] = 600;
  entity4.position[1] = 900;
  entity4.velocity[0] = 1.5;
  entity4.velocity[1] = 0;
  context.entities.push(entity4);

  context.origin = new Entity();
  context.origin.position[0] = 600;
  context.origin.position[1] = 600;
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
