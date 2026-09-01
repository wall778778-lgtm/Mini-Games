const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const roomNumber = document.getElementById("roomNumber");
const livesText = document.getElementById("lives");
const puzzleText = document.getElementById("puzzleText");
const message = document.getElementById("message");
const interactButton = document.getElementById("interactButton");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const joystick = document.getElementById("joystick");
const joystickStick = document.getElementById("joystickStick");


/* =========================================================
   SETTINGS
========================================================= */

const ROOM_WIDTH = 1000;
const ROOM_HEIGHT = 650;

const PLAYER_RADIUS = 18;
const PLAYER_SPEED = 260;

const DOOR_WIDTH = 120;
const DOOR_HEIGHT = 145;

const WALL_SIZE = 35;


/* =========================================================
   GAME STATE
========================================================= */

let gameRunning = false;
let room = 1;
let lives = 3;
let currentPuzzle = null;
let nearbyDoor = null;
let gameOver = false;


/* =========================================================
   CAMERA
========================================================= */

let camera = {
    x: 0,
    y: 0
};


/* =========================================================
   PLAYER
========================================================= */

let player = {
    x: ROOM_WIDTH / 2,
    y: ROOM_HEIGHT - 130,
    radius: PLAYER_RADIUS
};


/* =========================================================
   INPUT
========================================================= */

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};


/* =========================================================
   DOORS
========================================================= */

let doors = [];


