const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreText = document.getElementById("score");
const energyText = document.getElementById("energy");


const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");


const restartButton =
document.getElementById("restartButton");



let player;
let objects;

let score;
let energy;

let magnet;
let speed;

let gameRunning;



function startGame(){


    player = {

        x:80,
        y:300,
        size:25

    };


    objects=[];


    score=0;

    energy=3;

    magnet=false;

    speed=3;


    gameRunning=true;


    resultCard.classList.add("hidden");


    updateUI();


    requestAnimationFrame(gameLoop);

}



function createObject(){


    let type =
    Math.random()<0.25
    ? "rock"
    : "coin";


    objects.push({

        x:420,

        y:Math.random()*550+25,

        size:20,

        type:type

    });


}



function drawPlayer(){

    ctx.font="35px Arial";

    ctx.fillText(
        "🤖",
        player.x,
        player.y
    );

}



function drawObjects(){


    objects.forEach(obj=>{


        ctx.font="30px Arial";


        ctx.fillText(

            obj.type==="coin"
            ?"🟡"
            :"🪨",

            obj.x,

            obj.y

        );


    });


}



function update(){


    if(!gameRunning)
        return;



    if(Math.random()<0.03){

        createObject();

    }



    objects.forEach(obj=>{


        obj.x -= speed;



        if(magnet && obj.type==="coin"){

            if(obj.x < 250){

                obj.x -= 6;

            }

        }



        let hit =

        Math.hypot(

            obj.x-player.x,

            obj.y-player.y

        ) < 35;



        if(hit){


            if(obj.type==="coin"){

                score+=10;

            }

            else{

                endGame();

            }


            obj.x=-100;


        }



    });



    objects =
    objects.filter(
        obj=>obj.x>-50
    );



    score++;


    if(score%300===0){

        speed+=0.5;

    }



    if(magnet){

        energy-=0.02;


        if(energy<=0){

            energy=0;

            magnet=false;

        }

    }



    updateUI();

}



function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawPlayer();

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


    if(energy>0){

        magnet=true;

    }


}



function updateUI(){


    scoreText.textContent =
    score;


    energyText.textContent =
    "🧲".repeat(
        Math.ceil(energy)
    );


}



function endGame(){


    gameRunning=false;


    resultTitle.textContent =
    "💥 Robot Crashed";


    resultScore.textContent =
    "Score: "+score;


    resultCard.classList.remove("hidden");


}



document.addEventListener(
"keydown",
e=>{

    if(e.code==="Space"){

        activateMagnet();

    }

});



canvas.addEventListener(
"click",
activateMagnet
);


canvas.addEventListener(
"touchstart",
activateMagnet
);



restartButton.onclick =
startGame;



startGame();