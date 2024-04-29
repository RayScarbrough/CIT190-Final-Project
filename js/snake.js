const snakeBoard = document.querySelector("#snakeBoard");
const ctx = snakeBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const restartButton = document.querySelector("#restart");
const gameWidth = snakeBoard.width;
const gameHeight = snakeBoard.height;
const snakeColor = "#00a2ff";
const snakeBorder = "black";
const foodColor = "red";
const boardBackground = "black";
const eatSound = new Audio("media/pop.mp3");
eatSound.volume = 0.8;
const unitSize = 25;
let running = false;
let xVel = unitSize;
let yVel = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

// stops arrow keys from scrolling the page up and down
window.addEventListener(
  "keydown",
  function (event) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();
    }
  },
  false
);

window.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", restartGame);

initializeGame();

// Set up the game initially
function initializeGame() {
  clear();
  drawGrid();
  makeFood();
  drawFood();
  drawSnake();
}

// Start game loop
function startGame() {
  if (!running) {
    running = true;
    scoreText.textContent = score;
    nextTick();
  }
}

// Main game loop with timing
function nextTick() {
  if (running) {
    setTimeout(() => {
      clear();
      drawGrid();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 75);
  } else {
    displayGameOver();
  }
}

// Clear the game board
function clear() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// Draw the grid background
function drawGrid() {
  for (let x = 0; x <= gameWidth; x += unitSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gameHeight);
    ctx.strokeStyle = "grey";
    ctx.stroke();
  }

  for (let y = 0; y <= gameHeight; y += unitSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gameWidth, y);
    ctx.strokeStyle = "grey";
    ctx.stroke();
  }
}

// Generate random position for food
function makeFood() {
  function randFood(min, max) {
    return (
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
    );
  }
  foodX = randFood(0, gameWidth - unitSize);
  foodY = randFood(0, gameWidth - unitSize);
}

// Draw food on the board
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.beginPath();
  ctx.arc(
    foodX + unitSize / 2,
    foodY + unitSize / 2,
    unitSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

// Move the snake based on current velocity
function moveSnake() {
  const head = { x: snake[0].x + xVel, y: snake[0].y + yVel };
  snake.unshift(head);
  if (snake[0].x === foodX && snake[0].y === foodY) {
    score++;
    scoreText.textContent = score;
    makeFood();
    eatSound.play();
  } else {
    snake.pop();
  }
}

// Draw the snake on the board
function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

// Controls to change the snakes direction
function changeDirection(event) {
  const pressed = event.keyCode;
  const left = 65;
  const right = 68;
  const up = 87;
  const down = 83;

  switch (true) {
    case pressed === left && xVel !== unitSize:
      xVel = -unitSize;
      yVel = 0;
      break;
    case pressed === right && xVel !== -unitSize:
      xVel = unitSize;
      yVel = 0;
      break;
    case pressed === up && yVel !== unitSize:
      xVel = 0;
      yVel = -unitSize;
      break;
    case pressed === down && yVel !== -unitSize:
      xVel = 0;
      yVel = unitSize;
      break;
  }
}

// Check for collision with walls or self
function checkGameOver() {
  if (
    snake[0].x < 0 ||
    snake[0].x >= gameWidth ||
    snake[0].y < 0 ||
    snake[0].y >= gameHeight
  ) {
    running = false;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      running = false;
    }
  }
}

// Display game over screen
function displayGameOver() {
  ctx.font = "50px MV boli";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", gameWidth / 2, gameHeight / 2 - 25);
  ctx.fillText(`Score: ${score}`, gameWidth / 2, gameHeight / 2 + 25);
  running = false;
}

// Restart the game
function restartGame() {
  score = 0;
  xVel = unitSize;
  yVel = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  startGame();
}
