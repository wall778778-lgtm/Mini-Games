const board = document.getElementById("board");
const mistakesText = document.getElementById("mistakes");

let solution = [];
let puzzle = [];
let selectedCell = null;
let mistakes = 0;


function generateBoard() {

    solution = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
    ];


    puzzle = solution.map(row => [...row]);


    for(let i=0;i<45;i++){

        let r=Math.floor(Math.random()*9);
        let c=Math.floor(Math.random()*9);

        puzzle[r][c]="";

    }

}


function drawBoard(){

    board.innerHTML="";


    puzzle.forEach((row,r)=>{

        row.forEach((num,c)=>{

            let cell=document.createElement("div");

            cell.className="cell";

            if(num){

                cell.textContent=num;
                cell.classList.add("fixed");

            }


            cell.onclick=()=>{

                if(!cell.classList.contains("fixed")){

                    selectedCell={
                        element:cell,
                        row:r,
                        col:c
                    };

                    document.querySelectorAll(".cell")
                    .forEach(x=>x.classList.remove("selected"));

                    cell.classList.add("selected");

                }

            };


            board.appendChild(cell);

        });

    });

}


function selectNumber(num){

    if(selectedCell){

        let {row,col,element}=selectedCell;


        if(solution[row][col]===num){

            element.textContent=num;
            puzzle[row][col]=num;

        }
        else{

            mistakes++;
            mistakesText.textContent=mistakes;

        }

    }

}



document.getElementById("newGame")
.onclick=()=>{

    mistakes=0;
    mistakesText.textContent=0;

    generateBoard();
    drawBoard();

};


generateBoard();
drawBoard();