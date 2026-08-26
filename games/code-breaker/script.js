const input = document.getElementById("guessInput");
const history = document.getElementById("history");
const attemptsText = document.getElementById("attempts");

const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");

const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");


let secretCode = "";
let attempts = 0;



function startGame() {

    secretCode = "";

    // Generate 4 digit code (duplicates allowed)
    while (secretCode.length < 4) {

        let number = Math.floor(Math.random() * 10);

        secretCode += number;

    }


    attempts = 0;

    attemptsText.textContent = attempts;

    history.innerHTML = "";

    input.value = "";

    resultCard.classList.add("hidden");

    console.log("Secret code:", secretCode); // Remove later

}



function checkGuess() {

    let guess = input.value.trim();


    if (guess.length !== 4 || isNaN(guess)) {
        return;
    }


    attempts++;

    attemptsText.textContent = attempts;



    let secretArray = secretCode.split("");
    let guessArray = guess.split("");

    let correctPlace = 0;
    let correctNumber = 0;



    // Check correct positions
    for (let i = 0; i < 4; i++) {

        if (guessArray[i] === secretArray[i]) {

            correctPlace++;

            secretArray[i] = null;
            guessArray[i] = null;

        }

    }



    // Check wrong positions
    for (let i = 0; i < 4; i++) {

        if (guessArray[i] !== null) {

            let index = secretArray.indexOf(guessArray[i]);


            if (index !== -1) {

                correctNumber++;

                secretArray[index] = null;

            }

        }

    }



    let result = document.createElement("div");

    result.className = "guess";


    result.innerHTML = `
        🔢 ${guess}
        <br>
        🟢 Correct place: ${correctPlace}
        <br>
        🟡 Wrong place: ${correctNumber}
    `;


    history.prepend(result);



    if (correctPlace === 4) {

        winGame();

    }


    input.value = "";

}



function winGame() {

    resultTitle.textContent = "🎉 You Cracked It!";

    resultScore.textContent =
        "Solved in " + attempts + " attempts";


    resultCard.classList.remove("hidden");

}



function restartGame() {

    startGame();

}



guessButton.addEventListener(
    "click",
    checkGuess
);


restartButton.addEventListener(
    "click",
    restartGame
);



input.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            checkGuess();

        }

    }
);



startGame();
