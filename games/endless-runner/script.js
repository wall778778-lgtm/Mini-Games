const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const restart = document.getElementById("restart");
const message = document.getElementById("message");


let player;
let obstacle;

let score = 0;

let gameLoop;

let running = false;



function startGame(){

    player = {

        x:80,
        y:180,
        width:30,
        height:30,
        velocity:0,
        jumping:false

    };


    obstacle = {

        x:500,
        y:190,
        width:30,
        height:40

    };


    score = 0;

    scoreText.textContent = score;

    message.textContent = "";

    running = true;


    clearInterval(gameLoop);

    gameLoop = setInterval(update,16);

}



function jump(){

    if(player.jumping === false){

        player.velocity = -11;

        player.jumping = true;

    }

}



function update(){

    if(!running)
        return;



    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // gravity

    player.velocity += 0.5;

    player.y += player.velocity;



    if(player.y >= 180){

        player.y = 180;

        player.velocity = 0;

        player.jumping = false;

    }



    // obstacle movement

    obstacle.x -= 6;



    if(obstacle.x < -40){

        obstacle.x = canvas.width + 50;

        score++;

        scoreText.textContent = score;

    }



    // collision

    if(

        player.x < obstacle.x + obstacle.width &&

        player.x + player.width > obstacle.x &&

        player.y < obstacle.y + obstacle.height &&

        player.y + player.height > obstacle.y

    ){

        gameOver();

    }



    draw();

}





function draw(){


    // player

    ctx.fillStyle = "#00ff99";

    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );



    // obstacle

    ctx.fillStyle = "#ff3366";

    ctx.fillRect(

        obstacle.x,

        obstacle.y,

        obstacle.width,

        obstacle.height

    );



    // ground

    ctx.fillStyle = "#00eaff";

    ctx.fillRect(

        0,

        220,

        canvas.width,

        3

    );


}




function gameOver(){

    running = false;

    clearInterval(gameLoop);

    message.textContent = "Game Over";

}





// PC controls

document.addEventListener(
"keydown",
event=>{

    if(event.code === "Space"){

        jump();

    }

});




// Phone controls

canvas.addEventListener(
"touchstart",
()=>{

    jump();

});




// Restart

restart.onclick = startGame;



startGame();
