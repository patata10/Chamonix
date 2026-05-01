let scene,camera,renderer;
let car,wheels=[];
let speed=0,steer=0;
let keys={};
let lights=[];
let traffic=[];

init();
animate();

function init(){

scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xcce0ff,80,900);

camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,2000);

renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);

// llum
let sun=new THREE.DirectionalLight(0xffffff,1);
sun.position.set(100,200,100);
sun.castShadow=true;
scene.add(sun);

scene.add(new THREE.AmbientLight(0xffffff,0.5));

// terra
let ground=new THREE.Mesh(
new THREE.PlaneGeometry(3000,3000),
new THREE.MeshStandardMaterial({color:0x6ea85d})
);
ground.rotation.x=-Math.PI/2;
scene.add(ground);

// xarxa carrers
createRoadNetwork();

// passos zebra
createZebra(0,-80);
createZebra(10,-200);

// semàfors
createLight(3,-80);
createLight(-3,-200);

// edificis
createBuildings();

// cotxe jugador
createCar();

// trànsit
createTraffic();

window.addEventListener("keydown",e=>keys[e.key]=true);
window.addEventListener("keyup",e=>keys[e.key]=false);
}

// 🛣️ xarxa carrers
function createRoadNetwork(){
for(let j=0;j<3;j++){
for(let i=0;i<60;i++){

let offset=j*25-25;
let x=Math.sin(i*0.2)*10 + offset;

let road=new THREE.Mesh(
new THREE.PlaneGeometry(14,20),
new THREE.MeshStandardMaterial({color:0x2a2a2a})
);
road.rotation.x=-Math.PI/2;
road.position.set(x,0,-i*20);
scene.add(road);

// línies
let line=new THREE.Mesh(
new THREE.BoxGeometry(0.3,0.05,6),
new THREE.MeshStandardMaterial({color:0xffffff})
);
line.position.set(x,0.05,-i*20);
scene.add(line);
}
}
}

// 🚶 zebra
function createZebra(x,z){
for(let i=0;i<8;i++){
let stripe=new THREE.Mesh(
new THREE.BoxGeometry(12,0.05,0.8),
new THREE.MeshStandardMaterial({color:0xffffff})
);
stripe.position.set(x,0.05,z+i*1.5);
scene.add(stripe);
}
}

// 🚦 semàfor
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

// 🏠 edificis més densos
function createBuildings(){
for(let i=0;i<200;i++){

let h=4+Math.random()*6;

let base=new THREE.Mesh(
new THREE.BoxGeometry(6,2,6),
new THREE.MeshStandardMaterial({color:0x888888})
);

let wood=new THREE.Mesh(
new THREE.BoxGeometry(6,h,6),
new THREE.MeshStandardMaterial({color:0x8b5a2b})
);

let roof=new THREE.Mesh(
new THREE.ConeGeometry(5,3,4),
new THREE.MeshStandardMaterial({color:0x5a2e1a})
);

let x=(Math.random()>0.5?1:-1)*(20+Math.random()*30);
let z=-Math.random()*1000;

base.position.set(x,1,z);
wood.position.set(x,h/2+2,z);
roof.position.set(x,h+3,z);

roof.rotation.y=Math.PI/4;

scene.add(base);
scene.add(wood);
scene.add(roof);
}
}

// 🚗 cotxe jugador
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
new THREE.CylinderGeometry(0.5,0.5,0.5,20),
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

// 🚗 trànsit IA
function createTraffic(){
for(let i=0;i<5;i++){
let npc=new THREE.Mesh(
new THREE.BoxGeometry(2,1,4),
new THREE.MeshStandardMaterial({color:0xff0000})
);
npc.position.set((Math.random()-0.5)*30,1,-Math.random()*800);
scene.add(npc);

traffic.push({mesh:npc,speed:0.05+Math.random()*0.05});
}
}

// 🎮 loop
function animate(){
requestAnimationFrame(animate);

// jugador
if(keys["ArrowUp"]) speed+=0.01;
if(keys["ArrowDown"]) speed-=0.01;

speed*=0.97;

if(keys["ArrowLeft"]) steer=0.025;
else if(keys["ArrowRight"]) steer=-0.025;
else steer=0;

car.rotation.y+=steer*speed*5;

car.position.x-=Math.sin(car.rotation.y)*speed;
car.position.z-=Math.cos(car.rotation.y)*speed;

// rodes
wheels.forEach(w=>w.rotation.x+=speed*4);

// càmera
camera.position.set(car.position.x,4,car.position.z+8);
camera.lookAt(car.position.x,2,car.position.z-6);

// trànsit
traffic.forEach(t=>{
t.mesh.position.z+=t.speed;
if(t.mesh.position.z>50) t.mesh.position.z=-800;
});

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
