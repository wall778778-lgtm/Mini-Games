export async function onRequestPost(context) {

    const { request, env } = context;


    const data = await request.json();


    const username = data.username;
    const email = data.email;
    const password = data.password;


    if (!username || !email || !password) {

        return Response.json({

            success: false,

            message: "Please fill all fields"

        });

    }


    try {


        await env.DB
        .prepare(
            `
            INSERT INTO users
            (username, email, password)
            VALUES (?, ?, ?)
            `
        )
        .bind(
            username,
            email,
            password
        )
        .run();



        return Response.json({

            success: true,

            message: "Account created successfully"

        });



    } catch(error) {


        return Response.json({

            success: false,

            message: "Username or email already exists"

        });


    }

}
