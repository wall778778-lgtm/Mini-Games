const icons = [
    "🍎",
    "🍌",
    "🍇",
    "🍒",
    "🍉",
    "🥝",
    "🍍",
    "🥥"
];


let cards = [...icons, ...icons];


cards.sort(() => Math.random() - 0.5);



const board = document.getElementById("gameBoard");

const movesText = document.getElementById("moves");

const restartButton = document.getElementById("restart");

const message = document.getElementById("message");



let firstCard = null;

let secondCard = null;

let lock = false;

let moves = 0;

let matched = 0;



function createBoard(){


    board.innerHTML = "";


    cards.forEach(icon => {


        const card = document.createElement("div");


        card.classList.add("card");


        card.dataset.icon = icon;


        card.textContent = "?";


        card.addEventListener("click", flipCard);


        board.appendChild(card);


    });


}



function flipCard(){


    if(lock)
        return;


    if(this.classList.contains("flipped"))
        return;



    this.textContent = this.dataset.icon;

    this.classList.add("flipped");



    if(!firstCard){

        firstCard = this;

    }
    else{

        secondCard = this;

        moves++;

        movesText.textContent = moves;


        checkMatch();

    }

}




function checkMatch(){


    if(firstCard.dataset.icon === secondCard.dataset.icon){


        firstCard.classList.add("matched");

        secondCard.classList.add("matched");


        matched += 2;


        resetCards();



        if(matched === cards.length){

            message.textContent = "🎉 You won!";

        }


    }
    else{


        lock = true;


        setTimeout(()=>{


            firstCard.textContent = "?";

            secondCard.textContent = "?";


            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");


            resetCards();


        },800);


    }


}



function resetCards(){

    firstCard = null;

    secondCard = null;

    lock = false;

}



function restart(){

    cards.sort(() => Math.random() - 0.5);


    moves = 0;

    matched = 0;


    movesText.textContent = 0;


    message.textContent = "";


    createBoard();

}



restartButton.addEventListener("click", restart);



createBoard();