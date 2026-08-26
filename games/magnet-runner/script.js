const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreText = document.getElementById("score");
const energyText = document.getElementById("energy");


const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");


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


    obstacles=[];
    coins=[];


    score=0;
    energy=100;


    magnet=false;

    gameRunning=true;


    resultCard.classList.add("hidden");


    requestAnimationFrame(gameLoop);

}



function createObjects(){


    if(Math.random()<0.03){

        obstacles.push({

            x:420,

            y:Math.random()*500+50,

            size:25

        });

    }



    if(Math.random()<0.02){

        coins.push({

            x:420,

            y:Math.random()*500+50,

            size:15

        });

    }


}



function drawRobot(){

    ctx.font="35px Arial";

    ctx.fillText(
        "🤖",
        robot.x,
        robot.y
    );

}



function drawObjects(){


    obstacles.forEach(o=>{

        ctx.font="35px Arial";

        ctx.fillText(
            "🔴",
            o.x,
            o.y
        );

    });


    coins.forEach(c=>{

        ctx.font="30px Arial";

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



    // Robot movement

    robot.x += 2;



    // Gravity

    robot.velocity += 0.25;



    // Magnet pulls upward

    if(magnet && energy > 0){

        robot.velocity -= 0.5;

        energy -= 0.5;

    }



   



    // floor and ceiling

    if(robot.y > 560){

        robot.y=560;

        robot.velocity=0;

    }


    if(robot.y < 20){

        robot.y=20;

        robot.velocity=0;

    }



    obstacles.forEach(o=>{


        o.x-=4;


        if(distance(robot,o)<35){

            endGame();

        }


    });



    coins.forEach(c=>{


        c.x-=4;


        if(distance(robot,c)<35){

            score+=10;

            c.x=-100;

        }


    });



    obstacles =
    obstacles.filter(o=>o.x>-50);


    coins =
    coins.filter(c=>c.x>-50);



    score++;


    scoreText.textContent=score;


    energyText.textContent=
    Math.floor(energy);


}



function distance(a,b){

    return Math.hypot(

        a.x-b.x,

        a.y-b.y

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



function activate(){

    magnet=true;

}


function deactivate(){

    magnet=false;

}



function endGame(){

    gameRunning=false;


    resultTitle.textContent=
    "💥 Robot Destroyed";


    resultScore.textContent=
    "Score: "+score;


    resultCard.classList.remove("hidden");

}



document.addEventListener(
"keydown",
e=>{

    if(e.code==="Space")
        activate();

});


document.addEventListener(
"keyup",
e=>{

    if(e.code==="Space")
        deactivate();

});



canvas.addEventListener(
"touchstart",
activate
);


canvas.addEventListener(
"touchend",
deactivate
);



canvas.addEventListener(
"mousedown",
activate
);


canvas.addEventListener(
"mouseup",
deactivate
);



document.getElementById("restartButton")
.onclick=startGame;



startGame();
