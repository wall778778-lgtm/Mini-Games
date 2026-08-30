const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");


const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");


const restartButton = document.getElementById("restartButton");



const colors = [

    {
        name: "red",
        color: "#ef4444",
        points: 3
    },

    {
        name: "blue",
        color: "#3b82f6",
        points: 1
    },

    {
        name: "green",
        color: "#22c55e",
        points: 1
    },

    {
        name: "yellow",
        color: "#facc15",
        points: 2
    }

];



let ball;

let score;
let lives;

let speed;

let running;



function startGame(){

    score = 0;

    lives = 3;

    speed = 3;

    ball = null;

    running = true;


    resultCard.classList.add("hidden");


    updateUI();


    requestAnimationFrame(gameLoop);

}



function createBall(){


    let colorIndex =
    Math.floor(Math.random()*colors.length);


    let zone =
    Math.floor(Math.random()*4);



    ball = {

        x:
        zone * 150 + 75,

        y:-20,

        radius:18,

        color:
        colors[colorIndex],

        zone:zone

    };

}



function update(){


    if(!running)
        return;



    if(!ball){

        createBall();

    }



    ball.y += speed;



    // Ball passed the zones

    if(ball.y > 620){


        // If it was a matching ball and player ignored it

        if(
            ball.zone ===
            colors.indexOf(ball.color)
        ){

            loseLife();

        }


        ball=null;

    }



}



function clickZone(zone){


    if(!ball)
        return;



    // Only react when ball is inside the zones

    if(ball.y < 480)
        return;



    let correct =

    ball.zone ===
    colors.indexOf(ball.color);



    if(correct && zone === ball.zone){


        score += ball.color.points;


        ball=null;


    }


    else if(zone === ball.zone){


        // clicked a wrong color ball

        loseLife();


        ball=null;


    }



}



function loseLife(){


    lives--;


    if(lives <= 0){

        endGame();

    }


}



function updateUI(){


    scoreText.textContent =
    score;


    livesText.textContent =
    "❤️".repeat(lives);


}



function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    ctx.fillStyle="#0f172a";

    ctx.fillRect(
        0,
        0,
        600,
        600
    );



    // Draw zones

    for(let i=0;i<4;i++){


        ctx.fillStyle =
        colors[i].color;


        ctx.globalAlpha=.35;


        ctx.fillRect(

            i*150,

            520,

            150,

            80

        );


        ctx.globalAlpha=1;


        ctx.fillStyle="white";

        ctx.font="18px Arial";


        ctx.fillText(

            colors[i].name,

            i*150+45,

            570

        );


    }



    // Draw ball

    if(ball){


        ctx.beginPath();


        ctx.fillStyle =
        ball.color.color;


        ctx.arc(

            ball.x,

            ball.y,

            ball.radius,

            0,

            Math.PI*2

        );


        ctx.fill();


    }


}



function gameLoop(){


    update();

    draw();

    updateUI();



    if(running){

        requestAnimationFrame(gameLoop);

    }


}



function endGame(){


    running=false;


    resultTitle.textContent =
    "💥 Game Over";


    resultScore.textContent =
    "Score: " + score;


    resultCard.classList.remove("hidden");


}



canvas.addEventListener(
"click",
function(e){


    let rect =
    canvas.getBoundingClientRect();


    let x =
    e.clientX - rect.left;



    let zone =
    Math.floor(
        x / 150
    );


    clickZone(zone);


});



canvas.addEventListener(
"touchstart",
function(e){


    let rect =
    canvas.getBoundingClientRect();


    let x =
    e.touches[0].clientX - rect.left;



    let zone =
    Math.floor(
        x / 150
    );


    clickZone(zone);


});



restartButton.onclick =
startGame;



startGame();
