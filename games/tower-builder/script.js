const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const restart = document.getElementById("restart");


let blocks = [];
let current;

let direction = 1;
let speed = 3;

let score = 0;
let gameOver = false;

let cameraY = 0;



function start(){

    blocks = [];

    blocks.push({

        x:100,
        y:560,
        width:200,
        height:40

    });


    current = {

        x:0,
        y:520,
        width:200,
        height:40

    };


    direction = 1;

    speed = 3;

    score = 0;

    cameraY = 0;

    gameOver = false;


    scoreText.textContent = score;

    message.textContent = "";

}






function drop(){


    if(gameOver)
        return;



    let last =
    blocks[blocks.length - 1];



    let left =
    Math.max(
        current.x,
        last.x
    );



    let right =
    Math.min(
        current.x + current.width,
        last.x + last.width
    );



    let overlap =
    right - left;



    if(overlap <= 0){


        gameOver = true;


        message.textContent =
        "Tower collapsed 💥";


        return;


    }



    blocks.push({

        x:left,

        y:last.y - 40,

        width:overlap,

        height:40

    });



    score++;


    scoreText.textContent =
    score;




    // next block

    current = {

        x:0,

        y:last.y - 80,

        width:overlap,

        height:40

    };


}








function update(){


    if(gameOver)
        return;



    current.x +=
    direction * speed;



    if(
        current.x + current.width >= canvas.width ||
        current.x <= 0
    ){

        direction *= -1;

    }


}









function draw(){


    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    // camera follows tower

    if(current.y < 200){

        cameraY =
        200 - current.y;

    }



    ctx.save();



    ctx.translate(

        0,

        cameraY

    );




    // Draw placed blocks

    blocks.forEach((block,index)=>{


        ctx.shadowBlur = 20;

        ctx.shadowColor =
        "#00eaff";


        ctx.fillStyle =
        index % 2 === 0
        ?
        "#00eaff"
        :
        "#8a2be2";



        ctx.fillRect(

            block.x,

            block.y,

            block.width,

            block.height

        );


    });





    // moving block

    if(!gameOver){


        ctx.shadowBlur = 20;

        ctx.shadowColor =
        "#00ff99";


        ctx.fillStyle =
        "#00ff99";



        ctx.fillRect(

            current.x,

            current.y,

            current.width,

            current.height

        );


    }



    ctx.restore();



    ctx.shadowBlur = 0;


}









function gameLoop(){


    update();

    draw();


    requestAnimationFrame(
        gameLoop
    );


}






canvas.addEventListener(
"click",
drop
);



canvas.addEventListener(
"touchstart",
drop
);



restart.onclick = start;



start();

gameLoop();