function createDoors() {

    const gap = 25;

    const totalWidth =
        DOOR_WIDTH * 4 +
        gap * 3;

    const startX =
        (ROOM_WIDTH - totalWidth) / 2;

    const symbols = [
        "△",
        "○",
        "□",
        "☆"
    ];

    doors = [];

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


/* =========================================================
   RANDOM HELPERS
========================================================= */

function randomInt(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


function shuffle(array) {

    return [...array].sort(
        () => Math.random() - 0.5
    );

}


/* =========================================================
   PUZZLE ENGINE
========================================================= */

function generatePuzzle() {

    /*
       Different puzzle styles.

       We deliberately rotate styles
       instead of repeating the same one.
    */

    const types = [

        "sequence",

        "truth",

        "code",

        "pattern",

        "deduction",

        "word",

        "odd"

    ];


    /*
       Early rooms are easier.
       Later rooms unlock harder puzzles.
    */

    let available = [];


    if (room <= 2) {

        available = [
            "sequence",
            "pattern"
        ];

    }

    else if (room <= 4) {

        available = [
            "sequence",
            "pattern",
            "odd",
            "word"
        ];

    }

    else if (room <= 7) {

        available = [
            "truth",
            "code",
            "deduction",
            "sequence",
            "word"
        ];

    }

    else {

        available = types;

    }


    /*
       Try not to give the same
       type twice in a row.
    */

    let type =
        available[
            randomInt(
                0,
                available.length - 1
            )
        ];


    if (
        currentPuzzle &&
        available.length > 1 &&
        type === currentPuzzle.type
    ) {

        const alternatives =
            available.filter(
                t => t !== currentPuzzle.type
            );

        type =
            alternatives[
                randomInt(
                    0,
                    alternatives.length - 1
                )
            ];

    }


    switch (type) {

        case "sequence":
            createSequencePuzzle();
            break;

        case "truth":
            createTruthPuzzle();
            break;

        case "code":
            createCodePuzzle();
            break;

        case "pattern":
            createPatternPuzzle();
            break;

        case "deduction":
            createDeductionPuzzle();
            break;

        case "word":
            createWordPuzzle();
            break;

        case "odd":
            createOddPuzzle();
            break;

        default:
            createSequencePuzzle();

    }


    updatePuzzleDisplay();
}


/* =========================================================
   PUZZLE 1
   NUMBER SEQUENCE
========================================================= */

function createSequencePuzzle() {

    let start = randomInt(2, 8);

    let step = randomInt(2, 6);

    let secondStep = step;


    /*
       Harder rooms use multiplication-like
       sequences.
    */

    if (room >= 8) {

        const type =
            randomInt(1, 2);


        if (type === 1) {

            const a = randomInt(2, 5);

            const b = randomInt(2, 5);

            const c = randomInt(2, 5);

            const d = randomInt(2, 5);

            const e = randomInt(2, 5);

            const sequence = [
                a,
                a + b,
                a + b + c,
                a + b + c + d
            ];

            const answer =
                a + b + c + d + e;


            const options =
                makeNumberOptions(
                    answer
                );


            currentPuzzle = {

                type: "sequence",

                title: "NUMBER SEQUENCE",

                question:
                    `What number comes next?\n\n` +
                    `${sequence.join("  →  ")}  →  ?`,

                options: options,

                answer:
                    options.indexOf(answer)

            };

            return;

        }

    }


    const numbers = [

        start,

        start + step,

        start + step * 2,

        start + step * 3

    ];


    const answer =
        start + step * 4;


    const options =
        makeNumberOptions(answer);


    currentPuzzle = {

        type: "sequence",

        title: "NUMBER SEQUENCE",

        question:
            `What number comes next?\n\n` +
            `${numbers.join("  →  ")}  →  ?`,

        options: options,

        answer:
            options.indexOf(answer)

    };

}


/* =========================================================
   NUMBER OPTIONS
========================================================= */

function makeNumberOptions(answer) {

    let options = new Set();

    options.add(answer);


    while (options.size < 4) {

        const offset =
            randomInt(-12, 12);

        if (offset !== 0) {

            options.add(
                answer + offset
            );

        }

    }


    return shuffle(
        [...options]
    );

}


/* =========================================================
   PUZZLE 2
   TRUTH / LIE
========================================================= */

function createTruthPuzzle() {

    const answer =
        randomInt(0, 3);


    const statements = [];

    /*
       Exactly one statement is true.
       The correct door is the one
       whose statement is true.
    */

    for (let i = 0; i < 4; i++) {

        if (i === answer) {

            statements.push(
                `Door ${i + 1}: ` +
                `I am the correct door.`
            );

        }
        else {

            statements.push(
                `Door ${i + 1}: ` +
                `I am NOT the correct door.`
            );

        }

    }


    currentPuzzle = {

        type: "truth",

        title: "TRUTH & LIES",

        question:
            `Exactly ONE statement below is true.\n` +
            `Which door is it?\n\n` +
            statements.join("\n\n"),

        options: [
            "Door 1",
            "Door 2",
            "Door 3",
            "Door 4"
        ],

        answer: answer

    };

}


/* =========================================================
   PUZZLE 3
   CODE LOCK
========================================================= */

function createCodePuzzle() {

    /*
       We create a 3-digit code
       containing unique digits.
    */

    let digits = shuffle([
        1, 2, 3, 4, 5, 6, 7, 8, 9
    ]).slice(0, 3);


    const code =
        digits.join("");


    /*
       Door answers are possible
       digits for the FIRST position.
    */

    const answer =
        digits[0];


    let options = [
        answer,
        randomInt(1, 9),
        randomInt(1, 9),
        randomInt(1, 9)
    ];


    options =
        [...new Set(options)];


    while (options.length < 4) {

        const n =
            randomInt(1, 9);

        if (!options.includes(n)) {

            options.push(n);

        }

    }


    options =
        shuffle(options);


    currentPuzzle = {

        type: "code",

        title: "CODE LOCK",

        question:
            `A 3-digit code is hidden.\n\n` +

            `The first digit of the code\n` +
            `is one of the four choices.\n\n` +

            `Clue 1: The code begins with ${digits[0]}.\n` +

            `Clue 2: The second digit is ${digits[1]}.\n` +

            `Clue 3: The final digit is ${digits[2]}.\n\n` +

            `Which door represents the first digit?`,

        options: options.map(
            n => String(n)
        ),

        answer:
            options.indexOf(answer)

    };

}


/* =========================================================
   PUZZLE 4
   PATTERN
========================================================= */

function createPatternPuzzle() {

    const patterns = [

        {
            sequence:
                "▲ ● ▲ ● ▲ ?",

            answer:
                "●"

        },

        {
            sequence:
                "■ ■ ● ■ ■ ● ?",

            answer:
                "■"

        },

        {
            sequence:
                "★ ☆ ★ ☆ ★ ?",

            answer:
                "☆"

        },

        {
            sequence:
                "▲ ▲ ● ▲ ▲ ● ?",

            answer:
                "▲"

        }

    ];


    const chosen =
        patterns[
            randomInt(
                0,
                patterns.length - 1
            )
        ];


    let symbols = [
        "▲",
        "●",
        "■",
        "★"
    ];


    let options =
        shuffle(
            [
                chosen.answer,
                ...symbols.filter(
                    s =>
                        s !== chosen.answer
                ).slice(0, 3)
            ]
        );


    currentPuzzle = {

        type: "pattern",

        title: "PATTERN",

        question:
            `Which symbol completes the pattern?\n\n` +
            chosen.sequence,

        options: options,

        answer:
            options.indexOf(
                chosen.answer
            )

    };

}


/* =========================================================
   PUZZLE 5
   DEDUCTION
========================================================= */

function createDeductionPuzzle() {

    const answer =
        randomInt(1, 4);


    /*
       We generate clues that point
       toward the answer.
    */

    const previous =
        answer === 1
            ? 4
            : answer - 1;


    const opposite =
        answer === 1
            ? 4
            : answer + 2 > 4
                ? answer - 2
                : answer + 2;


    currentPuzzle = {

        type: "deduction",

        title: "DEDUCTION",

        question:
            `Four doors stand before you.\n\n` +

            `• The correct door is NOT Door ${previous}.\n` +

            `• The correct door is closer to Door ${answer} ` +
            `than to Door ${opposite}.\n\n` +

            `• The correct door has number ${answer}.\n\n` +

            `Which door should you choose?`,

        options: [
            "Door 1",
            "Door 2",
            "Door 3",
            "Door 4"
        ],

        answer:
            answer - 1

    };

}


/* =========================================================
   PUZZLE 6
   WORD RELATIONSHIP
========================================================= */

function createWordPuzzle() {

    const puzzles = [

        {
            q:
                "HAND is to GLOVE\n" +
                "as FOOT is to ?",

            options: [
                "Hat",
                "Sock",
                "Shirt",
                "Belt"
            ],

            answer: 1
        },

        {
            q:
                "BIRD is to NEST\n" +
                "as BEE is to ?",

            options: [
                "Hive",
                "Tree",
                "Cave",
                "Pond"
            ],

            answer: 0
        },

        {
            q:
                "BOOK is to READ\n" +
                "as FOOD is to ?",

            options: [
                "Drink",
                "Eat",
                "Cook",
                "Buy"
            ],

            answer: 1
        },

        {
            q:
                "DAY is to NIGHT\n" +
                "as HOT is to ?",

            options: [
                "Warm",
                "Cold",
                "Fire",
                "Sun"
            ],

            answer: 1
        }

    ];


    const chosen =
        puzzles[
            randomInt(
                0,
                puzzles.length - 1
            )
        ];


    currentPuzzle = {

        type: "word",

        title: "WORD RELATION",

        question:
            chosen.q,

        options:
            chosen.options,

        answer:
            chosen.answer

    };

}


/* =========================================================
   PUZZLE 7
   ODD ONE OUT
========================================================= */

function createOddPuzzle() {

    const puzzles = [

        {
            items: [
                "2",
                "4",
                "6",
                "9"
            ],

            reason:
                "Three are even numbers.",

            answer: 3

        },

        {
            items: [
                "3",
                "6",
                "9",
                "11"
            ],

            reason:
                "Three are multiples of 3.",

            answer: 3

        },

        {
            items: [
                "12",
                "18",
                "24",
                "25"
            ],

            reason:
                "Three are divisible by 6.",

            answer: 3

        },

        {
            items: [
                "8",
                "16",
                "24",
                "31"
            ],

            reason:
                "Three are multiples of 8.",

            answer: 3

        }

    ];


    const chosen =
        puzzles[
            randomInt(
                0,
                puzzles.length - 1
            )
        ];


    currentPuzzle = {

        type: "odd",

        title: "ODD ONE OUT",

        question:
            `Which one does NOT belong?\n\n` +

            chosen.items.join(
                "      "
            ) +

            `\n\nHint:\n` +

            chosen.reason,

        options:
            chosen.items,

        answer:
            chosen.answer

    };

}


/* =========================================================
   PUZZLE DISPLAY
========================================================= */

function updatePuzzleDisplay() {

    if (!currentPuzzle) {

        puzzleText.textContent =
            "No puzzle.";

        return;

    }


    let text =
        currentPuzzle.title +
        "\n\n";


    text +=
        currentPuzzle.question;


    text +=
        "\n\nYOUR OPTIONS:\n";


    currentPuzzle.options.forEach(
        (option, index) => {

            text +=
                `Door ${index + 1}: ${option}\n`;

        }
    );


    puzzleText.textContent =
        text;

}


/* =========================================================
   RESIZE
========================================================= */

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


/* =========================================================
   START GAME
========================================================= */

startButton.addEventListener(
    "click",
    () => {

        startScreen.style.display =
            "none";

        gameRunning = true;

        room = 1;

        lives = 3;

        player.x =
            ROOM_WIDTH / 2;

        player.y =
            ROOM_HEIGHT - 130;

        createDoors();

        generatePuzzle();

        updateHUD();

        message.textContent =
            "Study the clues and choose carefully.";

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

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


/* =========================================================
   MOBILE JOYSTICK
========================================================= */

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


/* =========================================================
   MOVEMENT
========================================================= */

function updatePlayer(delta) {

    if (!gameRunning)
        return;


    let x = 0;

    let y = 0;


    if (keys.left)
        x -= 1;

    if (keys.right)
        x += 1;

    if (keys.up)
        y -= 1;

    if (keys.down)
        y += 1;


    if (
        Math.abs(joystickX) > 0.1 ||
        Math.abs(joystickY) > 0.1
    ) {

        x = joystickX;

        y = joystickY;

    }


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


    player.x =
        Math.max(
            WALL_SIZE +
                player.radius,

            Math.min(
                ROOM_WIDTH -
                    WALL_SIZE -
                    player.radius,

                player.x
            )
        );


    player.y =
        Math.max(
            WALL_SIZE +
                player.radius,

            Math.min(
                ROOM_HEIGHT -
                    WALL_SIZE -
                    player.radius,

                player.y
            )
        );


    /*
       Stop the player walking through doors.
    */

    for (const door of doors) {

        if (door.opened)
            continue;


        const closestX =
            Math.max(
                door.x,
                Math.min(
                    player.x,
                    door.x +
                        door.width
                )
            );


        const closestY =
            Math.max(
                door.y,
                Math.min(
                    player.y,
                    door.y +
                        door.height
                )
            );


        const distance =
            Math.hypot(
                player.x -
                    closestX,

                player.y -
                    closestY
            );


        if (
            distance <
            player.radius
        ) {

            if (
                player.y <
                door.y +
                door.height
            ) {

                player.y =
                    door.y +
                    door.height +
                    player.radius;

            }

        }

    }

}


/* =========================================================
   FIND NEARBY DOOR
========================================================= */

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
                player.x -
                    centerX,

                player.y -
                    centerY
            );


        if (
            distance < 220 &&
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


/* =========================================================
   INTERACTION
========================================================= */

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


    openSpecificDoor(door);

}


/* =========================================================
   OPEN DOOR
========================================================= */

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
            800
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


/* =========================================================
   NEXT ROOM
========================================================= */

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
        `Room ${room}. A new puzzle awaits.`;

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    roomNumber.textContent =
        room;

    livesText.textContent =
        lives;

}


/* =========================================================
   GAME OVER
========================================================= */

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
                `You reached Room ${room}.`;


            startButton.textContent =
                "PLAY AGAIN";

        },
        800
    );

}


