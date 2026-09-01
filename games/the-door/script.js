const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const roomNumber =
    document.getElementById("roomNumber");

const livesText =
    document.getElementById("lives");

const puzzleText =
    document.getElementById("puzzleText");

const message =
    document.getElementById("message");

const interactButton =
    document.getElementById("interactButton");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const joystick =
    document.getElementById("joystick");

const joystickStick =
    document.getElementById("joystickStick");



/* =====================================================
   GAME SETTINGS
===================================================== */

const ROOM_WIDTH = 1000;
const ROOM_HEIGHT = 650;

const PLAYER_RADIUS = 18;

const PLAYER_SPEED = 260;

const DOOR_WIDTH = 120;
const DOOR_HEIGHT = 145;

const WALL_SIZE = 35;



/* =====================================================
   GAME STATE
===================================================== */

let gameRunning = false;

let room = 1;

let lives = 3;

let currentPuzzle = null;

let nearbyDoor = null;

let gameOver = false;



/* =====================================================
   CAMERA
===================================================== */

let camera = {

    x: 0,

    y: 0

};



/* =====================================================
   PLAYER
===================================================== */

let player = {

    x: ROOM_WIDTH / 2,

    y: ROOM_HEIGHT - 130,

    radius: PLAYER_RADIUS

};



/* =====================================================
   INPUT
===================================================== */

const keys = {

    up: false,

    down: false,

    left: false,

    right: false

};



/* =====================================================
   DOORS
===================================================== */

let doors = [];



function createDoors() {

    const gap = 25;

    const totalWidth =
        DOOR_WIDTH * 4 +
        gap * 3;

    const startX =
        (ROOM_WIDTH - totalWidth) / 2;


    doors = [];


    const symbols = [
        "△",
        "○",
        "□",
        "☆"
    ];


    for (let i = 0; i < 4; i++) {

        doors.push({

            x:
                startX +
                i * (DOOR_WIDTH + gap),

            y: 35,

            width: DOOR_WIDTH,

            height: DOOR_HEIGHT,

            symbol: symbols[i],

            number: i + 1,

            opened: false

        });

    }

}



/* =====================================================
   PUZZLE GENERATOR
===================================================== */

function generatePuzzle() {

    const answer =
        Math.floor(Math.random() * 4);


    const names = [
        "triangle",
        "circle",
        "square",
        "star"
    ];


    const statements = [];


    /*
    LEVEL 1-2
    Simple clue puzzle
    */

    if (room <= 2) {

        statements.push(

            `Door ${answer + 1} is the correct door.`

        );


        for (let i = 1; i < 4; i++) {

            const wrongDoor =
                (answer + i) % 4;

            statements.push(

                `Door ${wrongDoor + 1} is NOT the correct door.`

            );

        }

    }


    /*
    LEVEL 3-5
    Symbol clues
    */

    else if (room <= 5) {

        const answerName =
            names[answer];


        statements.push(

            `The ${answerName} door is the correct door.`

        );


        for (let i = 0; i < 4; i++) {

            if (i !== answer) {

                statements.push(

                    `The ${names[i]} door is not correct.`

                );

            }

        }

    }


    /*
    LEVEL 6+
    More interesting clues
    */

    else {

        const next =
            (answer + 1) % 4;

        const previous =
            (answer + 3) % 4;


        statements.push(

            `The correct door is not Door ${previous + 1}.`

        );


        statements.push(

            `The correct door is after Door ${previous + 1}.`

        );


        statements.push(

            `Door ${next + 1} is not correct.`

        );


        statements.push(

            `Door ${answer + 1} is the answer.`

        );

    }


    currentPuzzle = {

        answer: answer,

        statements: statements

    };


    updatePuzzleDisplay();

}



/* =====================================================
   PUZZLE DISPLAY
===================================================== */

function updatePuzzleDisplay() {

    if (!currentPuzzle) {

        puzzleText.textContent =
            "No puzzle.";

        return;

    }


    let text =
        "Find the correct door.\n\n";


    currentPuzzle.statements.forEach(
        (statement, index) => {

            text +=
                "• " +
                statement +
                "\n";

        }
    );


    text +=
        "\nSymbols:\n" +
        "△ Triangle\n" +
        "○ Circle\n" +
        "□ Square\n" +
        "☆ Star";


    puzzleText.textContent =
        text;

}



/* =====================================================
   RESIZE
===================================================== */

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();



/* =====================================================
   START
===================================================== */

startButton.addEventListener(
    "click",
    () => {

        startScreen.style.display =
            "none";

        gameRunning = true;

        message.textContent =
            "Solve the clues and choose a door.";

        createDoors();

        generatePuzzle();

        updateHUD();

    }
);



