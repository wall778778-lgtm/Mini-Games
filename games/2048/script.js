const board = document.getElementById("board");
const scoreText = document.getElementById("score");
const restart = document.getElementById("restart");
const message = document.getElementById("message");


let grid;
let score;



function startGame(){

    grid = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];


    score = 0;

    scoreText.textContent = score;

    message.textContent="";


    addTile();

    addTile();

    draw();

}



function addTile(){

    let empty=[];


    for(let r=0;r<4;r++){

        for(let c=0;c<4;c++){

            if(grid[r][c]===0)

                empty.push([r,c]);

        }

    }



    if(empty.length===0)
        return;



    let spot =
    empty[Math.floor(Math.random()*empty.length)];



    grid[spot[0]][spot[1]] =
    Math.random()<0.9 ? 2 : 4;

}



function draw(){

    board.innerHTML="";


    grid.forEach(row=>{

        row.forEach(value=>{


            let tile=document.createElement("div");

            tile.className="tile";

            tile.textContent =
            value===0 ? "" : value;


            board.appendChild(tile);


        });


    });

}



function moveLeft(){


    let moved=false;


    for(let r=0;r<4;r++){


        let row =
        grid[r].filter(x=>x!==0);



        for(let i=0;i<row.length-1;i++){

            if(row[i]===row[i+1]){

                row[i]*=2;

                score+=row[i];

                row.splice(i+1,1);

                moved=true;

            }

        }



        while(row.length<4)

            row.push(0);



        if(row.join()!=grid[r].join())

            moved=true;



        grid[r]=row;


    }



    if(moved){

        addTile();

        draw();

    }


}



function rotate(){

    grid =
    grid[0].map((_,i)=>
        grid.map(row=>row[i]).reverse()
    );

}



function move(){

    moveLeft();

}



document.addEventListener(
"keydown",
e=>{


if(e.key==="ArrowLeft")

    move();


if(e.key==="ArrowRight"){

    rotate();
    rotate();
    move();
    rotate();
    rotate();

}


if(e.key==="ArrowUp"){

    rotate();
    rotate();
    rotate();
    move();
    rotate();

}


if(e.key==="ArrowDown"){

    rotate();
    move();
    rotate();
    rotate();
    rotate();

}


});



restart.onclick=startGame;



startGame();