/* =========================================================
   DRAW ROOM
========================================================= */

function drawRoom() {

    ctx.fillStyle =
        "#11151d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    camera.x =
        player.x -
        canvas.width / 2;


    camera.y =
        player.y -
        canvas.height / 2;


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
       Floor grid
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
            ROOM_HEIGHT -
                camera.y
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
            ROOM_WIDTH -
                camera.x,
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


    drawClueBoard();


    for (const door of doors) {

        drawDoor(door);

    }


    drawPlayer();

}


/* =========================================================
   CLUE BOARD
========================================================= */

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
        currentPuzzle
            ? currentPuzzle.title
            : "PUZZLE",

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
        "Read the clues carefully.",

        x +
            width / 2 -
            camera.x,

        y +
            57 -
            camera.y
    );


    ctx.fillText(
        "Only one door is correct.",

        x +
            width / 2 -
            camera.x,

        y +
            80 -
            camera.y
    );


    ctx.textAlign =
        "left";

}


/* =========================================================
   DRAW DOOR
========================================================= */

function drawDoor(door) {

    const x =
        door.x -
        camera.x;


    const y =
        door.y -
        camera.y;


    ctx.fillStyle =
        "rgba(0,0,0,0.35)";


    ctx.fillRect(
        x + 6,
        y + 8,
        door.width,
        door.height
    );


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


    ctx.strokeStyle =
        "#a77955";


    ctx.lineWidth = 5;


    ctx.strokeRect(
        x,
        y,
        door.width,
        door.height
    );


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


    ctx.font =
        "42px Arial";


    ctx.fillText(
        door.symbol,
        x +
            door.width / 2,
        y + 92
    );


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


/* =========================================================
   DRAW PLAYER
========================================================= */

function drawPlayer() {

    const x =
        player.x -
        camera.x;


    const y =
        player.y -
        camera.y;


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


/* =========================================================
   INTERACTION UI
========================================================= */

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
                `Door ${nearbyDoor.number} nearby — press E.`;

        }

    }

    else {

        interactButton.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   CLICK DOOR
========================================================= */

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


        for (const door of doors) {

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


                if (
                    distance < 230
                ) {

                    openSpecificDoor(
                        door
                    );

                }

                else {

                    message.textContent =
                        "Walk closer first.";

                }


                break;

            }

        }

    }
);


/* =========================================================
   GAME LOOP
========================================================= */

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


createDoors();

generatePuzzle();

updateHUD();

requestAnimationFrame(
    gameLoop
);
