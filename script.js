let scene,camera,renderer;
let car,wheels=[];
let speed=0,steer=0;
let keys={};
let lights=[];

init();
animate();

function init(){

scene=new THREE.Scene();
camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,2000);

renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

// LLUM
scene.add(new THREE.AmbientLight(0xffffff,0.6));
let sun=new THREE.DirectionalLight(0xffffff,1);
sun.position.set(100,200,100);
scene.add(sun);

// TERRA
let ground=new THREE.Mesh(
new THREE.PlaneGeometry(3000,3000),
new THREE.MeshStandardMaterial({color:0x6ea85d})
);
ground.rotation.x=-Math.PI/2;
scene.add(ground);

// RIU
let river=new THREE.Mesh(
new THREE.PlaneGeometry(30,1500),
new THREE.MeshStandardMaterial({color:0x4da6ff})
);
river.rotation.x=-Math.PI/2;
river.position.x=50;
scene.add(river);

// CARRETERES (xarxa tipus mapa)
createRoad(0,0);
createRoad(10,-200);
createRoad(-15,-400);
createCrossRoad(0,-200);

// PASSOS ZEBRA
createZebra(0,-100);
createZebra(10,-200);

// SEMÀFORS
createLight(2,-100);
createLight(-2,-200);

// EDIFICIS
createCity();

// COTXE
createCar();

window.addEventListener("keydown",e=>keys[e.key]=true);
window.addEventListener("keyup",e=>keys[e.key]=false);
}

// CARRETERES
function createRoad(x,z){
for(let i=0;i<40;i++){
let road=new THREE.Mesh(
new THREE.PlaneGeometry(14,20),
new THREE.MeshStandardMaterial({color:0x2a2a2a})
);
road.rotation.x=-Math.PI/2;
road.position.set(x+Math.sin(i*0.2)*10,0,-i*20+z);
scene.add(road);
}
}

// CRUÏLLA
function createCrossRoad(x,z){
let road=new THREE.Mesh(
new THREE.PlaneGeometry(40,40),
new THREE.MeshStandardMaterial({color:0x2a2a2a})
);
road.rotation.x=-Math.PI/2;
road.position.set(x,0,z);
scene.add(road);
}

// ZEBRA
function createZebra(x,z){
for(let i=0;i<6;i++){
let stripe=new THREE.Mesh(
new THREE.BoxGeometry(3,0.1,1),
new THREE.MeshStandardMaterial({color:0xffffff})
);
stripe.position.set(x,0.05,z+i*2);
scene.add(stripe);
}
}

// SEMÀFOR
function createLight(x,z){
let pole=new THREE.Mesh(
new THREE.BoxGeometry(0.3,5,0.3),
new THREE.MeshStandardMaterial({color:0x333})
);
pole.position.set(x,2.5,z);
scene.add(pole);

let box=new THREE.Mesh(
new THREE.BoxGeometry(1,2,1),
new THREE.MeshStandardMaterial({color:0xff0000})
);
box.position.set(x,5,z);
scene.add(box);

lights.push({mesh:box,t:0,state:0});
}

// EDIFICIS MILLORS
function createCity(){
for(let i=0;i<200;i++){
let h=5+Math.random()*10;

let mat=new THREE.MeshStandardMaterial({
color:0x8b5a2b,
roughness:0.8
});

let b=new THREE.Mesh(
new THREE.BoxGeometry(6,h,6),
mat
);

b.position.set(
(Math.random()>0.5?1:-1)*(20+Math.random()*40),
h/2,
-Math.random()*800
);

scene.add(b);

// sostre
let roof=new THREE.Mesh(
new THREE.ConeGeometry(5,3,4),
new THREE.MeshStandardMaterial({color:0x4b2e1f})
);
roof.position.set(b.position.x,h+1.5,b.position.z);
roof.rotation.y=Math.PI/4;
scene.add(roof);
}
}

// COTXE REAL
function createCar(){
car=new THREE.Group();

let body=new THREE.Mesh(
new THREE.BoxGeometry(2,1,4),
new THREE.MeshStandardMaterial({color:0xffffff})
);
body.position.y=1;
car.add(body);

// rodes
for(let i=0;i<4;i++){
let wheel=new THREE.Mesh(
new THREE.CylinderGeometry(0.5,0.5,0.5,16),
new THREE.MeshStandardMaterial({color:0x111})
);
wheel.rotation.z=Math.PI/2;

let x=(i<2?-1:1);
let z=(i%2?-1.5:1.5);

wheel.position.set(x,0.5,z);
car.add(wheel);
wheels.push(wheel);
}

scene.add(car);
}

// LOOP
function animate(){
requestAnimationFrame(animate);

// moviment
if(keys["ArrowUp"]) speed+=0.01;
if(keys["ArrowDown"]) speed-=0.01;

speed*=0.98;

if(keys["ArrowLeft"]) steer=0.02;
else if(keys["ArrowRight"]) steer=-0.02;
else steer=0;

car.rotation.y+=steer*speed*5;

car.position.x-=Math.sin(car.rotation.y)*speed;
car.position.z-=Math.cos(car.rotation.y)*speed;

// rodes
wheels.forEach(w=>w.rotation.x+=speed*3);

// càmera
camera.position.set(car.position.x,4,car.position.z+8);
camera.lookAt(car.position.x,2,car.position.z-6);

// semàfors
lights.forEach(l=>{
l.t++;
if(l.t>200){
l.state=!l.state;
l.t=0;
l.mesh.material.color.set(l.state?0x00ff00:0xff0000);
}
});

renderer.render(scene,camera);
}
