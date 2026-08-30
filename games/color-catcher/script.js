const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");

const restartButton = document.getElementById("restartButton");


let player;
let ball;

let score;
let lives;

let gameRunning;

let leftPressed = false;
let rightPressed = false;

let ballSpeed;

let lastTime;
let ballTimer;



const colors = [
    {
        name: "red",
        value: "#ef4444"
    },

    {
        name: "blue",
        value: "#3b82f6"
    },

    {
        name: "green",
        value: "#22c55e"
    },

    {
        name: "yellow",
        value: "#facc15"
    }
];



function startGame() {

    player = {

        x: 210,

        y: 540,

        width: 180,

        height: 25,

        speed: 7

    };


    ball = null;


    score = 0;

    lives = 3;


    ballSpeed = 3;


    ballTimer = 0;


    gameRunning = true;


    leftPressed = false;

    rightPressed = false;


    resultCard.classList.add("hidden");


    updateUI();


    lastTime = performance.now();


    requestAnimationFrame(gameLoop);
}



function createBall() {

    const color =
        colors[
            Math.floor(
                Math.random() * colors.length
            )
        ];


    ball = {

        x: 40 + Math.random() * 520,

        y: -20,

        radius: 15,

        color: color

    };

}



function update(deltaTime) {

    if (!gameRunning) {
        return;
    }


    const dt =
        Math.min(deltaTime / 16.67, 2);


    // Player movement

    if (leftPressed) {

        player.x -=
            player.speed * dt;

    }


    if (rightPressed) {

        player.x +=
            player.speed * dt;

    }


    // Keep player inside screen

    if (player.x < 0) {

        player.x = 0;

    }


    if (
        player.x + player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }


    // Create a new ball

    if (!ball) {

        ballTimer += deltaTime;


        if (ballTimer > 500) {

            createBall();

            ballTimer = 0;

        }

    }


    if (ball) {

        ball.y +=
            ballSpeed * dt;


        // Check if player catches ball

        if (isBallCaught()) {

            if (
                ball.color.name ===
                getPlayerColor()
            ) {

                score++;

                ball = null;

                ballSpeed += 0.12;

            } else {

                loseLife();

                ball = null;

            }

            updateUI();

        }


        // Ball reached bottom

        else if (
            ball.y - ball.radius >
            canvas.height
        ) {

            loseLife();

            ball = null;

            updateUI();

        }

    }

}



function getPlayerColor() {

    const zoneWidth =
        player.width / 4;


    const center =
        player.x +
        player.width / 2;


    const zone =
        Math.floor(
            center /
            (canvas.width / 4)
        );


    return colors[
        Math.min(zone, 3)
    ].name;

}



function isBallCaught() {

    return (

        ball.y + ball.radius >=
        player.y &&

        ball.y - ball.radius <=
        player.y + player.height &&

        ball.x >= player.x &&

        ball.x <=
        player.x + player.width

    );

}



function loseLife() {

    lives--;


    if (lives <= 0) {

        endGame();

    }

}



function updateUI() {

    scoreElement.textContent =
        score;


    livesElement.textContent =
        "❤️".repeat(lives);

}



function drawBackground() {

    ctx.fillStyle = "#0f172a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Four color zones

    const zoneWidth =
        canvas.width / 4;


    for (let i = 0; i < 4; i++) {

        ctx.globalAlpha = 0.15;

        ctx.fillStyle =
            colors[i].value;

        ctx.fillRect(
            i * zoneWidth,
            canvas.height - 70,
            zoneWidth,
            70
        );

    }


    ctx.globalAlpha = 1;


    // Zone labels

    ctx.font = "20px Arial";

    ctx.textAlign = "center";


    for (let i = 0; i < 4; i++) {

        ctx.fillStyle =
            colors[i].value;

        ctx.fillText(
            colors[i].name.toUpperCase(),
            i * zoneWidth +
                zoneWidth / 2,
            canvas.height - 30
        );

    }

}



function drawPlayer() {

    const zoneWidth =
        canvas.width / 4;


    const center =
        player.x +
        player.width / 2;


    const zone =
        Math.min(
            Math.floor(
                center / zoneWidth
            ),
            3
        );


    ctx.fillStyle =
        colors[zone].value;


    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );


    ctx.font = "22px Arial";

    ctx.textAlign = "center";

    ctx.fillStyle = "white";

    ctx.fillText(
        "CATCH",
        center,
        player.y + 20
    );

}



function drawBall() {

    if (!ball) {
        return;
    }


    ctx.fillStyle =
        ball.color.value;


    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle = "white";

    ctx.lineWidth = 2;

    ctx.stroke();

}



function draw() {

    drawBackground();

    drawBall();

    drawPlayer();

}



function gameLoop(currentTime) {

    const deltaTime =
        currentTime - lastTime;


    lastTime = currentTime;


    update(deltaTime);

    draw();


    if (gameRunning) {

        requestAnimationFrame(gameLoop);

    }

}



function endGame() {

    gameRunning = false;


    resultTitle.textContent =
        "💥 Game Over";


    resultScore.textContent =
        "Score: " + score;


    resultCard.classList.remove("hidden");

}



function keyDown(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        leftPressed = true;

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        rightPressed = true;

    }

}



function keyUp(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        leftPressed = false;

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        rightPressed = false;

    }

}



document.addEventListener(
    "keydown",
    keyDown
);


document.addEventListener(
    "keyup",
    keyUp
);



/*
    Mobile controls:
    Touch the left side = move left
    Touch the right side = move right
*/

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        const rect =
            canvas.getBoundingClientRect();


        const touch =
            event.touches[0];


        const x =
            touch.clientX -
            rect.left;


        if (
            x <
            rect.width / 2
        ) {

            leftPressed = true;

        } else {

            rightPressed = true;

        }

    },
    { passive: false }
);



canvas.addEventListener(
    "touchend",
    function(event) {

        event.preventDefault();

        leftPressed = false;

        rightPressed = false;

    },
    { passive: false }
);



restartButton.addEventListener(
    "click",
    startGame
);



startGame();
