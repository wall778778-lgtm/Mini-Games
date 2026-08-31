/*
================================
 THE DOOR - PUZZLE ENGINE
================================
*/


let currentPuzzle = null;



/*
Create a new puzzle
*/

function createPuzzle(level){


    let correct =
    Math.floor(
        Math.random()*4
    );



    let symbols = [
        "△",
        "○",
        "□",
        "☆"
    ];



    let doors=[];



    for(
        let i=0;
        i<4;
        i++
    ){

        doors.push({

            number:i+1,

            symbol:symbols[i],

            statement:"",

            truth:false

        });


    }





    /*
    Difficulty changes
    */

    if(level < 3){


        generateEasy(
            doors,
            correct
        );


    }

    else if(level < 7){


        generateMedium(
            doors,
            correct
        );


    }

    else{


        generateHard(
            doors,
            correct
        );


    }





    currentPuzzle={


        rule:
        "Only ONE door is correct.",


        doors:doors,


        answer:correct


    };



    return currentPuzzle;

}






/*
==============================
 EASY
==============================
*/


function generateEasy(
doors,
correct
){


    for(
        let i=0;
        i<4;
        i++
    ){


        if(i===correct){


            doors[i].statement =
            "I am the correct door.";


            doors[i].truth=true;


        }

        else{


            doors[i].statement =
            "I am not the correct door.";


            doors[i].truth=false;


        }


    }



}







/*
==============================
 MEDIUM
==============================
*/


function generateMedium(
doors,
correct
){


    let other =
    (correct+1)%4;



    doors[correct].statement =
    "The next door is not correct.";


    doors[other].statement =
    "The correct door is "+
    (correct+1)+".";



    for(
        let i=0;
        i<4;
        i++
    ){


        if(i!==correct &&
           i!==other)
        {


            doors[i].statement =
            "I am wrong.";


        }


    }



}







/*
==============================
 HARD
==============================
*/


function generateHard(
doors,
correct
){



    let names=[
        "Triangle",
        "Circle",
        "Square",
        "Star"
    ];



    for(
        let i=0;
        i<4;
        i++
    ){


        if(i===correct){


            doors[i].statement =
            names[i]+
            " is the answer.";


        }

        else{


            doors[i].statement =
            names[
            correct
            ]+
            " is not here.";


        }


    }



}








/*
Check player's choice
*/


function checkPuzzleAnswer(
doorNumber
){



    if(
        !currentPuzzle
    )
    return false;



    return (
        doorNumber ===
        currentPuzzle.answer
    );

}







/*
Show text on screen
*/


function puzzleToText(){


    if(!currentPuzzle)
        return "";



    let text =
    currentPuzzle.rule+
    "\n\n";



    currentPuzzle.doors.forEach(
    door=>{


        text +=

        "Door "
        +
        door.number
        +
        " "
        +
        door.symbol
        +
        ":\n"
        +
        door.statement
        +
        "\n\n";


    });



    return text;

}
