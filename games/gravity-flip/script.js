const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const starsElement = document.getElementById("stars");

const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");

const restartButton = document.getElementById("restartButton");


let player;
let obstacles;
let stars;

let score;
let collectedStars;

let gravityDirection;

let gameSpeed;

let gameRunning;

let lastTime;
let obstacleTimer;
let starTimer;



function startGame() {

    player = {
        x: 120,
        y: 330,

        width: 30,
        height: 30,

        velocityY: 0
    };


    obstacles = [];
    stars = [];


    score = 0;
    collectedStars = 0;


    gravityDirection = 1;


    gameSpeed = 5;


    obstacleTimer = 0;
    starTimer = 0;


    gameRunning = true;


    resultCard.classList.add("hidden");


    scoreElement.textContent = "0";
    starsElement.textContent = "0";


    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}



function flipGravity() {

    if (!gameRunning) {
        return;
    }

    gravityDirection *= -1;

    player.velocityY = 0;
}



function createObstacle() {

    const width = 35;

    const height =
        35 + Math.random() * 45;


    let obstacle;


    if (Math.random() < 0.5) {

        // Floor spike

        obstacle = {

            x: canvas.width + 30,

            y: canvas.height - height - 30,

            width: width,

            height: height,

            type: "floor"

        };

    } else {

        // Ceiling spike

        obstacle = {

            x: canvas.width + 30,

            y: 30,

            width: width,

            height: height,

            type: "ceiling"

        };

    }


    obstacles.push(obstacle);
}



function createStar() {

    stars.push({

        x: canvas.width + 30,

        y:
            gravityDirection === 1
                ? 100 + Math.random() * 150
                : 150 + Math.random() * 150,

        radius: 10

    });

}



function update(deltaTime) {

    if (!gameRunning) {
        return;
    }


    const dt = Math.min(deltaTime / 16.67, 2);


    score += dt;


    scoreElement.textContent =
        Math.floor(score);


    // Gravity

    player.velocityY +=
        0.45 * gravityDirection * dt;


    player.y +=
        player.velocityY * dt;


    // Keep player on the floor/ceiling

    const floor =
        canvas.height - 30;


    const ceiling = 30;


    if (gravityDirection === 1) {

        if (player.y + player.height > floor) {

            player.y =
                floor - player.height;

            player.velocityY = 0;

        }

    } else {

        if (player.y < ceiling) {

            player.y = ceiling;

            player.velocityY = 0;

        }

    }


    // Create obstacles

    obstacleTimer += deltaTime;


    if (obstacleTimer > 900) {

        createObstacle();

        obstacleTimer = 0;

    }


    // Create stars

    starTimer += deltaTime;


    if (starTimer > 1300) {

        createStar();

        starTimer = 0;

    }


    // Move obstacles

    for (const obstacle of obstacles) {

        obstacle.x -=
            gameSpeed * dt;

    }


    // Move stars

    for (const star of stars) {

        star.x -=
            gameSpeed * dt;

    }


    // Collision with obstacles

    for (const obstacle of obstacles) {

        if (isColliding(player, obstacle)) {

            endGame();

            return;

        }

    }


    // Collect stars

    for (const star of stars) {

        const dx =
            player.x +
            player.width / 2 -
            star.x;

        const dy =
            player.y +
            player.height / 2 -
            star.y;


        const distance =
            Math.sqrt(dx * dx + dy * dy);


        if (distance < 25) {

            collectedStars++;

            score += 25;

            star.x = -100;

            starsElement.textContent =
                collectedStars;

        }

    }


    // Remove old objects

    obstacles =
        obstacles.filter(
            obstacle => obstacle.x > -100
        );


    stars =
        stars.filter(
            star => star.x > -100
        );


    // Gradually increase speed

    gameSpeed +=
        0.001 * dt;

}



function isColliding(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}



function drawBackground() {

    ctx.fillStyle = "#0f172a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Floor

    ctx.fillStyle = "#334155";

    ctx.fillRect(
        0,
        canvas.height - 30,
        canvas.width,
        30
    );


    // Ceiling

    ctx.fillRect(
        0,
        0,
        canvas.width,
        30
    );


    // Center lines

    ctx.strokeStyle = "#1e293b";

    ctx.setLineDash([10, 15]);

    ctx.beginPath();

    ctx.moveTo(0, canvas.height / 2);

    ctx.lineTo(canvas.width, canvas.height / 2);

    ctx.stroke();

    ctx.setLineDash([]);

}



function drawPlayer() {

    ctx.font = "30px Arial";

    ctx.fillText(
        "🤖",
        player.x,
        player.y + 28
    );

}



function drawObstacles() {

    for (const obstacle of obstacles) {

        ctx.fillStyle = "#ef4444";


        ctx.beginPath();


        if (obstacle.type === "floor") {

            ctx.moveTo(
                obstacle.x,
                obstacle.y + obstacle.height
            );

            ctx.lineTo(
                obstacle.x + obstacle.width / 2,
                obstacle.y
            );

            ctx.lineTo(
                obstacle.x + obstacle.width,
                obstacle.y + obstacle.height
            );

        } else {

            ctx.moveTo(
                obstacle.x,
                obstacle.y
            );

            ctx.lineTo(
                obstacle.x + obstacle.width / 2,
                obstacle.y + obstacle.height
            );

            ctx.lineTo(
                obstacle.x + obstacle.width,
                obstacle.y
            );

        }


        ctx.closePath();

        ctx.fill();

    }

}



function drawStars() {

    ctx.font = "25px Arial";


    for (const star of stars) {

        ctx.fillText(
            "⭐",
            star.x - 12,
            star.y + 9
        );

    }

}



function drawGravityIndicator() {

    ctx.font = "18px Arial";

    ctx.fillStyle = "#94a3b8";


    if (gravityDirection === 1) {

        ctx.fillText(
            "GRAVITY ↓",
            20,
            55
        );

    } else {

        ctx.fillText(
            "GRAVITY ↑",
            20,
            canvas.height - 45
        );

    }

}



function draw() {

    drawBackground();

    drawStars();

    drawObstacles();

    drawPlayer();

    drawGravityIndicator();

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
        "💥 You Crashed!";


    resultScore.textContent =
        "Score: " +
        Math.floor(score) +
        " • Stars: " +
        collectedStars;


    resultCard.classList.remove("hidden");

}



restartButton.addEventListener(
    "click",
    startGame
);



document.addEventListener(
    "keydown",
    function(event) {

        if (event.code === "Space") {

            event.preventDefault();

            flipGravity();

        }

    }
);



canvas.addEventListener(
    "click",
    flipGravity
);



canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        flipGravity();

    },
    { passive: false }
);



startGame();