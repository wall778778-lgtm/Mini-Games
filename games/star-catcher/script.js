const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const healthText = document.getElementById("health");
const restartBtn = document.getElementById("restart");


let ship;
let objects;
let score;
let health;
let keys;
let gameOver;


function startGame(){

    ship = {
        x: 185,
        y: 540,
        width: 40,
        height: 40,
        speed: 7
    };


    objects = [];

    score = 0;
    health = 3;
    gameOver = false;

    keys = {};

    updateUI();

    requestAnimationFrame(gameLoop);
}



function createObject(){

    let isBlackHole = Math.random() < 0.2;


    objects.push({

        x: Math.random() * 370,
        y: -30,

        size: 25,

        speed: 2 + Math.random() * 3,

        type: isBlackHole ? "hole" : "star"

    });

}



function drawShip(){

    ctx.fillStyle = "#22d3ee";

    ctx.beginPath();

    ctx.moveTo(ship.x + 20, ship.y);
    ctx.lineTo(ship.x, ship.y + 40);
    ctx.lineTo(ship.x + 40, ship.y + 40);

    ctx.closePath();

    ctx.fill();

}



function drawObjects(){

    objects.forEach(obj => {

        ctx.font = "28px Arial";

        if(obj.type === "star"){
            ctx.fillText("⭐", obj.x, obj.y);
        }
        else{
            ctx.fillText("🕳️", obj.x, obj.y);
        }

    });

}



function update(){

    if(gameOver) return;


    if(keys["ArrowLeft"]){
        ship.x -= ship.speed;
    }


    if(keys["ArrowRight"]){
        ship.x += ship.speed;
    }


    if(ship.x < 0)
        ship.x = 0;


    if(ship.x > canvas.width - ship.width)
        ship.x = canvas.width - ship.width;



    if(Math.random() < 0.03){
        createObject();
    }



    objects.forEach(obj => {

        obj.y += obj.speed;


        let hit =
        obj.x < ship.x + ship.width &&
        obj.x + obj.size > ship.x &&
        obj.y < ship.y + ship.height &&
        obj.y + obj.size > ship.y;



        if(hit){

            if(obj.type === "star"){
                score++;
            }
            else{
                health--;
            }


            obj.y = 700;

            updateUI();


            if(health <= 0){
                endGame();
            }

        }

    });


    objects = objects.filter(
        obj => obj.y < canvas.height + 50
    );

}



function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawShip();
    drawObjects();

}



function gameLoop(){

    update();
    draw();


    if(!gameOver){
        requestAnimationFrame(gameLoop);
    }

}



function updateUI(){

    scoreText.textContent = score;

    healthText.textContent =
    "❤️".repeat(health);

}



function endGame(){

    gameOver = true;

    setTimeout(()=>{

        alert(
            "Game Over! Score: " + score
        );

    },100);

}



document.addEventListener(
"keydown",
e => keys[e.key] = true
);


document.addEventListener(
"keyup",
e => keys[e.key] = false
);



canvas.addEventListener(
"touchmove",
e => {

    let rect = canvas.getBoundingClientRect();

    let touch = e.touches[0];

    ship.x =
    touch.clientX - rect.left - 20;

});



restartBtn.onclick = startGame;


startGame();