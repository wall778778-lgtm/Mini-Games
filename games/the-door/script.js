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

 # = wall
 . = floor
 S = start
 D = door position
====================================
*/


const map = [

"###############",

"#S............#",

"#.#####.#####.#",

"#.....#.....D.#",

"#####.#.#######",

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
        x: 12.5,
        y: 3.5,

        opened:false,

        name:"Door 1"

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


    return map[my][mx] === "#";


}





function canMove(x,y){


    let size = 0.2;



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





    if(canMove(
        player.x+dx,
        player.y
    )){

        player.x+=dx;

    }




    if(canMove(
        player.x,
        player.y+dy
    )){

        player.y+=dy;

    }



}






/*
====================================
 KEYBOARD
====================================
*/


document.addEventListener(
"keydown",
e=>{


    keys[
        e.key.toLowerCase()
    ]=true;



    if(
        e.key.toLowerCase()==="e"
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





/*
====================================
 MOUSE LOOK
====================================
*/


canvas.addEventListener(
"click",
()=>{


    gameStarted=true;


    message.textContent =
    "Find the door...";


    canvas.requestPointerLock();



});




document.addEventListener(
"mousemove",
e=>{


    if(
        document.pointerLockElement
        === canvas
    ){


        player.angle +=
        e.movementX *
        ROTATE_SPEED;


    }



});





/*
====================================
 DOOR DISTANCE
====================================
*/


function getNearbyDoor(){


    for(let door of doors){


        let distance =
        Math.sqrt(

            (player.x-door.x)**2 +

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


        interaction.classList.remove("show");


        message.textContent =
        "🚪 Door opened...";


        // Temporary until puzzle system

        setTimeout(()=>{

            message.textContent =
            "A puzzle awaits behind this door.";

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

        interaction.classList.add("show");


    }
    else{

        interaction.classList.remove("show");

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
        player.x +
        Math.cos(angle)*distance;


        let y =
        player.y +
        Math.sin(angle)*distance;



        if(isWall(x,y)){

            return distance;

        }



        distance+=0.02;


    }



    return MAX_DISTANCE;


}






/*
====================================
 DRAW BACKGROUND
====================================
*/


function drawBackground(){


    ctx.fillStyle="#101827";


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
 DRAW DOORS IN 3D
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


            let screenX =
            (
                0.5 +
                angle/FOV
            )
            *
            canvas.width;



            let size =
            canvas.height/distance;



            ctx.fillStyle =
            door.opened
            ?
            "#333"
            :
            "#8b5a2b";



            ctx.fillRect(

                screenX-size/4,

                canvas.height/2-size/2,

                size/2,

                size

            );



            ctx.fillStyle="white";


            ctx.font="20px Arial";


            ctx.fillText(

                door.name,

                screenX-30,

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



    let rays =
    canvas.width;



    for(
        let x=0;
        x<rays;
        x++
    ){


        let camera =
        x/rays;



        let angle =
        player.angle -
        FOV/2 +
        camera*FOV;



        let distance =
        castRay(angle);



        distance *=
        Math.cos(
            angle-player.angle
        );



        let height =
        canvas.height/distance;



        let top =
        canvas.height/2-height/2;



        let shade =
        Math.max(
            20,
            120-distance*6
        );



        ctx.fillStyle =
        `rgb(${shade},${shade},${shade})`;



        ctx.fillRect(

            x,

            top,

            1,

            height

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



function loop(time){


    let delta =
    (time-lastTime)/1000;



    lastTime=time;



    delta =
    Math.min(delta,0.05);



    updatePlayer(delta);



    checkDoorPrompt();



    draw3D();



    requestAnimationFrame(loop);


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



requestAnimationFrame(loop);
