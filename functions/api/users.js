export async function onRequestGet() {

    return Response.json({

        loggedIn: false,

        message: "User API is working"

    });

}