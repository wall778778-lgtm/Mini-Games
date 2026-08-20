export async function onRequestPost(context) {

    const { request, env } = context;

    const data = await request.json();

    const username = data.username;
    const email = data.email;
    const password = data.password;


    if (!username || !email || !password) {

        return Response.json({
            success: false,
            message: "Missing information"
        });

    }


    // Database connection will be added after we confirm D1 binding

    return Response.json({

        success: true,

        message: "Register API is working"

    });

}