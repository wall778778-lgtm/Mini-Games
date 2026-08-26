let secretCode;

let attempts = 0;

const input = document.getElementById("guessInput");
const history = document.getElementById("history");
const attemptsText = document.getElementById("attempts");

const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");



function startGame(){

    secretCode = "";

    while(secretCode.length < 4){

        let number =
        Math.floor(Math.random()*10);

        if(!secretCode.includes(number)){

            secretCode += number;

        }

    }


    attempts = 0;

    attemptsText.textContent = attempts;

    history.innerHTML="";

    input.value="";

    resultCard.classList.add("hidden");

}



function checkGuess(){


    let guess = input.value;


    if(guess.length !== 4){

        return;

    }


    attempts++;

    attemptsText.textContent = attempts;


    let correctPlace = 0;

    let correctNumber = 0;


    for(let i=0;i<4;i++){

        if(guess[i] === secretCode[i]){

            correctPlace++;

        }

        else if(secretCode.includes(guess[i])){

            correctNumber++;

        }

    }



    let result =
    document.createElement("div");

    result.className="guess";


    result.innerHTML =

    guess +
    "<br>🟢 Correct place: "
    + correctPlace +

    "<br>🟡 Wrong place: "
    + correctNumber;



    history.prepend(result);



    if(correctPlace === 4){

        winGame();

    }


    input.value="";

}



function winGame(){

    resultTitle.textContent="🎉 You Cracked It!";

    resultScore.textContent =
    "Attempts: " + attempts;


    resultCard.classList.remove("hidden");

}



function restartGame(){

    startGame();

}



startGame();
