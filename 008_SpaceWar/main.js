// Game canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Spaceship object
const spaceship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  angle: 0,
  rotationSpeed: 0.05,
  velocity: {
    x: 0,
    y: 0
  },
  acceleration: 0.1,
  resistance: 0.01,

  isThrusting: false
};

// Keyboard controls
const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});
document.addEventListener("keyup", function (event) {
  delete keys[event.key];
});

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // Rotate spaceship
  if (keys['a']) {
    spaceship.angle -= spaceship.rotationSpeed;
  }
  if (keys['d']) {
    spaceship.angle += spaceship.rotationSpeed;
  }

  // Thrust spaceship
  if (keys['w']) {
    spaceship.velocity.x += Math.cos(spaceship.angle) * spaceship.acceleration;
    spaceship.velocity.y += Math.sin(spaceship.angle) * spaceship.acceleration;
    spaceship.isThrusting = true;

  } else {
    spaceship.isThrusting = false;
  }

  // Slow down spaceship by resistance
  if (spaceship.velocity.x > 0) {
    spaceship.velocity.x = Math.max(0, spaceship.velocity.x - spaceship.resistance);
  } else {
    spaceship.velocity.x = Math.min(0, spaceship.velocity.x + spaceship.resistance);
  }

  if (spaceship.velocity.y > 0) {
    spaceship.velocity.y = Math.max(0, spaceship.velocity.y - spaceship.resistance);
  } else {
    spaceship.velocity.y = Math.min(0, spaceship.velocity.y + spaceship.resistance);
  }

  // Update spaceship position
  spaceship.x += spaceship.velocity.x;
  spaceship.y += spaceship.velocity.y;

  // Wrap spaceship around the screen
  if (spaceship.x < 0) {
    spaceship.x = canvas.width;
  } else if (spaceship.x > canvas.width) {
    spaceship.x = 0;
  }
  if (spaceship.y < 0) {
    spaceship.y = canvas.height;
  } else if (spaceship.y > canvas.height) {
    spaceship.y = 0;
  }
}

// Render game
function render() {
  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw spaceship
  context.save();
  context.translate(spaceship.x, spaceship.y);
  context.rotate(spaceship.angle + Math.PI / 2);
  context.beginPath();
  context.moveTo(0, -spaceship.radius);
  context.lineTo(spaceship.radius, spaceship.radius);
  context.lineTo(-spaceship.radius, spaceship.radius);
  context.closePath();
  context.strokeStyle = "#383326";
  context.stroke();

  if (spaceship.isThrusting) {
    context.beginPath();
    context.moveTo(-spaceship.radius / 2, spaceship.radius);
    context.lineTo(spaceship.radius / 2, spaceship.radius);
    context.lineTo(0, spaceship.radius + spaceship.radius / 2);
    context.closePath();
    context.strokeStyle = "#ff0000";
    context.stroke();
  }
  context.restore();
}

// Start the game
gameLoop();