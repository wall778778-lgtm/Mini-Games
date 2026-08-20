let score = 0;


const scoreText = document.getElementById("score");

const button = document.getElementById("clickButton");


button.addEventListener("click", () => {

    score++;

    scoreText.textContent = "Score: " + score;

});