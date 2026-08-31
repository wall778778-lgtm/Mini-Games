const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");
const message = document.getElementById("message");



/* =========================================
   GAME SETTINGS
========================================= */

const FOV = Math.PI / 3;

const MOVE_SPEED = 2.8;

const ROTATE_SPEED = 0.003;

const WALL_SIZE = 1;

const MAX_DISTANCE = 20;



/* =========================================
   MAZE

   # = wall
   . = empty space
   S = player start
========================================= */

const maze = [

    "###############",

    "#S............#",

    "#.#####.#####.#",

    "#.....#.#.....#",

    "#####.#.#.#####",

    "#.....#.#.....#",

    "#.#####.#####.#",

    "#.............#",

    "#.#####.#####.#",

    "#.....#.#.....#",

    "#####.#.#.#####",

    "#.....#.#.....#",

    "#.#####.#####.#",

    "#.............#",

    "###############"

];



const mapWidth = maze[0].length;
const mapHeight = maze.length;



/* =========================================
   PLAYER
========================================= */

let player = {

    x: 1.5,

    y: 1.5,

    angle: 0

};



let keys = {};

let gameStarted = false;

let level = 1;

let lives = 3;



/* =========================================
   RESIZE
========================================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();



/* =========================================
   FIND START
========================================= */

function findStart() {

    for (let y = 0; y < mapHeight; y++) {

        for (let x = 0; x < mapWidth; x++) {

            if (maze[y][x] === "S") {

                player.x = x + 0.5;

                player.y = y + 0.5;

                return;

            }

        }

    }

}



/* =========================================
   COLLISION
========================================= */

function isWall(x, y) {

    const mapX = Math.floor(x);
    const mapY = Math.floor(y);

    if (
        mapX < 0 ||
        mapX >= mapWidth ||
        mapY < 0 ||
        mapY >= mapHeight
    ) {

        return true;

    }

    return maze[mapY][mapX] === "#";

}



function canMove(x, y) {

    const radius = 0.2;

    return (

        !isWall(x - radius, y - radius) &&
        !isWall(x + radius, y - radius) &&
        !isWall(x - radius, y + radius) &&
        !isWall(x + radius, y + radius)

    );

}



/* =========================================
   MOVEMENT
========================================= */

function updatePlayer(delta) {

    if (!gameStarted) {
        return;
    }

    let forward = 0;
    let strafe = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        forward += 1;

    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        forward -= 1;

    }

    if (keys["a"]) {

        strafe -= 1;

    }

    if (keys["d"]) {

        strafe += 1;

    }


    if (
        forward === 0 &&
        strafe === 0
    ) {

        return;

    }


    const length =
        Math.sqrt(
            forward * forward +
            strafe * strafe
        );


    forward /= length;

    strafe /= length;


    const speed =
        MOVE_SPEED * delta;


    const moveX =
        (
            Math.cos(player.angle) * forward -
            Math.sin(player.angle) * strafe
        ) * speed;


    const moveY =
        (
            Math.sin(player.angle) * forward +
            Math.cos(player.angle) * strafe
        ) * speed;


    const newX =
        player.x + moveX;


    const newY =
        player.y + moveY;


    if (canMove(newX, player.y)) {

        player.x = newX;

    }


    if (canMove(player.x, newY)) {

        player.y = newY;

    }

}



/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        keys[event.key.toLowerCase()] = true;

    }
);


document.addEventListener(
    "keyup",
    function (event) {

        keys[event.key.toLowerCase()] = false;

    }
);



/* =========================================
   MOUSE LOOK
========================================= */

canvas.addEventListener(
    "click",
    function () {

        if (!gameStarted) {

            gameStarted = true;

            message.textContent =
                "Find your way through the maze...";

        }

        canvas.requestPointerLock();

    }
);


document.addEventListener(
    "mousemove",
    function (event) {

        if (
            document.pointerLockElement === canvas
        ) {

            player.angle +=
                event.movementX *
                ROTATE_SPEED;

        }

    }
);



/* =========================================
   RAYCASTING
========================================= */

function castRay(angle) {

    const step = 0.02;

    let distance = 0;


    while (
        distance < MAX_DISTANCE
    ) {

        const x =
            player.x +
            Math.cos(angle) * distance;


        const y =
            player.y +
            Math.sin(angle) * distance;


        if (isWall(x, y)) {

            return distance;

        }


        distance += step;

    }


    return MAX_DISTANCE;

}



/* =========================================
   DRAW SKY + FLOOR
========================================= */

function drawBackground() {

    const half =
        canvas.height / 2;


    ctx.fillStyle = "#101820";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        half
    );


    ctx.fillStyle = "#090909";

    ctx.fillRect(
        0,
        half,
        canvas.width,
        half
    );

}



/* =========================================
   DRAW 3D WALLS
========================================= */

function draw3D() {

    drawBackground();


    const rayCount =
        canvas.width;


    const stripWidth =
        canvas.width / rayCount;


    for (
        let ray = 0;
        ray < rayCount;
        ray++
    ) {


        const cameraX =
            ray / rayCount;


        const rayAngle =
            player.angle -
            FOV / 2 +
            cameraX * FOV;


        let distance =
            castRay(rayAngle);


        /*
            Fish-eye correction.
        */

        distance *=
            Math.cos(
                rayAngle -
                player.angle
            );


        const wallHeight =
            canvas.height /
            distance;


        const top =
            (
                canvas.height -
                wallHeight
            ) / 2;


        const brightness =
            Math.max(
                0.12,
                1 - distance / MAX_DISTANCE
            );


        /*
            We use grayscale lighting
            so the maze has a dark,
            mysterious appearance.
        */

        const shade =
            Math.floor(
                70 * brightness
            );


        ctx.fillStyle =
            `rgb(${shade}, ${shade}, ${shade})`;


        ctx.fillRect(
            ray,
            top,
            stripWidth + 1,
            wallHeight
        );

    }

}



/* =========================================
   GAME LOOP
========================================= */

let lastTime = performance.now();


function gameLoop(currentTime) {

    const delta =
        (currentTime - lastTime) / 1000;


    lastTime = currentTime;


    /*
        Prevent huge movement if
        the browser freezes for a moment.
    */

    const safeDelta =
        Math.min(delta, 0.05);


    updatePlayer(safeDelta);

    draw3D();


    requestAnimationFrame(gameLoop);

}



/* =========================================
   START
========================================= */

function startGame() {

    level = 1;

    lives = 3;


    levelText.textContent =
        level;


    livesText.textContent =
        lives;


    findStart();


    gameStarted = false;


    message.textContent =
        "Click to enter the maze";

}


startGame();

requestAnimationFrame(gameLoop);
