const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");

const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");


const box = 20;

let snake;
let food;
let direction;
let score;
let gameLoop;
let running = false;



function startGame(){

    snake = [
        {
            x: 200,
            y: 200
        }
    ];


    food = createFood();


    direction = "RIGHT";

    score = 0;

    scoreText.textContent = score;

    message.textContent = "";

    running = true;


    clearInterval(gameLoop);

    gameLoop = setInterval(draw, 120);

}



function createFood(){

    return {

        x: Math.floor(Math.random() * 20) * box,

        y: Math.floor(Math.random() * 20) * box

    };

}



function draw(){

    if(!running)
        return;



    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // draw snake

   snake.forEach((part,index)=>{

    if(index===0){

        ctx.fillStyle="#00ff99";

    }
    else{

        ctx.fillStyle="#00eaff";

    }


    ctx.fillRect(
        part.x,
        part.y,
        box,
        box
    );

});


    // draw food

    ctx.fillStyle = "#ff3366";


    ctx.fillRect(
        food.x,
        food.y,
        box,
        box
    );



    let head = {

        x: snake[0].x,

        y: snake[0].y

    };



    if(direction === "LEFT")
        head.x -= box;


    if(direction === "RIGHT")
        head.x += box;


    if(direction === "UP")
        head.y -= box;


    if(direction === "DOWN")
        head.y += box;



    // collision

   if(head.x < 0)
    head.x = canvas.width - box;


if(head.x >= canvas.width)
    head.x = 0;


if(head.y < 0)
    head.y = canvas.height - box;


if(head.y >= canvas.height)
    head.y = 0;

    ){

        endGame();

        return;

    }



    snake.unshift(head);



    // eating food

    if(

        head.x === food.x &&
        head.y === food.y

    ){

        score++;

        scoreText.textContent = score;

        food = createFood();

    }

    else{

        snake.pop();

    }


}



function endGame(){

    running = false;

    clearInterval(gameLoop);

    message.textContent =
    "Game Over! Refresh or start again.";

}




document.addEventListener(
"keydown",
event=>{


    if(event.key === "ArrowLeft" && direction !== "RIGHT")
        direction = "LEFT";


    if(event.key === "ArrowRight" && direction !== "LEFT")
        direction = "RIGHT";


    if(event.key === "ArrowUp" && direction !== "DOWN")
        direction = "UP";


    if(event.key === "ArrowDown" && direction !== "UP")
        direction = "DOWN";


});




// Mobile controls

upButton.onclick = ()=>{

    if(direction !== "DOWN")
        direction = "UP";

};


downButton.onclick = ()=>{

    if(direction !== "UP")
        direction = "DOWN";

};


leftButton.onclick = ()=>{

    if(direction !== "RIGHT")
        direction = "LEFT";

};


rightButton.onclick = ()=>{

    if(direction !== "LEFT")
        direction = "RIGHT";

};



// Start automatically

startGame();
