const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreText = document.getElementById("score");
const energyText = document.getElementById("energy");

const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");

const restartButton = document.getElementById("restartButton");


let robot;
let obstacles;
let coins;

let score;
let energy;

let magnet;
let gameRunning;



function startGame(){

    robot = {
        x: 80,
        y: 300,
        size: 25,
        velocity: 0
    };


    obstacles = [];
    coins = [];

    score = 0;
    energy = 100;

    magnet = false;

    gameRunning = true;


    resultCard.classList.add("hidden");


    requestAnimationFrame(gameLoop);

}



function createObjects(){

    if(Math.random() < 0.03){

        obstacles.push({

            x: 430,
            y: Math.random() * 520 + 40,
            size: 25

        });

    }


    if(Math.random() < 0.02){

        coins.push({

            x: 430,
            y: Math.random() * 520 + 40,
            size: 15

        });

    }

}



function drawRobot(){

    ctx.font = "35px Arial";

    ctx.fillText(
        "🤖",
        robot.x,
        robot.y
    );

}



function drawObjects(){

    obstacles.forEach(ob => {

        ctx.font = "35px Arial";

        ctx.fillText(
            "🔴",
            ob.x,
            ob.y
        );

    });



    coins.forEach(c => {

        ctx.font = "30px Arial";

        ctx.fillText(
            "🟡",
            c.x,
            c.y
        );

    });

}



function update(){


    if(!gameRunning)
        return;



    createObjects();



    // Gravity

    robot.velocity += 0.25;



    // Magnet pulls upward

    if(magnet && energy > 0){

        robot.velocity -= 0.45;

        energy -= 0.5;

    }



    robot.y += robot.velocity;



    // Keep robot inside screen

    if(robot.y < 40){

        robot.y = 40;

        robot.velocity = 0;

    }


    if(robot.y > 560){

        robot.y = 560;

        robot.velocity = 0;

    }



    // Move obstacles

    obstacles.forEach(ob => {

        ob.x -= 5;


        if(distance(robot, ob) < 40){

            endGame();

        }

    });



    // Move coins

    coins.forEach(c => {

        c.x -= 5;


        if(distance(robot, c) < 40){

            score += 10;

            c.x = -100;

        }

    });



    obstacles =
    obstacles.filter(
        ob => ob.x > -50
    );


    coins =
    coins.filter(
        c => c.x > -50
    );



    score++;


    scoreText.textContent = score;

    energyText.textContent =
        Math.floor(energy);



}



function distance(a,b){

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}



function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawRobot();

    drawObjects();

}



function gameLoop(){

    update();

    draw();


    if(gameRunning){

        requestAnimationFrame(gameLoop);

    }

}



function activateMagnet(){

    if(energy > 0){

        magnet = true;

    }

}



function deactivateMagnet(){

    magnet = false;

}



function endGame(){

    gameRunning = false;


    resultTitle.textContent =
    "💥 Robot Destroyed";


    resultScore.textContent =
    "Score: " + score;


    resultCard.classList.remove("hidden");

}



document.addEventListener(
"keydown",
e => {

    if(e.code === "Space"){

        activateMagnet();

    }

});


document.addEventListener(
"keyup",
e => {

    if(e.code === "Space"){

        deactivateMagnet();

    }

});



canvas.addEventListener(
"mousedown",
activateMagnet
);


canvas.addEventListener(
"mouseup",
deactivateMagnet
);


canvas.addEventListener(
"touchstart",
activateMagnet
);


canvas.addEventListener(
"touchend",
deactivateMagnet
);



restartButton.onclick = startGame;



startGame();
