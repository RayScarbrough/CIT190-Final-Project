var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;

const birdPic = new Image();
const turtle = new Image();
const background = new Image();

// Game variables
var birds = [];
var score = 0;
var gameOver = false;
var birdInterval;
var imagesLoaded = 0;

// Image loading management
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 3) {
    enableGameStart();
    initialRender();
  }
}

// Assign image sources and event handlers
turtle.onload = imageLoaded;
background.onload = imageLoaded;
birdPic.onload = imageLoaded;
turtle.src = "./media/turtlePic.png";
background.src = "./media/Beach.jpg";
birdPic.src = "./media/birdPic.png";

var player = {
  width: 100,
  height: 70,
  x: canvas.width / 2 - 50,
  y: canvas.height - 60,
  speed: 7,
  dx: 0,
  lastDx: 1,
};

// Enable game controls after images are loaded
function enableGameStart() {
  document.getElementById("restart").removeAttribute("disabled");
  document.getElementById("restart").addEventListener("click", restartGame);
}

// Initial drawing of background and player
function initialRender() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  drawPlayer(player);
}

// Restart or start the game
function restartGame() {
  clearInterval(birdInterval);
  birds = [];
  score = 0;
  gameOver = false;
  player.x = canvas.width / 2 - 50;
  player.y = canvas.height - 60;
  player.dx = 0;
  update();
  birdInterval = setInterval(addBird, 350);
}

// Game loop
function update() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawPlayer(player);
    birds.forEach(drawBird);
    newPos();
    drawScore();
    requestAnimationFrame(update);
  } else {
    showGameOver();
    clearInterval(birdInterval);
  }
}

// Draw player and flips image depending on direction
function drawPlayer(player) {
  ctx.save();
  if (player.dx !== 0) {
    player.lastDx = player.dx;
  }
  if (player.lastDx < 0) {
    ctx.scale(-1, 1);
    ctx.drawImage(
      turtle,
      -player.x - player.width,
      player.y,
      player.width,
      player.height
    );
  } else {
    ctx.drawImage(turtle, player.x, player.y, player.width, player.height);
  }
  ctx.restore();
}

// Draw birds
function drawBird(bird) {
  ctx.drawImage(birdPic, bird.x, bird.y, 50, 50);
  bird.y += bird.dy;
}

// Add a new bird to the game
function addBird() {
  var x = Math.random() * (canvas.width - 30) + 15;
  var y = -30;
  var dy = 2 + Math.random() * 3;
  birds.push({ x, y, dy });
}

// Update position of player and birds
function newPos() {
  player.x += player.dx;
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
  birds = birds.filter(birdCollisionFilter);
}

// Filter function to handle collisions and bird removal
function birdCollisionFilter(bird) {
  if (
    bird.x < player.x + player.width &&
    bird.x + 50 > player.x &&
    bird.y < player.y + player.height &&
    bird.y + 50 > player.y
  ) {
    gameOver = true;
    return false;
  }
  if (bird.y > canvas.height) {
    score++;
    return false;
  }
  return true;
}

// draws/styles current score
function drawScore() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 30);
}

// Display game over message
function showGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "50px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 150, canvas.height / 2);
}

// Player movement functions
function moveRight() {
  player.dx = player.speed;
}
function moveLeft() {
  player.dx = -player.speed;
}

// Keyboard Controls
function keyDown(e) {
  if (e.key === "D" || e.key === "d") {
    moveRight(); // Moves player to the right
  } else if (e.key === "A" || e.key === "a") {
    moveLeft(); // Moves player to the left
  }
}

function keyUp(e) {
  if (e.key === "D" || e.key === "d" || e.key === "A" || e.key === "a") {
    player.dx = 0; // Stops horizontal movement
  }
}
//scrolls the page down to center the game on load
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.onload = function () {
  var elementToScrollTo = document.getElementById("gameContainer");
  elementToScrollTo.scrollIntoView({ behavior: "smooth" });
};
