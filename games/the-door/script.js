const game = document.getElementById("game");

const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");

const message = document.getElementById("message");

const puzzlePanel =
    document.getElementById("puzzle-panel");

const puzzleRule =
    document.getElementById("puzzle-rule");

const doorsContainer =
    document.getElementById("doors");

const resultCard =
    document.getElementById("result-card");

const resultTitle =
    document.getElementById("result-title");

const resultText =
    document.getElementById("result-text");

const restartButton =
    document.getElementById("restart-button");



let level = 1;
let lives = 3;

let gameStarted = false;

let puzzleActive = false;

let keys = {};

let player = {

    x: 0,
    y: 0,

    angle: 0,

    speed: 3

};



let puzzle;



/*
    ------------------------------------------------
    PUZZLE SYSTEM
    ------------------------------------------------
*/


const symbols = [
    "△",
    "○",
    "□",
    "☆"
];



function createPuzzle() {

    /*
        Four statements.

        Exactly ONE statement is true.

        The player must determine
        which door is the correct one.
    */


    let correctDoor =
        Math.floor(Math.random() * 4);


    let statements = [];


    for (let i = 0; i < 4; i++) {

        if (i === correctDoor) {

            statements.push(
                "This door is the correct door."
            );

        } else {

            statements.push(
                "This door is NOT the correct door."
            );

        }

    }


    /*
        Make the puzzle more interesting
        by creating a truth/lie relationship.
    */


    puzzle = {

        correct: correctDoor,

        statements: statements,

        symbols: shuffle(
            [...symbols]
        )

    };

}



function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        let j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }

    return array;

}



/*
    ------------------------------------------------
    PUZZLE ROOM
    ------------------------------------------------
*/


function showPuzzle() {

    puzzleActive = true;


    createPuzzle();


    puzzleRule.innerHTML = `
        <strong>Four doors stand before you.</strong><br><br>

        Exactly <strong>ONE</strong> of the four
        statements is true.<br>

        Find the door that leads forward.
    `;


    doorsContainer.innerHTML = "";


    for (let i = 0; i < 4; i++) {

        const door =
            document.createElement("div");


        door.className =
            "door-choice";


        door.innerHTML = `

            <div class="door-number">
                DOOR ${i + 1}
            </div>

            <div class="door-symbol">
                ${puzzle.symbols[i]}
            </div>

            <div class="door-text">
                ${puzzle.statements[i]}
            </div>

        `;


        door.addEventListener(
            "click",
            () => chooseDoor(i)
        );


        doorsContainer.appendChild(door);

    }


    puzzlePanel.classList.remove("hidden");

}



function chooseDoor(number) {

    if (!puzzleActive)
        return;


    if (number === puzzle.correct) {

        puzzleActive = false;

        puzzlePanel.classList.add("hidden");

        level++;

        levelText.textContent = level;

        message.textContent =
            "Correct. The maze continues...";


        setTimeout(() => {

            message.textContent =
                "Find the next puzzle room.";

        }, 1500);


    }

    else {

        lives--;

        livesText.textContent =
            lives;


        if (lives <= 0) {

            gameOver();

            return;

        }


        puzzleActive = false;

        puzzlePanel.classList.add("hidden");


        message.textContent =
            "Wrong door. You lost a heart.";


        setTimeout(() => {

            showPuzzle();

        }, 1200);

    }

}



/*
    ------------------------------------------------
    GAME
    ------------------------------------------------
*/


function startGame() {

    level = 1;

    lives = 3;

    gameStarted = true;

    puzzleActive = false;


    levelText.textContent =
        level;

    livesText.textContent =
        lives;


    resultCard.classList.add("hidden");


    message.textContent =
        "Find the puzzle room.";


    player.x = 0;

    player.y = 0;

    player.angle = 0;


    /*
        For now the first puzzle
        appears after starting.
    */

    setTimeout(() => {

        showPuzzle();

    }, 1000);

}



function gameOver() {

    gameStarted = false;

    puzzleActive = false;


    resultTitle.textContent =
        "💀 Game Over";


    resultText.textContent =
        "You reached level " +
        level +
        ".";


    resultCard.classList.remove(
        "hidden"
    );

}



restartButton.addEventListener(
    "click",
    startGame
);



/*
    ------------------------------------------------
    KEYBOARD
    ------------------------------------------------
*/


document.addEventListener(
    "keydown",
    function(event) {

        keys[event.key.toLowerCase()] = true;

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[event.key.toLowerCase()] = false;

    }
);



/*
    ------------------------------------------------
    START
    ------------------------------------------------
*/


startGame();