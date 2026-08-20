export async function onRequestPost(context) {

    const { request } = context;


    const data = await request.json();


    const email = data.email;
    const password = data.password;


    if (!email || !password) {

        return Response.json({

            success: false,

            message: "Missing information"

        });

    }


    return Response.json({

        success: true,

        message: "Login API is working"

    });

}