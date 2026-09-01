console.log("Mini Games JavaScript loaded!");

document.addEventListener("DOMContentLoaded", function () {

    console.log("Mini Games DOM loaded!");

    // =====================================================
    // GAME SEARCH
    // =====================================================

    const searchBar = document.getElementById("gameSearch");
    const gameCards = document.querySelectorAll(".game-card");

    console.log("Search bar found:", searchBar);
    console.log("Game cards found:", gameCards.length);


    if (!searchBar) {

        console.error("Game search bar was not found.");

        return;

    }


    searchBar.addEventListener("input", function () {

        const searchText =
            this.value
                .toLowerCase()
                .trim();


        console.log("Searching:", searchText);


        let foundGames = 0;


        gameCards.forEach(function (card) {

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
             * Search the game name OR description.
             */

            const matches =
                searchText === "" ||
                title.includes(searchText) ||
                description.includes(searchText);


            if (matches) {

                card.style.display = "";

                foundGames++;

            } else {

                card.style.display = "none";

            }

        });


        // =================================================
        // NO RESULTS
        // =================================================

        let noResults =
            document.getElementById("noGameResults");


        if (foundGames === 0) {

            if (!noResults) {

                noResults =
                    document.createElement("div");


                noResults.id =
                    "noGameResults";


                noResults.textContent =
                    "No games found.";


                noResults.style.gridColumn =
                    "1 / -1";


                noResults.style.textAlign =
                    "center";


                noResults.style.padding =
                    "40px";


                noResults.style.color =
                    "#9ba0b5";


                noResults.style.fontSize =
                    "18px";


                const gameGrid =
                    document.querySelector(".game-grid");


                if (gameGrid) {

                    gameGrid.appendChild(
                        noResults
                    );

                }

            }


            noResults.style.display =
                "block";

        }

        else {

            if (noResults) {

                noResults.style.display =
                    "none";

            }

        }

    });


    // =====================================================
    // ESCAPE CLEARS SEARCH
    // =====================================================

    searchBar.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                searchBar.value = "";

                searchBar.dispatchEvent(
                    new Event("input")
                );

                searchBar.blur();

            }

        }
    );


});
