const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const message = document.getElementById("message");
const interaction = document.getElementById("interaction");

const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");



/*
====================================
 SETTINGS
====================================
*/

const FOV = Math.PI / 3;

const MOVE_SPEED = 3;

const ROTATE_SPEED = 0.003;

const MAX_DISTANCE = 20;



/*
====================================
 MAP
====================================
*/


const map = [

"###############",

"#S............#",

"#.#####.#####.#",

"#.....#.....#.#",

"#####.#.#####.#",

"#.....#.......#",

"#.#####.#####.#",

"#.............#",

"###############"

];



const mapWidth = map[0].length;
const mapHeight = map.length;



/*
====================================
 DOORS
====================================
*/


let doors = [

    {
        x:12.5,
        y:3.5,
        opened:false,
        name:"Door 1",
        symbol:"△"
    },


    {
        x:10.5,
        y:5.5,
        opened:false,
        name:"Door 2",
        symbol:"○"
    },


    {
        x:4.5,
        y:5.5,
        opened:false,
        name:"Door 3",
        symbol:"□"
    },


    {
        x:7.5,
        y:7.5,
        opened:false,
        name:"Door 4",
        symbol:"☆"
    }

];





/*
====================================
 PLAYER
====================================
*/


let player = {

    x:1.5,

    y:1.5,

    angle:0

};



let keys = {};

let gameStarted=false;

let level=1;

let lives=3;





/*
====================================
 RESIZE
====================================
*/


function resize(){

    canvas.width =
    window.innerWidth;


    canvas.height =
    window.innerHeight;

}


window.addEventListener(
"resize",
resize
);


resize();






/*
====================================
 COLLISION
====================================
*/


function isWall(x,y){


    let mx =
    Math.floor(x);


    let my =
    Math.floor(y);



    if(
        mx < 0 ||
        my < 0 ||
        mx >= mapWidth ||
        my >= mapHeight
    ){

        return true;

    }



    if(
        map[my][mx] === "#"
    ){

        return true;

    }




    // closed doors block movement

    for(let door of doors){


        let dx =
        Math.abs(
            x-door.x
        );


        let dy =
        Math.abs(
            y-door.y
        );



        if(
            dx < 0.35 &&
            dy < 0.35 &&
            !door.opened
        ){

            return true;

        }

    }



    return false;


}





function canMove(x,y){


    let size=0.2;



    return (

        !isWall(x-size,y-size) &&

        !isWall(x+size,y-size) &&

        !isWall(x-size,y+size) &&

        !isWall(x+size,y+size)

    );

}





/*
====================================
 MOVEMENT
====================================
*/


function updatePlayer(delta){


    if(!gameStarted)
        return;



    let forward=0;

    let side=0;



    if(keys["w"])
        forward++;


    if(keys["s"])
        forward--;


    if(keys["a"])
        side--;


    if(keys["d"])
        side++;




    if(
        forward===0 &&
        side===0
    )
        return;



    let length =
    Math.sqrt(
        forward*forward+
        side*side
    );



    forward/=length;

    side/=length;



    let speed =
    MOVE_SPEED*delta;



    let dx =
    (
        Math.cos(player.angle)*forward -
        Math.sin(player.angle)*side
    ) * speed;



    let dy =
    (
        Math.sin(player.angle)*forward +
        Math.cos(player.angle)*side
    ) * speed;





    if(
        canMove(
            player.x+dx,
            player.y
        )
    ){

        player.x+=dx;

    }



    if(
        canMove(
            player.x,
            player.y+dy
        )
    ){

        player.y+=dy;

    }


}






/*
====================================
 INPUT
====================================
*/


document.addEventListener(
"keydown",
e=>{


    keys[
        e.key.toLowerCase()
    ]=true;



    if(
        e.key.toLowerCase()
        ===
        "e"
    ){

        interactDoor();

    }


});




document.addEventListener(
"keyup",
e=>{


    keys[
        e.key.toLowerCase()
    ]=false;


});





canvas.addEventListener(
"click",
()=>{


    gameStarted=true;


    message.textContent=
    "Explore the maze...";


    canvas.requestPointerLock();


});





document.addEventListener(
"mousemove",
e=>{


    if(
        document.pointerLockElement
        ===
        canvas
    ){

        player.angle +=
        e.movementX *
        ROTATE_SPEED;

    }


});





