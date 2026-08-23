const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050820);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


camera.position.set(0, 0, 8);



const renderer = new THREE.WebGLRenderer({
    antialias:true
});


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


document.body.appendChild(renderer.domElement);



let score = 0;

let gameOver = false;


const scoreText =
document.getElementById("score");

const message =
document.getElementById("message");



let keys = {};

let ship;

let asteroids=[];

let particles=[];



// LIGHT

const light =
new THREE.PointLight(
    0xffffff,
    5
);

light.position.set(
    0,
    5,
    5
);

scene.add(light);



const ambient =
new THREE.AmbientLight(
    0x555555
);

scene.add(ambient);




// SHIP


const shipGeometry =
new THREE.ConeGeometry(
    0.6,
    1.8,
    4
);


const shipMaterial =
new THREE.MeshStandardMaterial({

    color:0x00ffff,

    emissive:0x0099ff,

    emissiveIntensity:2

});


ship =
new THREE.Mesh(
    shipGeometry,
    shipMaterial
);


ship.rotation.x =
Math.PI/2;


ship.position.z=0;


scene.add(ship);




// STARS


for(let i=0;i<300;i++){


    const star =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.03
        ),

        new THREE.MeshBasicMaterial({
            color:0xffffff
        })

    );


    star.position.set(

        (Math.random()-0.5)*50,

        (Math.random()-0.5)*50,

        -Math.random()*80

    );


    scene.add(star);

}




// ASTEROIDS


function spawnAsteroid(){


    if(gameOver)
        return;



    const asteroid =
    new THREE.Mesh(

        new THREE.IcosahedronGeometry(
            Math.random()*0.5+0.3
        ),


        new THREE.MeshStandardMaterial({

            color:0xff3366,

            emissive:0x330000

        })

    );



    asteroid.position.set(

        (Math.random()-0.5)*8,

        (Math.random()-0.5)*5,

        -30

    );



    scene.add(asteroid);


    asteroids.push(asteroid);



    setTimeout(
        spawnAsteroid,
        1000
    );


}



spawnAsteroid();





function moveShip(){


    if(keys.left)

        ship.position.x-=0.1;


    if(keys.right)

        ship.position.x+=0.1;


    if(keys.up)

        ship.position.y+=0.1;


    if(keys.down)

        ship.position.y-=0.1;



    // limits


    ship.position.x =
    Math.max(
        -4,
        Math.min(
            4,
            ship.position.x
        )
    );


    ship.position.y =
    Math.max(
        -3,
        Math.min(
            3,
            ship.position.y
        )
    );


}





function animate(){


requestAnimationFrame(animate);



if(!gameOver){


    moveShip();



    asteroids.forEach(
    (asteroid,index)=>{


        asteroid.position.z +=0.3;


        asteroid.rotation.x+=0.02;

        asteroid.rotation.y+=0.03;




        if(
        ship.position.distanceTo(
            asteroid.position
        ) < 0.8
        ){


            gameOver=true;


            message.textContent =
            "Game Over 🚀";


        }




        if(
        asteroid.position.z>5
        ){


            scene.remove(asteroid);

            asteroids.splice(
                index,
                1
            );


            score++;

            scoreText.textContent=
            score;


        }



    });


}



renderer.render(
    scene,
    camera
);


}




// CONTROLS


document.addEventListener(
"keydown",
e=>{


if(e.key==="ArrowLeft")
keys.left=true;


if(e.key==="ArrowRight")
keys.right=true;


if(e.key==="ArrowUp")
keys.up=true;


if(e.key==="ArrowDown")
keys.down=true;



});




document.addEventListener(
"keyup",
e=>{


if(e.key==="ArrowLeft")
keys.left=false;


if(e.key==="ArrowRight")
keys.right=false;


if(e.key==="ArrowUp")
keys.up=false;


if(e.key==="ArrowDown")
keys.down=false;


});





// PHONE CONTROL


window.addEventListener(
"touchmove",
e=>{


let x =
e.touches[0].clientX /
window.innerWidth;


let y =
e.touches[0].clientY /
window.innerHeight;



ship.position.x =
(x-0.5)*8;


ship.position.y =
-(y-0.5)*6;



},
{
passive:true
});





// RESIZE


window.addEventListener(
"resize",
()=>{


camera.aspect =
window.innerWidth /
window.innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(
window.innerWidth,
window.innerHeight
);


});





animate();
