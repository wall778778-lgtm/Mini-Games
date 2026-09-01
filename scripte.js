console.log("Mini Games website loaded.");


// =====================================================
// OLD HOMEPAGE BUTTONS
// =====================================================

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const startButton = document.querySelector(".start-button");


if (loginButton) {

    loginButton.addEventListener("click", () => {

        alert("Login system coming soon.");

    });

}


if (registerButton) {

    registerButton.addEventListener("click", () => {

        alert("Registration system coming soon.");

    });

}


if (startButton) {

    startButton.addEventListener("click", () => {

        const section =
            document.querySelector(".welcome");

        if (section) {

            window.scrollTo({

                top: section.offsetTop,

                behavior: "smooth"

            });

        }

    });

}


// =====================================================
// REGISTER SYSTEM
// =====================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const username =
                document.getElementById(
                    "username"
                ).value;

            const email =
                document.getElementById(
                    "email"
                ).value;

            const password =
                document.getElementById(
                    "password"
                ).value;

            try {

                const response =
                    await fetch(
                        "/api/register",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    username,
                                    email,
                                    password

                                })

                        }
                    );


                const result =
                    await response.json();


                const resultMessage =
                    document.getElementById(
                        "message"
                    );


                if (resultMessage) {

                    resultMessage.textContent =
                        result.message;

                }


                if (result.success) {

                    registerForm.reset();

                }

            }

            catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

            }

        }
    );

}


// =====================================================
// GAME SEARCH
// =====================================================

const gameSearch =
    document.getElementById("gameSearch");


const gameCards =
    document.querySelectorAll(".game-card");


if (gameSearch && gameCards.length > 0) {

    gameSearch.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            let visibleGames = 0;


            gameCards.forEach(
                card => {

                    const titleElement =
                        card.querySelector("h3");


                    const descriptionElement =
                        card.querySelector("p");


                    const title =
                        titleElement
                            ? titleElement.textContent
                                .toLowerCase()
                            : "";


                    const description =
                        descriptionElement
                            ? descriptionElement.textContent
                                .toLowerCase()
                            : "";


                    /*
                     * Search both the game name
                     * and its description.
                     */

                    const searchableText =
                        title +
                        " " +
                        description;


                    /*
                     * Show matching games.
                     */

                    if (
                        search === "" ||
                        searchableText.includes(search)
                    ) {

                        card.style.display = "";

                        visibleGames++;

                    }

                    else {

                        card.style.display = "none";

                    }

                }
            );


            // =====================================================
            // NO RESULTS MESSAGE
            // =====================================================

            let noResults =
                document.getElementById(
                    "noGameResults"
                );


            if (visibleGames === 0) {

                if (!noResults) {

                    noResults =
                        document.createElement(
                            "div"
                        );


                    noResults.id =
                        "noGameResults";


                    noResults.textContent =
                        "No games found.";


                    noResults.style.textAlign =
                        "center";


                    noResults.style.width =
                        "100%";


                    noResults.style.padding =
                        "30px";


                    noResults.style.color =
                        "#9ba0b5";


                    noResults.style.fontSize =
                        "18px";


                    const gameGrid =
                        document.querySelector(
                            ".game-grid"
                        );


                    if (gameGrid) {

                        gameGrid.appendChild(
                            noResults
                        );

                    }

                }

                else {

                    noResults.style.display =
                        "block";

                }

            }

            else {

                if (noResults) {

                    noResults.style.display =
                        "none";

                }

            }

        }
    );

}


// =====================================================
// ESCAPE KEY CLEARS SEARCH
// =====================================================

if (gameSearch) {

    gameSearch.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                this.value = "";

                this.dispatchEvent(
                    new Event("input")
                );

                this.blur();

            }

        }
    );

}