/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            key === "arrowup"
        ) {

            keys.up = true;

        }


        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            keys.down = true;

        }


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            keys.left = true;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            keys.right = true;

        }


        if (
            key === "e" ||
            key === " "
        ) {

            interact();

        }

    }
);



document.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            key === "arrowup"
        ) {

            keys.up = false;

        }


        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            keys.down = false;

        }


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            keys.left = false;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            keys.right = false;

        }

    }
);



/* =====================================================
   MOBILE JOYSTICK
===================================================== */

let joystickActive = false;

let joystickX = 0;

let joystickY = 0;



if (joystick) {

    joystick.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            joystickActive = true;

        },
        { passive: false }
    );


    joystick.addEventListener(
        "touchmove",
        event => {

            event.preventDefault();

            if (!joystickActive)
                return;


            const touch =
                event.touches[0];


            const rect =
                joystick.getBoundingClientRect();


            let x =
                touch.clientX -
                (
                    rect.left +
                    rect.width / 2
                );


            let y =
                touch.clientY -
                (
                    rect.top +
                    rect.height / 2
                );


            const max =
                rect.width / 2;


            const distance =
                Math.sqrt(
                    x * x +
                    y * y
                );


            if (distance > max) {

                x =
                    x / distance *
                    max;

                y =
                    y / distance *
                    max;

            }


            joystickX =
                x / max;

            joystickY =
                y / max;


            joystickStick.style.transform =
                `translate(${x}px, ${y}px)`;

        },
        { passive: false }
    );


    joystick.addEventListener(
        "touchend",
        event => {

            event.preventDefault();

            joystickActive = false;

            joystickX = 0;

            joystickY = 0;

            joystickStick.style.transform =
                "translate(0, 0)";

        },
        { passive: false }
    );

}



/* =====================================================
   MOBILE INTERACTION
===================================================== */

interactButton.addEventListener(
    "click",
    () => {

        interact();

    }
);



/* =====================================================
   MOVEMENT
===================================================== */

function updatePlayer(delta) {

    if (!gameRunning)
        return;


    let x = 0;

    let y = 0;


    /*
    Keyboard
    */

    if (keys.left)
        x -= 1;

    if (keys.right)
        x += 1;

    if (keys.up)
        y -= 1;

    if (keys.down)
        y += 1;


    /*
    Mobile
    */

    if (
        Math.abs(joystickX) > 0.1 ||
        Math.abs(joystickY) > 0.1
    ) {

        x = joystickX;

        y = joystickY;

    }


    /*
    Normalize diagonal movement
    */

    const length =
        Math.sqrt(
            x * x +
            y * y
        );


    if (length > 1) {

        x /= length;

        y /= length;

    }


    player.x +=
        x *
        PLAYER_SPEED *
        delta;


    player.y +=
        y *
        PLAYER_SPEED *
        delta;


    /*
    Room boundaries
    */

    player.x =
        Math.max(
            WALL_SIZE + player.radius,
            Math.min(
                ROOM_WIDTH -
                WALL_SIZE -
                player.radius,
                player.x
            )
        );


    player.y =
        Math.max(
            WALL_SIZE + player.radius,
            Math.min(
                ROOM_HEIGHT -
                WALL_SIZE -
                player.radius,
                player.y
            )
        );



    /*
    Don't let the player walk
    through closed doors.
    */

    for (const door of doors) {

        if (
            player.x >
                door.x -
                player.radius &&

            player.x <
                door.x +
                door.width +
                player.radius &&

            player.y <
                door.y +
                door.height +
                player.radius
        ) {

            /*
            Push player back down.
            */

            player.y =
                door.y +
                door.height +
                player.radius;

        }

    }

}



/* =====================================================
   FIND NEARBY DOOR
===================================================== */

function findNearbyDoor() {

    let closest = null;

    let closestDistance =
        Infinity;


    for (const door of doors) {

        const centerX =
            door.x +
            door.width / 2;


        const centerY =
            door.y +
            door.height / 2;


        const distance =
            Math.hypot(
                player.x - centerX,
                player.y - centerY
            );


        if (
            distance < 180 &&
            distance < closestDistance
        ) {

            closest =
                door;

            closestDistance =
                distance;

        }

    }


    return closest;

}



/* =====================================================
   INTERACTION
===================================================== */

