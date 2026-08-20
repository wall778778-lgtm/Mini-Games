const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const startButton = document.querySelector(".start-button");

loginButton.addEventListener("click", () => {
    alert("Login system coming soon.");
});

registerButton.addEventListener("click", () => {
    alert("Registration system coming soon.");
});

startButton.addEventListener("click", () => {
    window.scrollTo({
        top: document.querySelector(".welcome").offsetTop,
        behavior: "smooth"
    });
});