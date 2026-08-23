const scene = new THREE.Scene();

scene.background = new THREE.Color(0x020414);



// CAMERA

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 8;



// RENDERER

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);




// LIGHTS

const ambient = new THREE.AmbientLight(
    0x555555
);

scene.add(ambient);


const light = new THREE.PointLight(
    0xffffff,
    4
);

light.position.set(
    0,
    5,
    5
);

scene.add(light);





// SHIP GROUP

let ship =
new THREE.Group();





// ship body

let body =
new THREE.Mesh(

new THREE.ConeGeometry(
0.55,
1.8,
6
),

new THREE.MeshStandardMaterial({

color:0x00aaff,

metalness:0.8,

roughness:0.2,

emissive:0x003366

})

);


body.rotation.x =
Math.PI/2;


ship.add(body);





// cockpit

let cockpit =
new THREE.Mesh(

new THREE.SphereGeometry(
0.25,
16,
16
),

new THREE.MeshStandardMaterial({

color:0x88ffff,

transparent:true,

opacity:0.8

})

);


cockpit.position.z=-0.2;


ship.add(cockpit);





// wings

let wingMaterial =
new THREE.MeshStandardMaterial({

color:0x222244,

metalness:1

});



let wing1 =
new THREE.Mesh(

new THREE.BoxGeometry(
1.6,
0.05,
0.5
),

wingMaterial

);


wing1.position.y=-0.1;


ship.add(wing1);





// engine flame

let flame =
new THREE.Mesh(

new THREE.ConeGeometry(
0.18,
0.8,
12
),

new THREE.MeshBasicMaterial({

color:0xff6600

})

);


flame.rotation.x=
-Math.PI/2;


flame.position.z=0.9;


ship.add(flame);



scene.add(ship);







// STARS

for(let i=0;i<400;i++){


let star =
new THREE.Mesh(

new THREE.SphereGeometry(
0.025
),

new THREE.MeshBasicMaterial({

color:0xffffff

})

);



star.position.set(

(Math.random()-0.5)*60,

(Math.random()-0.5)*60,

-Math.random()*80

);


scene.add(star);


}






let asteroids=[];


let score=0;


let gameOver=false;


let keys={};



const scoreText =
document.getElementById("score");


const message =
document.getElementById("message");






// CREATE ASTEROID


function createAsteroid(){


if(gameOver)
return;



let geometry =
new THREE.IcosahedronGeometry(
Math.random()*0.5+0.4,
1
);



let material =
new THREE.MeshStandardMaterial({

color:0x777777,

roughness:1

});



let asteroid =
new THREE.Mesh(
geometry,
material
);



asteroid.position.set(

(Math.random()-0.5)*8,

(Math.random()-0.5)*5,

-30

);



asteroid.rotation.set(

Math.random()*3,

Math.random()*3,

Math.random()*3

);



scene.add(asteroid);


asteroids.push(asteroid);



setTimeout(
createAsteroid,
900
);


}



createAsteroid();






// MOVEMENT


function moveShip(){


if(keys.left)
ship.position.x-=0.08;


if(keys.right)
ship.position.x+=0.08;


if(keys.up)
ship.position.y+=0.08;


if(keys.down)
ship.position.y-=0.08;



ship.position.x =
THREE.MathUtils.clamp(
ship.position.x,
-4,
4
);


ship.position.y =
THREE.MathUtils.clamp(
ship.position.y,
-3,
3
);



}







function animate(){


requestAnimationFrame(animate);



if(!gameOver){


moveShip();



flame.scale.y =
1+Math.random()*0.5;



asteroids.forEach(
(a,index)=>{


a.position.z+=0.35;


a.rotation.x+=0.02;

a.rotation.y+=0.03;




if(
ship.position.distanceTo(a.position)
<0.9
){

gameOver=true;

message.textContent=
"💥 Destroyed!";


}




if(a.position.z>5){


scene.remove(a);


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






// PHONE

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







window.addEventListener(
"resize",
()=>{


camera.aspect =
window.innerWidth/
window.innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(
window.innerWidth,
window.innerHeight
);


});





animate();
