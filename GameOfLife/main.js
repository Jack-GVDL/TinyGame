const _canvas = document.getElementById("canvas");
const _ctx = _canvas.getContext("2d");

class Template {
  blocks = [];
}

const _template0 = new Template();
_template0.blocks = [
  [1]
];

const _template1 = new Template();
_template1.blocks = [
  [1, 1],
  [1, 1]
];

const _template2 = new Template();
_template2.blocks = [
  [1, 1, 0, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 0, 1, 1]
]

const _template3 = new Template();
_template3.blocks = [
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 1]
]

const _template4 = new Template();
_template4.blocks = [
  [1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 1]
]

const _template5 = new Template();
_template5.blocks = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

class Context {
  canvas = null;
  ctx = null;

  interval = 10;
  updateInterval = 25;
  isUpdate = false;

  w = 500;
  h = 500;
  gridSize = 2;
  grids = [];

  templates = []
  template = null;
  templateIndex = 0;
  templatePosition = [0, 0];

  isApplyTemplate = false;

  backgroundColor = "#837A75";
  gridColor = "#AFD2E9";
  templateColor= "#C2AFF0";
}

function recalculateMap(context) {
  if (!context.isUpdate) return;
  context.isUpdate = false;

  const grids = context.grids;
  for (let y = 1; y < context.h + 1; ++y) {
    for (let x = 1; x < context.w + 1; ++x) {
      const count =
        (grids[y - 1][x - 1] & 1) +
        (grids[y - 1][x] & 1) +
        (grids[y - 1][x + 1] & 1) +
        (grids[y][x - 1] & 1) +
        (grids[y][x + 1] & 1) +
        (grids[y + 1][x - 1] & 1) +
        (grids[y + 1][x] & 1) +
        (grids[y + 1][x + 1] & 1);

      if ((grids[y][x] & 1) === 1) {
        grids[y][x] |= (count === 2 || count === 3) ? 2 : 0;
      } else {
        grids[y][x] |= count === 3 ? 2 : 0;
      }
    }
  }

  for (let y = 1; y < context.h + 1; ++y) {
    for (let x = 1; x < context.w + 1; ++x) {
      grids[y][x] >>= 1;
    }
  }
}

function recalculateApply(context) {
  if (!context.isApplyTemplate) return;
  context.isApplyTemplate = false;

  if (context.template === null) return;

  const blocks = context.template.blocks;
  const pos = context.templatePosition;
  const blockH = blocks.length;
  const blockW = blocks[0].length;

  for (let y = 0; y < blockH; ++y) {
    for (let x = 0; x < blockW; ++x) {
      const gridX = x + pos[0];
      const gridY = y + pos[1];

      if (gridX < 1 || gridX > context.w + 1) continue;
      if (gridY < 1 || gridY > context.h + 1) continue;
      if (blocks[y][x] === 0) continue;

      context.grids[gridY][gridX] = 1;
    }
  }
}

function recalculate(context) {
  recalculateApply(context);
  recalculateMap(context);
}

function repaint(context) {
  const canvas = context.canvas;
  const ctx = context.ctx;

  ctx.fillStyle = context.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = context.gridColor;
  const grids = context.grids;
  const gridSize = context.gridSize;
  for (let y = 0; y < context.h + 2; ++y) {
    for (let x = 0; x < context.w + 2; ++x) {
      if (grids[y][x] === 0) continue;
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }

  const template = context.template;
  if (template !== null) {
    const blockH = template.blocks.length;
    const blockW = template.blocks[0].length;
    const pos = context.templatePosition;

    ctx.fillStyle = context.templateColor;

    for (let y = 0; y < blockH; ++y) {
      for (let x = 0; x < blockW; ++x) {
        const gridX = x + pos[0];
        const gridY = y + pos[1];
        if (gridX <= 1 || gridX > context.w + 1) continue;
        if (gridY <= 1 || gridY > context.h + 1) continue;
        if (template.blocks[y][x] === 0) continue;
        ctx.fillRect(gridX * gridSize, gridY * gridSize, gridSize, gridSize);
      }
    }
  }
}

function init(context) {
  context.grids = [];
  for (let y = 0; y < context.h + 2; ++y) {
    const array = Array(context.w + 2).fill(0);
    context.grids.push(array);
  }

  context.templates = [
    _template0,
    _template1,
    _template2,
    _template3,
    _template4,
    _template5
  ];
  context.templatePosition = [20, 20];
  context.template = context.templates[context.templateIndex];
}

function _loop(context) {
  recalculate(context);
  repaint(context);
}

function loop(context) {
  _loop(context);
  setTimeout(() => loop(context), context.interval);
}

function update(context) {
  context.isUpdate = true;
  setTimeout(() => update(context), context.updateInterval);
}

function onKeyDown(context, key) {
  const n = context.templates.length;
  switch (key) {
    case 'w':
      context.templateIndex = (context.templateIndex + 1) % n;
      context.template = context.templates[context.templateIndex];
      break;

    case 's':
      context.templateIndex = (context.templateIndex - 1 + n) % n;
      context.template = context.templates[context.templateIndex];
      break;
  }
}

function onMouseDown(context, event) {
  _context.isApplyTemplate = true;
}

function onMouseMove(context, event) {
  const rect = context.canvas.getBoundingClientRect();
  const x = Math.floor(Math.max(0, event.clientX - rect.left));
  const y = Math.floor(Math.max(0, event.clientY - rect.top));

  context.templatePosition = [
    Math.floor(x / context.gridSize),
    Math.floor(y / context.gridSize)
  ];
}

const _context = new Context();
_context.canvas = _canvas;
_context.ctx = _ctx;

window.onkeydown = event => onKeyDown(_context, event.key);
_canvas.onmousedown = event => onMouseDown(_context, event);
_canvas.onmousemove = event => onMouseMove(_context, event);

init(_context);
loop(_context);
update(_context);