/*
====================================
 DOOR DETECTION
====================================
*/


function getNearbyDoor(){


    for(let door of doors){


        let distance =
        Math.sqrt(

            (player.x-door.x)**2+

            (player.y-door.y)**2

        );



        if(distance < 1.3){

            return door;

        }


    }


    return null;


}

/*
====================================
 DOOR INTERACTION
====================================
*/


function interactDoor(){

    let door =
    getNearbyDoor();


    if(!door)
        return;



    if(!door.opened){


        door.opened=true;


        interaction.classList.remove(
            "show"
        );


        message.textContent =
        "🚪 Door opened";


        setTimeout(()=>{

            message.textContent =
            "The room beyond is waiting...";

        },1500);


    }

}







function checkDoorPrompt(){


    let door =
    getNearbyDoor();



    if(
        door &&
        !door.opened
    ){

        interaction.classList.add(
            "show"
        );


    }
    else{

        interaction.classList.remove(
            "show"
        );

    }

}







/*
====================================
 RAYCASTING
====================================
*/


function castRay(angle){


    let distance=0;



    while(
        distance < MAX_DISTANCE
    ){


        let x =
        player.x+
        Math.cos(angle)*distance;


        let y =
        player.y+
        Math.sin(angle)*distance;



        if(
            isWall(x,y)
        ){

            return distance;

        }



        distance+=0.02;


    }



    return MAX_DISTANCE;


}







/*
====================================
 BACKGROUND
====================================
*/


function drawBackground(){


    ctx.fillStyle="#111827";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height/2
    );



    ctx.fillStyle="#050505";


    ctx.fillRect(
        0,
        canvas.height/2,
        canvas.width,
        canvas.height/2
    );


}








/*
====================================
 DRAW DOORS
====================================
*/


function drawDoors(){


    for(let door of doors){


        let dx =
        door.x-player.x;


        let dy =
        door.y-player.y;



        let distance =
        Math.sqrt(
            dx*dx+dy*dy
        );



        let angle =
        Math.atan2(dy,dx)
        -
        player.angle;



        while(angle > Math.PI)
            angle-=Math.PI*2;



        while(angle < -Math.PI)
            angle+=Math.PI*2;




        if(
            Math.abs(angle)
            <
            FOV/2
        ){


            let wallDistance =
            castRay(
                player.angle+angle
            );



            // wall blocks the door view

            if(
                wallDistance < distance
            ){

                continue;

            }





            let screenX =
            (
                0.5+
                angle/FOV
            )
            *
            canvas.width;



            let height =
            canvas.height/distance;



            ctx.fillStyle =
            door.opened
            ?
            "#333"
            :
            "#8b4513";



            ctx.fillRect(

                screenX-height/4,

                canvas.height/2-height/2,

                height/2,

                height

            );



            ctx.fillStyle="white";


            ctx.font="24px Arial";


            ctx.fillText(

                door.symbol,

                screenX-10,

                canvas.height/2

            );


        }


    }


}









/*
====================================
 DRAW 3D WORLD
====================================
*/


function draw3D(){


    drawBackground();



    for(
        let x=0;
        x<canvas.width;
        x++
    ){


        let camera =
        x/canvas.width;



        let angle =
        player.angle-
        FOV/2+
        camera*FOV;



        let distance =
        castRay(angle);



        distance *=
        Math.cos(
            angle-player.angle
        );



        let wallHeight =
        canvas.height/distance;



        let top =
        (
            canvas.height-
            wallHeight
        )/2;



        let shade =
        Math.max(
            20,
            130-distance*7
        );



        ctx.fillStyle =
        `rgb(${shade},${shade},${shade})`;



        ctx.fillRect(

            x,

            top,

            1,

            wallHeight

        );


    }




    drawDoors();


}









/*
====================================
 GAME LOOP
====================================
*/


let lastTime =
performance.now();



function gameLoop(time){


    let delta =
    (time-lastTime)/1000;



    lastTime=time;



    delta =
    Math.min(
        delta,
        0.05
    );



    updatePlayer(delta);



    checkDoorPrompt();



    draw3D();



    requestAnimationFrame(
        gameLoop
    );


}







/*
====================================
 START
====================================
*/


levelText.textContent =
level;


livesText.textContent =
lives;



message.textContent =
"Click to enter the maze";



requestAnimationFrame(
gameLoop
);