function interact() {

    if (!gameRunning)
        return;


    const door =
        findNearbyDoor();


    if (!door) {

        message.textContent =
            "Move closer to a door.";

        return;

    }


    const index =
        doors.indexOf(door);


    /*
    Correct door
    */

    if (
        index ===
        currentPuzzle.answer
    ) {

        door.opened = true;

        message.textContent =
            "✓ Correct! The door opens...";


        setTimeout(
            nextRoom,
            1000
        );

    }

    /*
    Wrong door
    */

    else {

        lives--;

        updateHUD();


        message.textContent =
            "✕ Wrong door! You lost a heart.";


        /*
        Push player away
        */

        player.y =
            ROOM_HEIGHT - 130;


        if (lives <= 0) {

            endGame();

        }

    }

}



/* =====================================================
   NEXT ROOM
===================================================== */

function nextRoom() {

    if (!gameRunning)
        return;


    room++;


    player.x =
        ROOM_WIDTH / 2;


    player.y =
        ROOM_HEIGHT - 130;


    createDoors();

    generatePuzzle();

    updateHUD();


    message.textContent =
        "Room " +
        room +
        ". Solve the new puzzle.";

}



/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    roomNumber.textContent =
        room;

    livesText.textContent =
        lives;

}



/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    gameRunning = false;

    gameOver = true;


    message.textContent =
        "Game Over";


    setTimeout(
        () => {

            startScreen.style.display =
                "flex";


            startScreen.querySelector(
                "h1"
            ).textContent =
                "GAME OVER";


            startScreen.querySelector(
                "p"
            ).innerHTML =
                "You reached Room " +
                room +
                ".";


            startButton.textContent =
                "PLAY AGAIN";


        },
        1000
    );

}



/* =====================================================
   DRAW ROOM
===================================================== */

function drawRoom() {

    /*
    Background
    */

    ctx.fillStyle =
        "#11151d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
    Camera
    */

    camera.x =
        player.x -
        canvas.width / 2;


    camera.y =
        player.y -
        canvas.height / 2;


    /*
    Keep camera in room
    */

    camera.x =
        Math.max(
            0,
            Math.min(
                ROOM_WIDTH -
                canvas.width,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                ROOM_HEIGHT -
                canvas.height,
                camera.y
            )
        );



    /*
    Floor
    */

    ctx.fillStyle =
        "#202631";


    ctx.fillRect(

        -camera.x,

        -camera.y,

        ROOM_WIDTH,

        ROOM_HEIGHT

    );



    /*
    Floor tiles
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";


    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < ROOM_WIDTH;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x - camera.x,
            -camera.y
        );

        ctx.lineTo(
            x - camera.x,
            ROOM_HEIGHT - camera.y
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y < ROOM_HEIGHT;
        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            -camera.x,
            y - camera.y
        );

        ctx.lineTo(
            ROOM_WIDTH - camera.x,
            y - camera.y
        );

        ctx.stroke();

    }



    /*
    Walls
    */

    ctx.fillStyle =
        "#0d1016";


    ctx.fillRect(
        -camera.x,
        -camera.y,
        ROOM_WIDTH,
        WALL_SIZE
    );


    ctx.fillRect(
        -camera.x,
        ROOM_HEIGHT -
        WALL_SIZE -
        camera.y,
        ROOM_WIDTH,
        WALL_SIZE
    );


    ctx.fillRect(
        -camera.x,
        -camera.y,
        WALL_SIZE,
        ROOM_HEIGHT
    );


    ctx.fillRect(
        ROOM_WIDTH -
        WALL_SIZE -
        camera.x,
        -camera.y,
        WALL_SIZE,
        ROOM_HEIGHT
    );



    /*
    Draw clue board
    */

    drawClueBoard();



    /*
    Draw doors
    */

    for (const door of doors) {

        drawDoor(door);

    }



    /*
    Draw player
    */

    drawPlayer();

}



/* =====================================================
   CLUE BOARD
===================================================== */

function drawClueBoard() {

    const width = 310;

    const height = 115;

    const x =
        ROOM_WIDTH / 2 -
        width / 2;

    const y = 205;


    ctx.fillStyle =
        "#151922";


    ctx.fillRect(
        x - camera.x,
        y - camera.y,
        width,
        height
    );


    ctx.strokeStyle =
        "#555d6e";


    ctx.lineWidth = 3;


    ctx.strokeRect(
        x - camera.x,
        y - camera.y,
        width,
        height
    );


    ctx.fillStyle =
        "#e7e9ee";


    ctx.font =
        "bold 18px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "CLUES",
        x +
        width / 2 -
        camera.x,
        y +
        28 -
        camera.y
    );


    ctx.font =
        "13px Arial";


    ctx.fillStyle =
        "#b8bdc8";


    ctx.fillText(
        "Solve the puzzle before choosing.",
        x +
        width / 2 -
        camera.x,
        y +
        55 -
        camera.y
    );


    ctx.fillText(
        "There is only one correct door.",
        x +
        width / 2 -
        camera.x,
        y +
        78 -
        camera.y
    );


    ctx.textAlign =
        "left";

}



