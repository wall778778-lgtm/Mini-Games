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
let nextDirection;

let score = 0;

let gameLoop;

let speed = 120;

let running = false;



function startGame(){


    snake = [

        {
            x:200,
            y:200
        },

        {
            x:180,
            y:200
        },

        {
            x:160,
            y:200
        }

    ];


    direction = "RIGHT";
    nextDirection = "RIGHT";


    score = 0;

    speed = 120;


    scoreText.textContent = score;

    message.textContent = "";


    food = createFood();


    running = true;


    clearInterval(gameLoop);


    gameLoop = setInterval(
        update,
        speed
    );


}



function createFood(){


    return {

        x:
        Math.floor(Math.random()*20)*box,

        y:
        Math.floor(Math.random()*20)*box

    };


}



function update(){


    if(!running)
        return;



    direction = nextDirection;



    let head = {

        x: snake[0].x,

        y: snake[0].y

    };



    if(direction==="RIGHT")
        head.x += box;


    if(direction==="LEFT")
        head.x -= box;


    if(direction==="UP")
        head.y -= box;


    if(direction==="DOWN")
        head.y += box;




    // wall teleport


    if(head.x < 0)
        head.x = canvas.width - box;


    if(head.x >= canvas.width)
        head.x = 0;


    if(head.y < 0)
        head.y = canvas.height - box;


    if(head.y >= canvas.height)
        head.y = 0;




    // hit own body


    if(
        snake.some(
            part =>
            part.x === head.x &&
            part.y === head.y
        )
    ){

        endGame();

        return;

    }



    snake.unshift(head);



    // eat food


    if(
        head.x === food.x &&
        head.y === food.y
    ){


        score++;


        scoreText.textContent = score;


        food = createFood();



        // increase speed


        if(score % 5 === 0 && speed > 50){


            speed -= 10;


            clearInterval(gameLoop);


            gameLoop = setInterval(
                update,
                speed
            );


        }


    }
    else{


        snake.pop();


    }



    draw();


}





function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // food


    ctx.fillStyle="#ff3366";


    ctx.fillRect(

        food.x,

        food.y,

        box,

        box

    );



    // snake


    snake.forEach(
        (part,index)=>{


            if(index===0){


                drawHead(part);


            }
            else{


                ctx.fillStyle="#00eaff";


                ctx.fillRect(

                    part.x,

                    part.y,

                    box,

                    box

                );


            }


        }
    );


}




function drawHead(head){


    ctx.fillStyle="#00ff99";


    ctx.fillRect(

        head.x,

        head.y,

        box,

        box

    );



    // eyes


    ctx.fillStyle="black";



    let eyeSize = 4;



    if(direction==="RIGHT"){

        ctx.fillRect(
            head.x+13,
            head.y+4,
            eyeSize,
            eyeSize
        );


        ctx.fillRect(
            head.x+13,
            head.y+12,
            eyeSize,
            eyeSize
        );

    }



    if(direction==="LEFT"){


        ctx.fillRect(
            head.x+3,
            head.y+4,
            eyeSize,
            eyeSize
        );


        ctx.fillRect(
            head.x+3,
            head.y+12,
            eyeSize,
            eyeSize
        );


    }



    if(direction==="UP"){


        ctx.fillRect(
            head.x+4,
            head.y+3,
            eyeSize,
            eyeSize
        );


        ctx.fillRect(
            head.x+12,
            head.y+3,
            eyeSize,
            eyeSize
        );


    }



    if(direction==="DOWN"){


        ctx.fillRect(
            head.x+4,
            head.y+13,
            eyeSize,
            eyeSize
        );


        ctx.fillRect(
            head.x+12,
            head.y+13,
            eyeSize,
            eyeSize
        );


    }


}




function endGame(){


    running=false;


    clearInterval(gameLoop);


    message.textContent =
    "Game Over!";


}





document.addEventListener(
"keydown",
e=>{


    if(
        e.key==="ArrowRight" &&
        direction!=="LEFT"
    )
        nextDirection="RIGHT";



    if(
        e.key==="ArrowLeft" &&
        direction!=="RIGHT"
    )
        nextDirection="LEFT";



    if(
        e.key==="ArrowUp" &&
        direction!=="DOWN"
    )
        nextDirection="UP";



    if(
        e.key==="ArrowDown" &&
        direction!=="UP"
    )
        nextDirection="DOWN";


});





upButton.onclick=()=>{

    if(direction!=="DOWN")
        nextDirection="UP";

};



downButton.onclick=()=>{

    if(direction!=="UP")
        nextDirection="DOWN";

};



leftButton.onclick=()=>{

    if(direction!=="RIGHT")
        nextDirection="LEFT";

};



rightButton.onclick=()=>{

    if(direction!=="LEFT")
        nextDirection="RIGHT";

};



startGame();
