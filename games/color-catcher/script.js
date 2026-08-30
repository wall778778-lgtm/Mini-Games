const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");


const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");


const restartButton =
document.getElementById("restartButton");



const colors = [

    {
        name:"red",
        color:"#ef4444",
        points:3
    },

    {
        name:"blue",
        color:"#3b82f6",
        points:1
    },

    {
        name:"green",
        color:"#22c55e",
        points:1
    },

    {
        name:"yellow",
        color:"#facc15",
        points:2
    }

];



let balls = [];

let score = 0;

let lives = 3;

let running = false;


let spawnTimer = 0;

let gameSpeed = 3;



function startGame(){


    balls = [];

    score = 0;

    lives = 3;

    spawnTimer = 0;

    gameSpeed = 3;


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



    balls.push({

        x:
        zone * 150 + 75,


        y:-20,


        radius:18,


        color:
        colors[colorIndex],


        zone:zone


    });


}




function update(){


    if(!running)
        return;



    // Spawn new balls

    spawnTimer++;


    if(spawnTimer >= 45){

        createBall();

        spawnTimer = 0;

    }




    // Move balls

    balls.forEach(ball=>{


        ball.y += gameSpeed;


    });




    // Check missed balls

    balls =
    balls.filter(ball=>{


        if(ball.y > 620){


            // only lose if it was correct zone

            if(
                ball.color.name ===
                colors[ball.zone].name
            ){

                loseLife();

            }


            return false;

        }


        return true;


    });



    // Difficulty increase

    gameSpeed =
    3 + score * 0.02;



}




function clickZone(zone){


    for(
        let i = balls.length - 1;
        i >= 0;
        i--
    ){


        let ball = balls[i];



        if(
            ball.zone === zone &&
            ball.y > 480
        ){



            if(
                ball.color.name ===
                colors[zone].name
            ){


                score +=
                ball.color.points;


            }


            else{


                loseLife();


            }



            balls.splice(i,1);



            return;


        }


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


        ctx.globalAlpha = 0.35;


        ctx.fillRect(

            i*150,

            520,

            150,

            80

        );


        ctx.globalAlpha = 1;



        ctx.fillStyle="white";

        ctx.font="18px Arial";


        ctx.fillText(

            colors[i].name,

            i*150+45,

            570

        );


    }





    // Draw balls

    balls.forEach(ball=>{


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


    });


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


    running = false;



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
    Math.floor(x / 150);



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
    Math.floor(x / 150);



    clickZone(zone);


});





restartButton.onclick =
startGame;



startGame();
