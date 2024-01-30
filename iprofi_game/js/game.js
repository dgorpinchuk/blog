const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rocketImage = new Image();
rocketImage.src = 'img/rocket.svg';

let rocket = { x: 100, y: canvas.height / 2, width: 50, height: 50, velocity: 0, gravity: 0.1 };  // Adjust width and height for a smaller collision box
let stars = [];
let score = 0;
let isGameOver = false;

function drawRocket() {
  ctx.save();
  ctx.translate(rocket.x + rocket.width / 2, rocket.y + rocket.height / 2);
  ctx.rotate((Math.PI / 180) * rocket.velocity * 8);
  ctx.drawImage(rocketImage, -rocket.width / 2, -rocket.height / 2, rocket.width, rocket.height);
  ctx.restore();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function drawStar(star) {
  ctx.fillStyle = `rgb(
          ${Math.floor(255 - 50 * getRandomInt(3))},
          ${Math.floor(255 - 50 * getRandomInt(3))},
          255)`;
  ctx.beginPath();

  const angleIncrement = (2 * Math.PI) / star.numAngles;
  const outerRadius = star.outerRadius;
  const innerRadius = star.innerRadius;

  for (let i = 0; i < star.numAngles * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * angleIncrement;
    const x = star.x + Math.cos(angle) * radius;
    const y = star.y + Math.sin(angle) * radius;
    ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.fill();
}

function drawScore() {
  // Draw the background
  ctx.fillStyle = "rgba(20, 23, 28, 0.8)";
  ctx.fillRect(5, 5, 110, 35); // Adjust the dimensions as needed

  // Draw the score label on top of the background
  ctx.font = "bold 20px sans";
  ctx.fillStyle = "#fff";
  ctx.fillText("Очков: " + score, 10, 30);
}

function moveRocket() {
  rocket.velocity += rocket.gravity;
  rocket.y += rocket.velocity;

  if (rocket.y + rocket.height > canvas.height) {
    rocket.y = canvas.height - rocket.height;
    rocket.velocity = 0;
    if (!isGameOver) {
      endGame();
    }
  }

  if (rocket.y < 0) {
    rocket.y = 0;
    rocket.velocity = 0;
  }
}

function generateStars() {
  if (!isGameOver && Math.random() < 0.02) {
    const starOuterRadius = Math.random() * 20 + 20; // Random outer radius between 10 and 20
    const starInnerRadius = starOuterRadius / 20;
    const numAngles = Math.floor(Math.random() * 10) + 10; // Random number of angles between 5 and 12
    stars.push({ x: canvas.width, y: Math.random() * canvas.height, outerRadius: starOuterRadius, innerRadius: starInnerRadius, numAngles: numAngles });
  }
}

function moveStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].x -= 3; // Adjust star speed

    if (
      rocket.x < stars[i].x + stars[i].outerRadius &&
      rocket.x + rocket.width > stars[i].x - stars[i].outerRadius &&
      rocket.y < stars[i].y + stars[i].outerRadius &&
      rocket.y + rocket.height > stars[i].y - stars[i].outerRadius
    ) {
      endGame();
    }

    if (stars[i].x + stars[i].outerRadius < 0) {
      stars.splice(i, 1);
      score++;
    }
  }
}

function endGame() {
  isGameOver = true;
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("scoreDisplay").innerText = score;
}

function restartGame() {
  isGameOver = false;
  document.getElementById("gameOver").style.display = "none";
  rocket = { x: 100, y: canvas.height / 10, width: 50, height: 50, velocity: 0, gravity: 0.1 };  // Reset width and height for a smaller collision box
  stars = [];
  score = 0;
  gameLoop(); // Start the game loop again after restarting
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRocket();
  moveRocket();

  generateStars();
  moveStars();
  stars.forEach(drawStar);

  drawScore();

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

document.addEventListener("keydown", function (event) {
  if (!isGameOver && event.keyCode === 32) { // Space key
    rocket.velocity = -2; // Adjust jump strength
  }
});

document.addEventListener("mousedown", function () {
  if (!isGameOver) {
    rocket.velocity = -2; // Adjust jump strength
  }
});

rocketImage.onload = function () {
  resizeCanvas();
  gameLoop();
};