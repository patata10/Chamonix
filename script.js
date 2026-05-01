let scene,camera,renderer;
let car,wheels=[];
let speed=0,steer=0;
let keys={};
let lights=[];

init();
animate();

function init(){

scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xcce0ff,80,600);

camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,2000);

renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

// llum
scene.add(new THREE.AmbientLight(0xffffff,0.6));
let sun=new THREE.DirectionalLight(0xffffff,1);
sun.position.set(100,200,100);
scene.add(sun);

// terra
let ground=new THREE.Mesh(
new THREE.PlaneGeometry(2000,2000),
new THREE.MeshStandardMaterial({color:0x6ea85d})
);
ground.rotation.x=-Math.PI/2;
scene.add(ground);

// RIU (Arve)
let river=new THREE.Mesh(
new THREE.PlaneGeometry(25,600),
new THREE.MeshStandardMaterial({color:0x4da6ff})
);
river.rotation.x=-Math.PI/2;
river.position.set(30,0.02,-100);
scene.add(river);

// CARRETERA PRINCIPAL CORBA (centre)
createRoadPath();

// PLAÇA CENTRAL
createSquare(0,-100);

// CARRERS SECUNDARIS
createStreet(10,-100);
createStreet(-10,-150);

// PASSOS ZEBRA
createZebra(0,-80);
createZebra(5,-120);

// SEMÀFORS
createLight(2,-80);
createLight(-2,-120);

// EDIFICIS CHALET REALISTES
createChalets();

// COTXE
createCar();

window.addEventListener("keydown",e=>keys[e.key]=true);
window.addEventListener("keyup",e=>keys[e.key]=false);
}

function createRoadPath(){
for(let i=0;i<40;i++){
let road=new THREE.Mesh(
new THREE.PlaneGeometry(12,20),
new THREE.MeshStandardMaterial({color:0x2a2a2a})
);
road.rotation.x=-Math.PI/2;
road.position.set(Math.sin(i*0.3)*10,0,-i*20);
scene.add(road);
}
}

function createStreet(x,z){
for(let i=0;i<10;i++){
let road=new THREE.Mesh(
new THREE.PlaneGeometry(8,15),
new THREE.MeshStandardMaterial({color:0x2a2a2a})
);
road.rotation.x=-Math.PI/2;
road.position.set(x,0,z-i*15);
scene.add(road);
}
}

function createSquare(x,z){
let sq=new THREE.Mesh(
new THREE.PlaneGeometry(40,40),
new THREE.MeshStandardMaterial({color:0x3a3a3a})
);
sq.rotation.x=-Math.PI/2;
sq.position.set(x,0,z);
scene.add(sq);
}

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

// CHALET REALISTA
function createChalets(){
for(let i=0;i<60;i++){

let h=4+Math.random()*4;

// base pedra
let base=new THREE.Mesh(
new THREE.BoxGeometry(6,2,6),
new THREE.MeshStandardMaterial({color:0x888888})
);

// part fusta
let wood=new THREE.Mesh(
new THREE.BoxGeometry(6,h,6),
new THREE.MeshStandardMaterial({color:0x8b5a2b})
);

// sostre
let roof=new THREE.Mesh(
new THREE.ConeGeometry(5,3,4),
new THREE.MeshStandardMaterial({color:0x5a2e1a})
);

let x=(Math.random()>0.5?1:-1)*(15+Math.random()*20);
let z=-Math.random()*300;

base.position.set(x,1,z);
wood.position.set(x,h/2+2,z);
roof.position.set(x,h+3,z);

roof.rotation.y=Math.PI/4;

scene.add(base);
scene.add(wood);
scene.add(roof);
}
}

function createCar(){
car=new THREE.Group();

let body=new THREE.Mesh(
new THREE.BoxGeometry(2,1,4),
new THREE.MeshStandardMaterial({color:0xffffff})
);
body.position.y=1;
car.add(body);

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

function animate(){
requestAnimationFrame(animate);

if(keys["ArrowUp"]) speed+=0.01;
if(keys["ArrowDown"]) speed-=0.01;

speed*=0.98;

if(keys["ArrowLeft"]) steer=0.02;
else if(keys["ArrowRight"]) steer=-0.02;
else steer=0;

car.rotation.y+=steer*speed*5;

car.position.x-=Math.sin(car.rotation.y)*speed;
car.position.z-=Math.cos(car.rotation.y)*speed;

wheels.forEach(w=>w.rotation.x+=speed*3);

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
