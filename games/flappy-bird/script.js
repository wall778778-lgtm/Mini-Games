const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const restartBtn = document.getElementById("restart");

let bird;
let pipes;
let score;
let gameOver;

function startGame() {
    bird = {
        x: 80,
        y: 300,
        width: 30,
        height: 30,
        velocity: 0,
        gravity: 0.5,
        jump: -8
    };

    pipes = [];
    score = 0;
    gameOver = false;

    scoreText.textContent = score;

    createPipe();

    requestAnimationFrame(gameLoop);
}


function createPipe() {
    let gap = 150;
    let topHeight = Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - gap,
        width: 50,
        passed: false
    });
}


function drawBird() {
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(
        bird.x,
        bird.y,
        15,
        0,
        Math.PI * 2
    );
    ctx.fill();
}


function drawPipes() {
    ctx.fillStyle = "#22c55e";

    pipes.forEach(pipe => {

        ctx.fillRect(
            pipe.x,
            0,
            pipe.width,
            pipe.top
        );

        ctx.fillRect(
            pipe.x,
            canvas.height - pipe.bottom,
            pipe.width,
            pipe.bottom
        );

    });
}


function update() {

    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;


    if (pipes.length === 0 || pipes[pipes.length - 1].x < 220) {
        createPipe();
    }


    pipes.forEach(pipe => {

        pipe.x -= 3;


        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score++;
            scoreText.textContent = score;
            pipe.passed = true;
        }


        if (
            bird.x + bird.width / 2 > pipe.x &&
            bird.x - bird.width / 2 < pipe.x + pipe.width &&
            (
                bird.y - bird.height / 2 < pipe.top ||
                bird.y + bird.height / 2 > canvas.height - pipe.bottom
            )
        ) {
            endGame();
        }

    });


    if (bird.y < 0 || bird.y > canvas.height) {
        endGame();
    }


    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}


function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBird();
    drawPipes();
}


function gameLoop() {

    update();
    draw();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}


function jump() {

    if (!gameOver) {
        bird.velocity = bird.jump;
    }

}


function endGame() {

    gameOver = true;

    setTimeout(() => {
        alert("Game Over! Score: " + score);
    }, 100);

}


canvas.addEventListener("click", jump);

canvas.addEventListener("touchstart", jump);


restartBtn.addEventListener("click", startGame);


startGame();