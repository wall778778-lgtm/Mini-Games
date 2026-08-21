alert("JS is working");
console.log("Mini Games website loaded.");


// Old homepage buttons (only run if they exist)

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const startButton = document.querySelector(".start-button");


if(loginButton){

    loginButton.addEventListener("click", () => {
        alert("Login system coming soon.");
    });

}


if(registerButton){

    registerButton.addEventListener("click", () => {
        alert("Registration system coming soon.");
    });

}


if(startButton){

    startButton.addEventListener("click", () => {

        const section = document.querySelector(".welcome");

        if(section){

            window.scrollTo({

                top: section.offsetTop,

                behavior: "smooth"

            });

        }

    });

}



// Register system

const registerForm = document.getElementById("registerForm");


if(registerForm){


    registerForm.addEventListener("submit", async (e)=>{


        e.preventDefault();


        const username =
        document.getElementById("username").value;


        const email =
        document.getElementById("email").value;


        const password =
        document.getElementById("password").value;



        const response = await fetch("/api/register", {


            method: "POST",


            headers: {

                "Content-Type": "application/json"

            },


            body: JSON.stringify({

                username,

                email,

                password

            })


        });



        const result = await response.json();


        document.getElementById("message").textContent =
        result.message;



        if(result.success){

            registerForm.reset();

        }


    });


}