/* =====================================================
   DRAW DOOR
===================================================== */

function drawDoor(door) {

    const x =
        door.x -
        camera.x;


    const y =
        door.y -
        camera.y;


    /*
    Door shadow
    */

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";


    ctx.fillRect(
        x + 6,
        y + 8,
        door.width,
        door.height
    );


    /*
    Door
    */

    ctx.fillStyle =
        door.opened
            ? "#27313a"
            : "#6b3f25";


    ctx.fillRect(
        x,
        y,
        door.width,
        door.height
    );


    /*
    Door frame
    */

    ctx.strokeStyle =
        "#a77955";


    ctx.lineWidth = 5;


    ctx.strokeRect(
        x,
        y,
        door.width,
        door.height
    );


    /*
    Number
    */

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 18px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        door.number,
        x +
        door.width / 2,
        y + 27
    );


    /*
    Symbol
    */

    ctx.font =
        "42px Arial";


    ctx.fillText(
        door.symbol,
        x +
        door.width / 2,
        y +
        92
    );


    /*
    Highlight nearby door
    */

    if (
        nearbyDoor === door
    ) {

        ctx.strokeStyle =
            "#ffffff";


        ctx.lineWidth = 4;


        ctx.strokeRect(
            x - 4,
            y - 4,
            door.width + 8,
            door.height + 8
        );

    }


    ctx.textAlign =
        "left";

}



/* =====================================================
   DRAW PLAYER
===================================================== */

function drawPlayer() {

    const x =
        player.x -
        camera.x;


    const y =
        player.y -
        camera.y;


    /*
    Shadow
    */

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";


    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 10,
        17,
        9,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();



    /*
    Body
    */

    ctx.fillStyle =
        "#e7e9ee";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();



    /*
    Direction marker
    */

    ctx.fillStyle =
        "#333";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 5,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();

}



/* =====================================================
   UPDATE INTERACTION UI
===================================================== */

function updateInteraction() {

    nearbyDoor =
        findNearbyDoor();


    if (nearbyDoor) {

        interactButton.classList.add(
            "show"
        );


        if (
            !("ontouchstart" in window)
        ) {

            message.textContent =
                "Door " +
                nearbyDoor.number +
                " is nearby. Press E or click OPEN.";

        }

    }

    else {

        interactButton.classList.remove(
            "show"
        );

    }

}



/* =====================================================
   CLICK DOORS
===================================================== */

canvas.addEventListener(
    "click",
    event => {

        if (!gameRunning)
            return;


        const rect =
            canvas.getBoundingClientRect();


        const mouseX =
            event.clientX -
            rect.left;


        const mouseY =
            event.clientY -
            rect.top;


        const worldX =
            mouseX +
            camera.x;


        const worldY =
            mouseY +
            camera.y;


        for (
            const door of doors
        ) {

            if (

                worldX >= door.x &&

                worldX <=
                    door.x +
                    door.width &&

                worldY >= door.y &&

                worldY <=
                    door.y +
                    door.height

            ) {

                const distance =
                    Math.hypot(
                        player.x -
                            (
                                door.x +
                                door.width / 2
                            ),

                        player.y -
                            (
                                door.y +
                                door.height / 2
                            )
                    );


                if (distance < 210) {

                    openSpecificDoor(
                        door
                    );

                }

                else {

                    message.textContent =
                        "Walk closer to the door first.";

                }


                break;

            }

        }

    }
);



/* =====================================================
   OPEN SPECIFIC DOOR
===================================================== */

function openSpecificDoor(door) {

    const index =
        doors.indexOf(door);


    if (
        index ===
        currentPuzzle.answer
    ) {

        door.opened = true;

        message.textContent =
            "✓ Correct!";


        setTimeout(
            nextRoom,
            900
        );

    }

    else {

        lives--;

        updateHUD();


        message.textContent =
            "✕ Wrong door! You lost a heart.";


        player.x =
            ROOM_WIDTH / 2;

        player.y =
            ROOM_HEIGHT - 130;


        if (lives <= 0) {

            endGame();

        }

    }

}



/* =====================================================
   MAIN LOOP
===================================================== */

let lastTime =
    performance.now();


function gameLoop(time) {

    const delta =
        Math.min(
            (time - lastTime) / 1000,
            0.05
        );


    lastTime =
        time;


    updatePlayer(delta);

    updateInteraction();

    drawRoom();


    requestAnimationFrame(
        gameLoop
    );

}



/* =====================================================
   INITIALIZE
===================================================== */

createDoors();

generatePuzzle();

updateHUD();

requestAnimationFrame(
    gameLoop
);