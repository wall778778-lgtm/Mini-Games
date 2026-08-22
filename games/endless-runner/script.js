const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");


let player;
let obstacles = [];
let stars = [];
let particles = [];

let score = 0;
let speed = 6;

let running = true;

let loop;



function startGame(){

    player = {

        x:80,
        y:160,
        size:35,
        velocity:0,
        jumping:false

    };


    obstacles = [];
    particles = [];

    score = 0;
    speed = 6;

    scoreText.textContent = score;

    message.textContent = "";

    running = true;


    stars = [];

    for(let i=0;i<60;i++){

        stars.push({

            x:Math.random()*canvas.width,
            y:Math.random()*180,
            size:Math.random()*2+1

        });

    }


    clearInterval(loop);

    loop = setInterval(update,16);

}





function jump(){

    if(!player.jumping){

        player.velocity = -11;

        player.jumping = true;

        createParticles(
            player.x,
            player.y
        );

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



    // stars

    stars.forEach(star=>{


        star.x -= 1;


        if(star.x < 0)

            star.x = canvas.width;



        ctx.fillStyle="#ffffff";

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );


    });





    // player physics

    player.velocity += 0.5;

    player.y += player.velocity;



    if(player.y >= 160){

        player.y = 160;

        player.velocity = 0;

        player.jumping = false;

    }





    // create obstacles

    if(Math.random() < 0.008){


        obstacles.push({

            x:canvas.width + 20,

            y:150,

            width:45,

            height:70

        });


    }






    // move obstacles


    obstacles.forEach(ob=>{


        ob.x -= speed;



        if(

            player.x < ob.x + ob.width &&

            player.x + player.size > ob.x &&

            player.y < ob.y + ob.height &&

            player.y + player.size > ob.y

        ){

            gameOver();

        }


    });




    obstacles =
    obstacles.filter(
        ob=>ob.x > -100
    );





    // particles

    particles.forEach(p=>{


        p.x += p.dx;

        p.y += p.dy;

        p.life--;


    });



    particles =
    particles.filter(
        p=>p.life>0
    );





    score++;


    if(score % 800 === 0){

        speed += 0.3;

    }


    scoreText.textContent =
    Math.floor(score/10);





    draw();


}






function draw(){



    // player

    ctx.shadowBlur = 20;

    ctx.shadowColor = "#00ff99";


    ctx.fillStyle = "#00ff99";


    ctx.fillRect(

        player.x,

        player.y,

        player.size,

        player.size

    );



    ctx.shadowBlur = 0;



    // eyes

    ctx.fillStyle="black";


    ctx.fillRect(

        player.x+22,

        player.y+8,

        5,

        5

    );


    ctx.fillRect(

        player.x+22,

        player.y+22,

        5,

        5

    );






    // obstacles


    obstacles.forEach(ob=>{


        ctx.shadowBlur = 25;

        ctx.shadowColor="#ff3366";


        ctx.fillStyle="#ff3366";


        ctx.beginPath();


        ctx.moveTo(
            ob.x + ob.width/2,
            ob.y
        );


        ctx.lineTo(
            ob.x + ob.width,
            ob.y + ob.height
        );


        ctx.lineTo(
            ob.x,
            ob.y + ob.height
        );


        ctx.closePath();


        ctx.fill();


    });



    ctx.shadowBlur = 0;



    // ground

    ctx.fillStyle="#00eaff";


    ctx.fillRect(

        0,

        220,

        canvas.width,

        3

    );





    // particles


    particles.forEach(p=>{


        ctx.fillStyle="#00ff99";


        ctx.fillRect(

            p.x,

            p.y,

            4,

            4

        );


    });


}







function createParticles(x,y){


    for(let i=0;i<10;i++){


        particles.push({

            x:x,

            y:y,

            dx:(Math.random()-0.5)*5,

            dy:(Math.random()-0.5)*5,

            life:30

        });


    }


}







function gameOver(){


    running=false;


    clearInterval(loop);


    message.textContent =
    "Game Over 🚀";


}







document.addEventListener(
"keydown",
e=>{


    if(e.code==="Space"){

        jump();

    }


});





canvas.addEventListener(
"touchstart",
()=>{


    jump();


});





startGame();
