const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreText =
document.getElementById("score");

const healthText =
document.getElementById("health");


const resultCard =
document.getElementById("result-card");

const resultTitle =
document.getElementById("result-title");

const resultScore =
document.getElementById("result-score");


const restartButton =
document.getElementById("restartButton");



let planet;
let meteors;

let score;
let health;

let gameRunning;



function startGame(){


    planet = {

        x:200,
        y:300,
        radius:45

    };


    meteors=[];


    score=0;

    health=3;

    gameRunning=true;


    updateUI();


    resultCard.classList.add("hidden");


    requestAnimationFrame(gameLoop);

}



function createMeteor(){


    meteors.push({

        x:Math.random()*400,

        y:-30,

        size:20,

        speed:2+Math.random()*3

    });


}



function drawPlanet(){


    ctx.fillStyle="#22d3ee";


    ctx.beginPath();


    ctx.arc(

        planet.x,

        planet.y,

        planet.radius,

        0,

        Math.PI*2

    );


    ctx.fill();


}



function drawMeteors(){


    ctx.font="30px Arial";


    meteors.forEach(m=>{

        ctx.fillText(

            "☄️",

            m.x,

            m.y

        );

    });


}



function update(){


    if(!gameRunning)
        return;



    if(Math.random()<0.025){

        createMeteor();

    }



    meteors.forEach(m=>{


        m.y += m.speed;



        let distance = Math.hypot(

            m.x-planet.x,

            m.y-planet.y

        );



        if(distance < planet.radius){


            health--;


            m.y=700;


            updateUI();



            if(health<=0){

                endGame();

            }


        }


    });



    meteors =
    meteors.filter(
        m=>m.y<650
    );



    score++;


    scoreText.textContent =
    Math.floor(score/10);



}



function draw(){


    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    drawPlanet();

    drawMeteors();


}



function gameLoop(){


    update();

    draw();


    if(gameRunning){

        requestAnimationFrame(gameLoop);

    }


}



canvas.addEventListener(
"click",
function(event){


    let rect =
    canvas.getBoundingClientRect();


    let x =
    event.clientX - rect.left;


    let y =
    event.clientY - rect.top;



    meteors.forEach(m=>{


        let hit =
        Math.hypot(

            x-m.x,

            y-m.y

        ) < 35;



        if(hit){


            score+=10;


            m.y=700;


        }


    });


});



function updateUI(){


    scoreText.textContent =
    Math.floor(score/10);


    healthText.textContent =
    "❤️".repeat(health);


}



function endGame(){


    gameRunning=false;


    resultTitle.textContent =
    "💥 Planet Destroyed";


    resultScore.textContent =
    "Score: " + Math.floor(score/10);



    resultCard.classList.remove("hidden");


}



restartButton.onclick =
startGame;



startGame();