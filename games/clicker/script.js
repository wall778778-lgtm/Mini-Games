let score = 0;
let clicks = 0;
let cps = 0;

const scoreText = document.getElementById("score");
const cpsText = document.getElementById("cps");
const button = document.getElementById("clickButton");


button.addEventListener("click", () => {

    score++;
    clicks++;

    scoreText.textContent = "Score: " + score;

});


setInterval(() => {

    cps = clicks;

    cpsText.textContent = "Clicks per second: " + cps;

    clicks = 0;

}, 1000);
